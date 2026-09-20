from datetime import datetime, timedelta
from app.models.workout import WorkoutLog
from app.models.wellness import MoodLog
from sqlalchemy import func

class AnalyticsEngine:
    @staticmethod
    def get_user_summary(user_id):
        logs = WorkoutLog.query.filter_by(user_id=user_id).order_by(WorkoutLog.date.asc()).all()
        moods = MoodLog.query.filter_by(user_id=user_id).order_by(MoodLog.date.asc()).all()

        total_workouts = len(logs)
        total_calories = sum(log.calories_burned for log in logs)
        total_duration = sum(log.duration_minutes for log in logs)

        # Streak calculation
        streak = 0
        if logs:
            workout_dates = sorted(list(set(log.date.date() for log in logs)), reverse=True)
            today = datetime.utcnow().date()
            
            # Check if logged today or yesterday
            if workout_dates and (workout_dates[0] == today or workout_dates[0] == today - timedelta(days=1)):
                current_check = workout_dates[0]
                for d in workout_dates:
                    if d == current_check:
                        streak += 1
                        current_check -= timedelta(days=1)
                    else:
                        break

        # Weekly workout count (past 7 days)
        one_week_ago = datetime.utcnow() - timedelta(days=7)
        weekly_logs = [log for log in logs if log.date >= one_week_ago]
        weekly_count = len(weekly_logs)
        weekly_goal = 4 # Default target workouts per week
        weekly_progress_pct = min(100, int((weekly_count / weekly_goal) * 100))

        # Recent mood stats
        recent_moods = moods[-7:] if len(moods) >= 7 else moods
        avg_mood = round(sum(m.mood_rating for m in recent_moods) / len(recent_moods), 1) if recent_moods else 4.0

        return {
            "total_workouts": total_workouts,
            "total_calories": total_calories,
            "total_duration_minutes": total_duration,
            "current_streak_days": streak,
            "weekly_workouts_completed": weekly_count,
            "weekly_goal": weekly_goal,
            "weekly_progress_pct": weekly_progress_pct,
            "average_mood_score": avg_mood
        }

    @staticmethod
    def get_chart_data(user_id):
        """
        Returns structured chart datasets for Chart.js rendering on frontend.
        """
        now = datetime.utcnow()
        past_7_days = [(now - timedelta(days=i)).strftime("%a") for i in range(6, -1, -1)]
        
        # Calories per day for past 7 days
        daily_calories = []
        for i in range(6, -1, -1):
            day_start = (now - timedelta(days=i)).replace(hour=0, minute=0, second=0, microsecond=0)
            day_end = day_start + timedelta(days=1)
            cals = WorkoutLog.query.filter(
                WorkoutLog.user_id == user_id,
                WorkoutLog.date >= day_start,
                WorkoutLog.date < day_end
            ).with_entities(func.sum(WorkoutLog.calories_burned)).scalar() or 0
            daily_calories.append(int(cals))

        # Target muscle breakdown
        muscle_stats = WorkoutLog.query.filter_by(user_id=user_id)\
            .with_entities(WorkoutLog.target_muscle, func.count(WorkoutLog.id))\
            .group_by(WorkoutLog.target_muscle).all()

        muscle_labels = [stat[0] for stat in muscle_stats] if muscle_stats else ["Chest", "Legs", "Core", "Full Body"]
        muscle_counts = [stat[1] for stat in muscle_stats] if muscle_stats else [3, 4, 2, 5]

        return {
            "labels": past_7_days,
            "calories_series": daily_calories,
            "muscle_distribution": {
                "labels": muscle_labels,
                "counts": muscle_counts
            }
        }
