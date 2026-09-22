import React, { useState, useEffect } from 'react';
import { wellnessAPI } from '../../services/api';
import { HeartPulse, Play, Pause, Wind, Smile, Sparkles, CheckCircle2 } from 'lucide-react';

const WellnessStudio = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioRef, setAudioRef] = useState(null);

  // Breathing Coach States
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('Inhale');
  const [breathingScale, setBreathingScale] = useState(1);

  // Mood Form States
  const [moodRating, setMoodRating] = useState(4);
  const [stressLevel, setStressLevel] = useState('Moderate');
  const [note, setNote] = useState('');
  const [moodSaved, setMoodSaved] = useState(false);
  const [loggingMood, setLoggingMood] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    let timer = null;
    if (breathingActive) {
      const phases = [
        { phase: 'Inhale Deeply (4s)', scale: 1.4, duration: 4000 },
        { phase: 'Hold Breath (4s)', scale: 1.4, duration: 4000 },
        { phase: 'Exhale Slowly (4s)', scale: 1.0, duration: 4000 },
        { phase: 'Rest (4s)', scale: 1.0, duration: 4000 }
      ];

      let currentIdx = 0;
      const cycle = () => {
        const item = phases[currentIdx];
        setBreathingPhase(item.phase);
        setBreathingScale(item.scale);
        currentIdx = (currentIdx + 1) % phases.length;
      };

      cycle();
      timer = setInterval(cycle, 4000);
    } else {
      setBreathingPhase('Click Start to Begin');
      setBreathingScale(1.0);
    }
    return () => clearInterval(timer);
  }, [breathingActive]);

  const fetchSessions = async () => {
    try {
      const res = await wellnessAPI.getSessions();
      setSessions(res.data);
      if (res.data.length > 0) {
        setActiveSession(res.data[0]);
      }
    } catch (err) {
      console.error("Failed to load wellness sessions:", err);
    }
  };

  const toggleAudio = (session) => {
    if (activeSession?.id === session.id && isPlayingAudio) {
      audioRef?.pause();
      setIsPlayingAudio(false);
    } else {
      if (audioRef) audioRef.pause();
      const newAudio = new Audio(session.media_url);
      newAudio.play().catch(() => {});
      setAudioRef(newAudio);
      setActiveSession(session);
      setIsPlayingAudio(true);
      newAudio.onended = () => setIsPlayingAudio(false);
    }
  };

  const handleMoodSubmit = async (e) => {
    e.preventDefault();
    setLoggingMood(true);
    try {
      await wellnessAPI.logMood({
        mood_rating: parseInt(moodRating, 10),
        stress_level: stressLevel,
        note: note
      });
      setMoodSaved(true);
      setNote('');
      setTimeout(() => setMoodSaved(false), 3000);
    } catch (err) {
      console.error("Failed to log mood:", err);
    } finally {
      setLoggingMood(false);
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold text-uppercase text-purple-theme mb-1 d-flex align-items-center gap-2">
            <HeartPulse className="text-primary" size={28} /> MIND AND BODY WELLNESS STUDIO
          </h2>
          <p className="text-secondary fs-7 mb-0">
            Holistic approach integrating mental and physical wellness, guided breathing, and meditation.
          </p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Breathing Rhythm Coach */}
        <div className="col-12 col-lg-6">
          <div className="card card-theme p-4 h-100 d-flex flex-column align-items-center text-center border-0 shadow-sm">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Wind className="text-info" size={22} />
              <h5 className="fw-bold text-dark text-uppercase mb-0">Box Breathing Coach</h5>
            </div>
            <p className="text-secondary fs-7 mb-4">
              Synchronize your lungs with the rhythm circle to relieve tension.
            </p>

            <div className="my-auto py-4 d-flex align-items-center justify-content-center">
              <div
                className="rounded-circle bg-light border border-info border-3 d-flex align-items-center justify-content-center shadow-sm"
                style={{
                  width: '180px',
                  height: '180px',
                  transform: `scale(${breathingScale})`,
                  transition: 'transform 4s ease-in-out'
                }}
              >
                <span className="fw-bold text-dark fs-6 px-3">{breathingPhase}</span>
              </div>
            </div>

            <button
              onClick={() => setBreathingActive(!breathingActive)}
              className={`btn ${breathingActive ? 'btn-warning text-dark' : 'btn-blue-action'} px-4 py-2 fw-bold mt-auto d-inline-flex align-items-center gap-2 shadow-sm`}
            >
              {breathingActive ? <Pause size={18} /> : <Play size={18} />}
              <span>{breathingActive ? 'STOP SESSION' : 'START 4-4-4-4 BREATHING'}</span>
            </button>
          </div>
        </div>

        {/* Guided Audio Sessions */}
        <div className="col-12 col-lg-6">
          <div className="card card-theme p-4 h-100 border-0 shadow-sm">
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h5 className="fw-bold text-dark text-uppercase mb-0 d-flex align-items-center gap-2">
                <Sparkles className="text-warning" size={20} /> Guided Audio Sessions
              </h5>
              <span className="badge bg-light text-dark border rounded-pill px-3">
                AUDIO LIBRARY
              </span>
            </div>

            <div className="d-flex flex-column gap-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-3 rounded-3 border transition-all ${
                    activeSession?.id === session.id
                      ? 'bg-light border-primary shadow-sm'
                      : 'bg-white border-light text-secondary'
                  }`}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <span className="badge bg-light text-dark border fs-8 mb-1">
                        {session.type} • {session.duration_minutes} mins
                      </span>
                      <h6 className="fw-bold text-dark mb-1">{session.title}</h6>
                      <p className="fs-8 text-secondary mb-0">{session.description}</p>
                    </div>

                    <button
                      onClick={() => toggleAudio(session)}
                      className={`btn ${activeSession?.id === session.id && isPlayingAudio ? 'btn-warning' : 'btn-blue-action'} rounded-circle p-3 shadow-sm ms-3`}
                    >
                      {activeSession?.id === session.id && isPlayingAudio ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mood & Mental Log */}
      <div className="card card-theme p-4 border-0 shadow-sm">
        <h5 className="fw-bold text-uppercase text-purple-theme mb-3 d-flex align-items-center gap-2">
          <Smile className="text-success" size={22} /> Daily Mental Wellness Log
        </h5>

        {moodSaved && (
          <div className="alert alert-success bg-light text-success border rounded-3 p-3 mb-3 d-flex align-items-center gap-2 fs-7">
            <CheckCircle2 size={18} />
            <span>Wellness log saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleMoodSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <label className="form-label text-dark fs-7 fw-semibold">Daily Mood Rating: {moodRating} / 5</label>
              <input
                type="range"
                className="form-range"
                min="1"
                max="5"
                step="1"
                value={moodRating}
                onChange={(e) => setMoodRating(e.target.value)}
              />
              <div className="d-flex justify-content-between text-muted fs-8">
                <span>1 (Low)</span>
                <span>3 (Neutral)</span>
                <span>5 (Excellent)</span>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label text-dark fs-7 fw-semibold">Perceived Stress Level</label>
              <select
                className="form-select bg-white border text-dark"
                value={stressLevel}
                onChange={(e) => setStressLevel(e.target.value)}
              >
                <option value="Low">Low (Relaxed)</option>
                <option value="Moderate">Moderate (Manageable)</option>
                <option value="High">High (Elevated)</option>
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label text-dark fs-7 fw-semibold">Reflection Note</label>
              <input
                type="text"
                className="form-control bg-white border text-dark"
                placeholder="Felt energized after today's routine..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="col-12 text-end">
              <button
                type="submit"
                className="btn btn-blue-action px-4 py-2 fw-bold text-uppercase fs-7"
                disabled={loggingMood}
              >
                {loggingMood ? 'Saving...' : 'SAVE WELLNESS LOG'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WellnessStudio;
