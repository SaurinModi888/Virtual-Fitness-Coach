import React, { useState, useEffect } from 'react';
import { workoutAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Flame, Play, Pause, RotateCcw, CheckCircle2, Dumbbell, Sparkles, ChevronRight, Award } from 'lucide-react';

const WorkoutGenerator = () => {
  const { user } = useAuth();
  const [targetMuscle, setTargetMuscle] = useState('Full Body');
  const [equipment, setEquipment] = useState('Bodyweight');
  const [duration, setDuration] = useState(20);
  const [fitnessLevel, setFitnessLevel] = useState(user?.fitness_level || 'Intermediate');
  const [generating, setGenerating] = useState(false);
  const [currentRoutine, setCurrentRoutine] = useState(null);

  // Execution Timer States
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(45);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedWorkout, setCompletedWorkout] = useState(false);
  const [logging, setLogging] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3');
        audio.play().catch(() => {});
      } catch (e) {}
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setCompletedWorkout(false);
    try {
      const res = await workoutAPI.generateWorkout({
        target_muscle: targetMuscle,
        equipment: equipment,
        duration_minutes: parseInt(duration, 10),
        fitness_level: fitnessLevel
      });
      setCurrentRoutine(res.data);
      setActiveExerciseIndex(0);
      setTimerSeconds(45);
      setIsTimerRunning(false);
    } catch (err) {
      console.error("Failed to generate routine:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleNextExercise = () => {
    if (!currentRoutine || !currentRoutine.exercises) return;
    if (activeExerciseIndex < currentRoutine.exercises.length - 1) {
      setActiveExerciseIndex((prev) => prev + 1);
      setTimerSeconds(45);
      setIsTimerRunning(false);
    } else {
      setCompletedWorkout(true);
      setIsTimerRunning(false);
    }
  };

  const handleLogWorkout = async () => {
    if (!currentRoutine) return;
    setLogging(true);
    try {
      await workoutAPI.logWorkout({
        workout_name: currentRoutine.title,
        target_muscle: currentRoutine.target_muscle,
        duration_minutes: currentRoutine.total_duration,
        calories_burned: currentRoutine.estimated_calories || currentRoutine.total_duration * 8
      });
      alert('🎉 Workout successfully logged to your progress history!');
      setCompletedWorkout(false);
      setCurrentRoutine(null);
    } catch (err) {
      console.error('Failed to log workout:', err);
    } finally {
      setLogging(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold text-uppercase text-purple-theme mb-1 d-flex align-items-center gap-2">
            <Flame className="text-lime-theme" size={28} /> FITNESS PLANNING & AI GENERATOR
          </h2>
          <p className="text-secondary fs-7 mb-0">
            Tailor parameters and generate an optimal workout routine backed by Virtual Fitness Coach AI.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {/* Form Panel */}
        <div className="col-12 col-lg-5">
          <div className="card card-theme border-0 shadow-sm p-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="p-2 rounded-3 bg-light text-dark border">
                <Sparkles size={20} className="text-primary" />
              </div>
              <h5 className="fw-bold text-dark text-uppercase mb-0">Workout Builder</h5>
            </div>
            <p className="text-secondary fs-7 mb-4">
              Select target muscle groups, duration, and intensity level.
            </p>

            <form onSubmit={handleGenerate}>
              <div className="mb-3">
                <label className="form-label text-dark fs-7 fw-semibold">Target Muscle Group</label>
                <select
                  className="form-select bg-white text-dark border"
                  value={targetMuscle}
                  onChange={(e) => setTargetMuscle(e.target.value)}
                >
                  <option value="Full Body">Full Body</option>
                  <option value="Chest">Chest</option>
                  <option value="Legs">Legs</option>
                  <option value="Core">Core</option>
                  <option value="Arms">Arms</option>
                  <option value="Back">Back</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label text-dark fs-7 fw-semibold">Available Equipment</label>
                <select
                  className="form-select bg-white text-dark border"
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                >
                  <option value="Bodyweight">Bodyweight (No Equipment)</option>
                  <option value="Dumbbells">Dumbbells</option>
                  <option value="Resistance Bands">Resistance Bands</option>
                  <option value="Barbell">Barbell</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label text-dark fs-7 fw-semibold">Workout Duration: {duration} mins</label>
                <input
                  type="range"
                  className="form-range"
                  min="10"
                  max="60"
                  step="5"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-dark fs-7 fw-semibold">Intensity Level</label>
                <select
                  className="form-select bg-white text-dark border"
                  value={fitnessLevel}
                  onChange={(e) => setFitnessLevel(e.target.value)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-blue-action w-100 py-2-5 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                disabled={generating}
              >
                {generating ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    <span>Generating Routine...</span>
                  </>
                ) : (
                  <>
                    <Flame size={18} />
                    <span>GENERATE WORKOUT</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Workout Routine View / Active Player */}
        <div className="col-12 col-lg-7">
          {!currentRoutine && !generating && (
            <div className="card card-theme border-0 shadow-sm p-5 text-center h-100 d-flex flex-column align-items-center justify-content-center">
              <div className="p-4 rounded-circle bg-light border text-secondary mb-3">
                <Dumbbell size={48} />
              </div>
              <h5 className="fw-bold text-dark mb-2">No Active Routine</h5>
              <p className="text-secondary fs-7" style={{ maxWidth: '360px' }}>
                Configure your exercise preferences on the left and click "Generate Workout" to begin your customized session!
              </p>
            </div>
          )}

          {currentRoutine && (
            <div className="card card-theme border-0 shadow-sm p-4 h-100 d-flex flex-column">
              {/* Header Details */}
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                <div>
                  <h4 className="fw-bold text-dark mb-1">{currentRoutine.title}</h4>
                  <div className="d-flex gap-2">
                    <span className="badge bg-light text-dark border rounded-pill">
                      {currentRoutine.target_muscle}
                    </span>
                    <span className="badge bg-light text-dark border rounded-pill">
                      ⏱ {currentRoutine.total_duration} Mins
                    </span>
                    <span className="badge bg-light text-success border rounded-pill">
                      🔥 ~{currentRoutine.estimated_calories || currentRoutine.total_duration * 8} kcal
                    </span>
                  </div>
                </div>
              </div>

              {completedWorkout ? (
                /* Workout Completion View */
                <div className="my-auto text-center py-5">
                  <div className="p-4 rounded-circle bg-success bg-opacity-10 text-success d-inline-flex mb-3">
                    <Award size={54} />
                  </div>
                  <h3 className="fw-bold text-dark mb-2">Workout Completed!</h3>
                  <p className="text-secondary fs-6 mb-4">
                    Great job! You finished <strong>{currentRoutine.title}</strong>.
                  </p>
                  <button
                    onClick={handleLogWorkout}
                    disabled={logging}
                    className="btn btn-success rounded-pill px-5 py-3 fw-bold fs-6 shadow hover-lift d-inline-flex align-items-center gap-2"
                  >
                    {logging ? (
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                    ) : (
                      <>
                        <CheckCircle2 size={22} />
                        <span>Log Session & Save Progress</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Interactive Exercise Player */
                <div>
                  {currentRoutine.exercises && currentRoutine.exercises[activeExerciseIndex] && (
                    <div className="bg-light p-4 rounded-3 border mb-4 shadow-sm">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-dark text-white fs-7">
                          Exercise {activeExerciseIndex + 1} of {currentRoutine.exercises.length}
                        </span>
                        <span className="text-secondary fs-7 fw-semibold">
                          {currentRoutine.exercises[activeExerciseIndex].sets} Sets × {currentRoutine.exercises[activeExerciseIndex].reps_or_duration}
                        </span>
                      </div>

                      <h3 className="fw-bold text-dark mb-2">
                        {currentRoutine.exercises[activeExerciseIndex].name}
                      </h3>
                      <p className="text-secondary fs-7 mb-4">
                        {currentRoutine.exercises[activeExerciseIndex].instructions}
                      </p>

                      {/* Timer Display */}
                      <div className="d-flex align-items-center justify-content-center gap-4 bg-white p-3 rounded-3 border mb-3">
                        <div className="display-5 fw-bold text-dark font-monospace">
                          {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:
                          {(timerSeconds % 60).toString().padStart(2, '0')}
                        </div>
                        <div className="d-flex gap-2">
                          <button
                            onClick={() => setIsTimerRunning(!isTimerRunning)}
                            className={`btn ${isTimerRunning ? 'btn-warning text-dark' : 'btn-blue-action'} rounded-circle p-3 shadow-sm`}
                          >
                            {isTimerRunning ? <Pause size={20} /> : <Play size={20} />}
                          </button>
                          <button
                            onClick={() => {
                              setTimerSeconds(45);
                              setIsTimerRunning(false);
                            }}
                            className="btn btn-outline-secondary rounded-circle p-3"
                          >
                            <RotateCcw size={20} />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={handleNextExercise}
                        className="btn btn-blue-action w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                      >
                        <span>NEXT EXERCISE</span>
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  )}

                  {/* Exercise List Overview */}
                  <h6 className="fw-bold text-dark text-uppercase mb-3">Routine Exercises</h6>
                  <div className="d-flex flex-column gap-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {currentRoutine.exercises?.map((ex, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-3 d-flex align-items-center justify-content-between border ${
                          idx === activeExerciseIndex
                            ? 'bg-white border-primary shadow-sm'
                            : 'bg-light text-secondary'
                        }`}
                      >
                        <div>
                          <div className="fw-semibold fs-7 text-dark">{ex.name}</div>
                          <div className="fs-8 text-muted">{ex.sets} sets • {ex.reps_or_duration}</div>
                        </div>
                        {idx < activeExerciseIndex && <CheckCircle2 size={18} className="text-success" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutGenerator;
