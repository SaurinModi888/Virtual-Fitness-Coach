import json
import os
from flask import current_app

class LLMRecommendationEngine:
    def get_api_key(self):
        try:
            return current_app.config.get('GEMINI_API_KEY') or os.environ.get('GEMINI_API_KEY', '')
        except Exception:
            return os.environ.get('GEMINI_API_KEY', '')

    def generate_routine(self, user_profile, target_muscle, equipment, duration_minutes, fitness_level):
        """
        Generates a structured workout routine using Google Gemini API or an intelligent algorithmic fallback.
        """
        api_key = self.get_api_key()
        if api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=api_key)
                model = genai.GenerativeModel('gemini-1.5-flash')
                
                prompt = f"""
                You are a certified elite strength & conditioning AI fitness coach.
                Generate a structured JSON workout routine for a user with the following profile:
                - Age: {user_profile.get('age', 25)}
                - Fitness Level: {fitness_level}
                - Goal: {user_profile.get('goal', 'General Fitness')}
                - Target Muscle Group: {target_muscle}
                - Available Equipment: {equipment}
                - Duration: {duration_minutes} minutes

                Return ONLY a raw JSON object (no markdown formatting, no code blocks) with the following structure:
                {{
                    "title": "A catchy motivational routine title",
                    "target_muscle": "{target_muscle}",
                    "difficulty_level": "{fitness_level}",
                    "total_duration": {duration_minutes},
                    "estimated_calories": integer,
                    "exercises": [
                        {{
                            "name": "Exercise Name",
                            "sets": integer,
                            "reps_or_duration": "10-12 reps" or "45 secs",
                            "rest_seconds": integer,
                            "instructions": "Clear execution tip",
                            "target_muscle": "Specific muscle targeted"
                        }}
                    ]
                }}
                """
                response = model.generate_content(prompt)
                clean_text = response.text.strip().replace('```json', '').replace('```', '')
                routine_data = json.loads(clean_text)
                return routine_data
            except Exception as e:
                print(f"Gemini API call failed or missing: {e}. Falling back to algorithmic engine.")

        # Fallback Algorithmic Generator
        return self._generate_algorithmic_fallback(user_profile, target_muscle, equipment, duration_minutes, fitness_level)

    def _generate_algorithmic_fallback(self, user_profile, target_muscle, equipment, duration_minutes, fitness_level):
        """
        Algorithmic fallback that constructs a personalized routine based on exercise templates.
        """
        exercise_bank = {
            "Chest": [
                {"name": "Standard Push-ups", "sets": 3, "reps_or_duration": "12-15 reps", "rest_seconds": 45, "instructions": "Keep body straight, lower chest until elbows reach 90 degrees.", "target_muscle": "Chest & Triceps"},
                {"name": "Dumbbell Bench Press", "sets": 4, "reps_or_duration": "10-12 reps", "rest_seconds": 60, "instructions": "Lie flat, press dumbbells smoothly up without locking elbows.", "target_muscle": "Chest"},
                {"name": "Incline Push-ups", "sets": 3, "reps_or_duration": "12 reps", "rest_seconds": 45, "instructions": "Place hands elevated on a bench or chair for lower chest emphasis.", "target_muscle": "Upper Chest"},
                {"name": "Chest Flyes", "sets": 3, "reps_or_duration": "12-15 reps", "rest_seconds": 60, "instructions": "Maintain slight bend in elbows, open chest wide and squeeze at top.", "target_muscle": "Pectorals"}
            ],
            "Legs": [
                {"name": "Bodyweight Squats", "sets": 4, "reps_or_duration": "15-20 reps", "rest_seconds": 45, "instructions": "Drive through heels, sit back like taking a chair seat.", "target_muscle": "Quadriceps & Glutes"},
                {"name": "Walking Lunges", "sets": 3, "reps_or_duration": "12 per leg", "rest_seconds": 60, "instructions": "Keep torso upright, step forward dropping back knee toward ground.", "target_muscle": "Hamstrings & Glutes"},
                {"name": "Glute Bridges", "sets": 3, "reps_or_duration": "15 reps", "rest_seconds": 45, "instructions": "Squeeze glutes at top hold for 2 seconds before lowering.", "target_muscle": "Glutes"},
                {"name": "Calf Raises", "sets": 4, "reps_or_duration": "20 reps", "rest_seconds": 30, "instructions": "Raise high on toes, pause, slowly control down.", "target_muscle": "Calves"}
            ],
            "Core": [
                {"name": "Plank Hold", "sets": 3, "reps_or_duration": "45 secs", "rest_seconds": 30, "instructions": "Brace core like getting punched, pull navel to spine.", "target_muscle": "Abs & Lower Back"},
                {"name": "Russian Twists", "sets": 3, "reps_or_duration": "20 twists", "rest_seconds": 45, "instructions": "Rotate torso controlled left and right maintaining elevated feet.", "target_muscle": "Obliques"},
                {"name": "Bicycle Crunches", "sets": 3, "reps_or_duration": "15 per side", "rest_seconds": 45, "instructions": "Opposite elbow to knee with full leg extension.", "target_muscle": "Rectus Abdominis"},
                {"name": "Mountain Climbers", "sets": 3, "reps_or_duration": "30 secs", "rest_seconds": 30, "instructions": "Fast rhythmic knee drives in plank position.", "target_muscle": "Core & Cardio"}
            ],
            "Full Body": [
                {"name": "Jumping Jacks", "sets": 3, "reps_or_duration": "60 secs", "rest_seconds": 30, "instructions": "Light landing on toes, full overhead arm movement.", "target_muscle": "Full Body Cardio"},
                {"name": "Burpees", "sets": 3, "reps_or_duration": "10 reps", "rest_seconds": 60, "instructions": "Plank drop, chest tap, jump back in and explosive overhead jump.", "target_muscle": "Full Body Power"},
                {"name": "Dumbbell Thrusters", "sets": 4, "reps_or_duration": "10-12 reps", "rest_seconds": 60, "instructions": "Full squat into immediate overhead shoulder press.", "target_muscle": "Legs & Shoulders"},
                {"name": "High Knees", "sets": 3, "reps_or_duration": "45 secs", "rest_seconds": 30, "instructions": "Drive knees above hip level rapidly while pumping arms.", "target_muscle": "Cardio & Core"}
            ]
        }

        selected_exercises = exercise_bank.get(target_muscle, exercise_bank["Full Body"])
        
        # Adjust sets/reps by fitness level
        multiplier = 1.2 if fitness_level == 'Advanced' else (1.0 if fitness_level == 'Intermediate' else 0.8)
        estimated_calories = int(duration_minutes * 8.5 * multiplier)

        return {
            "title": f"Dynamic {fitness_level} {target_muscle} Power Routine",
            "target_muscle": target_muscle,
            "difficulty_level": fitness_level,
            "total_duration": duration_minutes,
            "estimated_calories": estimated_calories,
            "exercises": selected_exercises
        }
