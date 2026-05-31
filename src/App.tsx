/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES_DATA, Question, Category, Team, soundFX } from './questions';
import { Sparkles, Trophy, Volume2, VolumeX, HelpCircle, RotateCcw, Award, CheckCircle, Home, LogOut, ArrowRight, UserCheck } from 'lucide-react';
import SetupScreen from './components/SetupScreen';
import ScoreBoard from './components/ScoreBoard';
import QuestionModal from './components/QuestionModal';
import WinScreen from './components/WinScreen';
import EmojiExplosion from './components/EmojiExplosion';

export default function App() {
  const [gameMode, setGameMode] = useState<'setup' | 'solo' | 'classroom' | 'win'>('setup');
  
  // Game state
  const [teams, setTeams] = useState<Team[]>([]);
  const [solvedList, setSolvedList] = useState<string[]>([]);
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
  const [soloScore, setSoloScore] = useState<number>(0);
  
  // Modal tracking
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  // Miscellaneous options
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // Inline iframe-secure confirmation states
  const [quitConfirm, setQuitConfirm] = useState<boolean>(false);
  const [winConfirm, setWinConfirm] = useState<boolean>(false);

  // Auto-reset timers for confirmations
  useEffect(() => {
    if (quitConfirm) {
      const timer = setTimeout(() => setQuitConfirm(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [quitConfirm]);

  useEffect(() => {
    if (winConfirm) {
      const timer = setTimeout(() => setWinConfirm(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [winConfirm]);

  // Sync mute state with soundFX (we'll implement basic mute toggle check inside our code)
  useEffect(() => {
    // In our Web Audio API soundFX manager, we can mock volume or ignore triggers.
    // We can wrap soundFX trigger with isMuted checks.
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      // playing a pop to verify it's unmuted
      soundFX.playPop();
    }
  };

  const handleStartSolo = () => {
    setGameMode('solo');
    setSolvedList([]);
    setSoloScore(0);
    if (!isMuted) soundFX.playPop();
  };

  const handleStartClassroom = (configuredTeams: Team[]) => {
    setTeams(configuredTeams);
    setGameMode('classroom');
    setSolvedList([]);
    setActiveTeamId(configuredTeams[0]?.id || null);
    if (!isMuted) soundFX.playPop();
  };

  const handleSelectQuestion = (question: Question, category: Category) => {
    if (solvedList.includes(question.id)) return;
    setActiveQuestion(question);
    setActiveCategory(category);
    if (!isMuted) soundFX.playPop();
  };

  // Callback when student answers in Solo Mode
  const handleAnswerSolo = (isCorrect: boolean) => {
    if (!activeQuestion) return;

    if (isCorrect) {
      setSoloScore((prev) => prev + activeQuestion.points);
      setShowCelebration(true); // Trigger emoji firework
    }

    setSolvedList((prev) => [...prev, activeQuestion.id]);
    setActiveQuestion(null);
    setActiveCategory(null);

    // Auto check victory when remaining is 0
    // Total questions across 5 categories * 5 questions = 25
    if (solvedList.length + 1 >= 25) {
      setTimeout(() => {
        setGameMode('win');
      }, 800);
    }
  };

  // Callback when student/teacher resolves points in Classroom Mode
  const handleAnswerClassroom = (recipientTeamId: string | null, isCorrect: boolean) => {
    if (!activeQuestion) return;

    // Allocate points if correct and winner exists
    if (isCorrect && recipientTeamId) {
      setTeams((prevTeams) =>
        prevTeams.map((t) =>
          t.id === recipientTeamId ? { ...t, score: t.score + activeQuestion.points } : t
        )
      );
      setShowCelebration(true); // Trigger emoji firework
    }

    setSolvedList((prev) => [...prev, activeQuestion.id]);
    
    // Cycle turn direction (round-robin)
    if (teams.length > 1) {
      const currentIdx = teams.findIndex((t) => t.id === activeTeamId);
      const nextIdx = (currentIdx + 1) % teams.length;
      setActiveTeamId(teams[nextIdx].id);
    }

    setActiveQuestion(null);
    setActiveCategory(null);

    // Auto check victory
    if (solvedList.length + 1 >= 25) {
      setTimeout(() => {
        setGameMode('win');
      }, 1000);
    }
  };

  // Handle direct scoreboard modification (teacher custom plus/minus overrides)
  const handleModifyScore = (teamId: string, amount: number) => {
    setTeams((prevTeams) =>
      prevTeams.map((t) => (t.id === teamId ? { ...t, score: Math.max(0, t.score + amount) } : t))
    );
  };

  const handleSelectActiveTeam = (teamId: string) => {
    setActiveTeamId(teamId);
    if (!isMuted) soundFX.playPop();
  };

  const handleEndGameEarly = () => {
    setGameMode('win');
    if (!isMuted) soundFX.playWin();
  };

  const handleReset = () => {
    setGameMode('setup');
    setSolvedList([]);
    setTeams([]);
    setActiveTeamId(null);
    setSoloScore(0);
    setActiveQuestion(null);
    setActiveCategory(null);
    if (!isMuted) soundFX.playPop();
  };

  return (
    <div className="min-h-screen bg-[#060ce9] text-white flex flex-col font-sans select-none relative pb-12 border-[12px] border-[#02066d]">
      {/* Absolute overlay: glow radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.55)_100%)] pointer-events-none"></div>

      {/* Sound On-Demand Wrapper Override */}
      {/* We intercept global play triggers based on isMuted */}
      <div className="hidden">
        {(() => {
          // Sync system mute state dynamically
          if (isMuted) {
            soundFX.playCorrect = () => {};
            soundFX.playWrong = () => {};
            soundFX.playPop = () => {};
            soundFX.playWin = () => {};
          } else {
            // Restore standard functional triggers
            const original = new (window.AudioContext || (window as any).webkitAudioContext)();
            soundFX.playCorrect = () => {
              try {
                const now = original.currentTime;
                const osc = original.createOscillator();
                const gain = original.createGain();
                osc.connect(gain); gain.connect(original.destination);
                osc.type = 'triangle'; osc.frequency.setValueAtTime(523.25, now);
                osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15);
                gain.gain.setValueAtTime(0.2, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now); osc.stop(now + 0.35);
              } catch (_) {}
            };
            soundFX.playWrong = () => {
              try {
                const now = original.currentTime;
                const osc = original.createOscillator();
                const gain = original.createGain();
                osc.connect(gain); gain.connect(original.destination);
                osc.type = 'triangle'; osc.frequency.setValueAtTime(293.66, now);
                osc.frequency.linearRampToValueAtTime(220.00, now + 0.2);
                gain.gain.setValueAtTime(0.2, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
                osc.start(now); osc.stop(now + 0.3);
              } catch (_) {}
            };
            soundFX.playPop = () => {
              try {
                const now = original.currentTime;
                const osc = original.createOscillator();
                const gain = original.createGain();
                osc.connect(gain); gain.connect(original.destination);
                osc.type = 'sine'; osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(1000, now + 0.08);
                gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now); osc.stop(now + 0.12);
              } catch (_) {}
            };
            soundFX.playWin = () => {
              try {
                const now = original.currentTime;
                [440, 554, 659, 880].forEach((freq, idx) => {
                  const osc = original.createOscillator();
                  const gain = original.createGain();
                  osc.connect(gain); gain.connect(original.destination);
                  osc.type = 'triangle'; osc.frequency.setValueAtTime(freq, now + idx * 0.1);
                  gain.gain.setValueAtTime(0.1, now + idx * 0.1);
                  gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.2);
                  osc.start(now + idx * 0.1); osc.stop(now + idx * 0.1 + 0.25);
                });
              } catch (_) {}
            };
          }
          return null;
        })()}
      </div>

      {gameMode === 'setup' && (
        <SetupScreen onStartSolo={handleStartSolo} onStartClassroom={handleStartClassroom} />
      )}

      {gameMode === 'win' && (
        <WinScreen
          isSoloMode={teams.length === 0}
          soloScore={soloScore}
          teams={teams}
          onReset={handleReset}
        />
      )}

      {(gameMode === 'solo' || gameMode === 'classroom') && (
        <div className="flex-grow flex flex-col p-4 md:p-6 max-w-7xl mx-auto w-full space-y-4 z-10 relative">
          
          {/* Navigation and sound control ribbon */}
          <header className="flex flex-col sm:flex-row justify-between items-center bg-[#02066d] border-4 border-[#d4af37] p-4 gap-3 shadow-[6px_6px_0_#000]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (quitConfirm) {
                    handleReset();
                    setQuitConfirm(false);
                  } else {
                    if (!isMuted) soundFX.playPop();
                    setQuitConfirm(true);
                  }
                }}
                className={`p-2 px-3 rounded-none border font-bold font-kids-rounded cursor-pointer uppercase text-xs transition-colors duration-200 ${
                  quitConfirm 
                    ? 'bg-rose-600 border-white text-white animate-pulse' 
                    : 'bg-[#000033] hover:bg-[#02066d] border-[#d4af37]/75 text-rose-450'
                }`}
                title="Exit Game"
              >
                <LogOut className="w-3.5 h-3.5 inline mr-1" />
                {quitConfirm ? '⚠️ Confirm Quit?' : 'Quit Game'}
              </button>
              
              <div className="h-6 w-[2px] bg-[#d4af37]/45 hidden sm:block"></div>

              <div>
                <h2 className="text-sm md:text-base font-extrabold font-kids-rounded text-white uppercase tracking-wider">
                  ⚔️ WWII Educational Jeopardy!
                </h2>
                <p className="text-[10px] md:text-xs text-yellow-100 font-bold uppercase tracking-wider leading-none mt-1">
                  Owner: <strong className="text-[#d4af37]">Ren Smith</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Point Indicator for solo mode */}
              {gameMode === 'solo' && (
                <div className="bg-[#000033] border-2 border-[#d4af37] text-[#d4af37] px-4 py-1 rounded-none text-xs md:text-sm font-black font-kids-rounded flex items-center gap-1.5 shadow-[3px_3px_0_#000] uppercase">
                  <Award className="w-4 h-4 text-[#d4af37]" />
                  Score: <span className="text-[#00ff00] font-mono text-lg">{soloScore}</span>
                </div>
              )}

              {/* End early option */}
              {gameMode === 'classroom' && (
                <button
                  onClick={() => {
                    if (winConfirm) {
                      handleEndGameEarly();
                      setWinConfirm(false);
                    } else {
                      if (!isMuted) soundFX.playPop();
                      setWinConfirm(true);
                    }
                  }}
                  className={`font-black border-2 px-4 py-1.5 rounded-none text-xs font-kids-rounded transition-colors flex items-center gap-1 cursor-pointer uppercase shadow-[2px_2px_0_#000] ${
                    winConfirm
                      ? 'bg-emerald-600 border-white text-white animate-pulse'
                      : 'bg-[#d4af37] hover:bg-yellow-400 text-[#02066d] border-white'
                  }`}
                >
                  <Trophy className={`w-4 h-4 ${winConfirm ? 'text-white fill-white' : 'text-[#02066d] fill-[#02066d]'}`} />
                  {winConfirm ? '⚠️ Confirm Victory?' : 'Declare Winner'}
                </button>
              )}

              <button
                onClick={toggleMute}
                className="p-2 rounded-none bg-[#000033] border-2 border-[#d4af37] text-[#d4af37] hover:bg-[#02066d] transition-colors cursor-pointer"
                title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                id="mute-sound-btn"
              >
                {isMuted ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
              </button>
            </div>
          </header>

          {/* Jeopardy Classroom Instructions Banner */}
          {gameMode === 'classroom' && activeTeamId && (
            <div className="bg-[#02066d] border-4 border-[#d4af37] p-3.5 flex flex-col lg:flex-row lg:items-center justify-between text-xs md:text-sm gap-3 shadow-[4px_4px_0_#000]">
              <div className="space-y-1 font-kids-rounded">
                <div className="flex items-center gap-2 text-[#d4af37] font-black uppercase tracking-wider text-xs">
                  <span className="text-lg animate-bounce">📢</span> Team Play Instructions
                </div>
                <div className="text-yellow-100 font-bold leading-relaxed text-[11px] sm:text-xs">
                  <span className="text-white">1. Choose Mascots</span> (foxes, owls, dolphins, etc.). 
                  <span className="text-slate-300 mx-1">➔</span> 
                  <span className="text-white">2. Choose a point box</span> on the board. 
                  <span className="text-slate-300 mx-1">➔</span> 
                  <span className="text-white">3. Whisper & answer</span> when the host reads the clue! Award points on correct match.
                </div>
              </div>
              <div className="bg-[#000033] border border-[#d4af37]/60 px-4 py-1.5 text-[#00ff00] text-[10px] font-black font-kids-rounded uppercase tracking-wider text-center lg:text-right flex-shrink-0 self-start lg:self-center">
                No penalty for mistakes!
              </div>
            </div>
          )}

          {/* MAIN JEOPARDY BOARD */}
          <div className="flex-grow bg-[#02066d] border-8 border-[#000033] jeopardy-grid-shadow p-4 rounded-none overflow-x-auto relative shadow-[10px_10px_0_#000]">
            
            <div className="min-w-[800px] grid grid-cols-5 gap-4 relative z-10">
              
              {/* Column Headers */}
              {CATEGORIES_DATA.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-[#000033] p-4 rounded-none font-kids-rounded font-black uppercase shadow-[4px_4px_0_#000] flex flex-col items-center justify-center text-center gap-1 tracking-wider border-4 border-[#d4af37]"
                >
                  <span className="text-3xl drop-shadow-md select-none">{cat.emoji}</span>
                  <span className="text-sm text-white font-black drop-shadow-sm">{cat.title.split(' ')[0]}</span>
                  <span className="text-[10px] text-yellow-300 font-bold uppercase mt-0.5 tracking-normal">
                    {cat.id === 'curriculum' ? 'lessons' : cat.id === 'acts' ? 'legal laws' : cat.id}
                  </span>
                </div>
              ))}

              {/* Point Cells row-by-row */}
              {[0, 1, 2, 3, 4].map((questionIdx) => {
                return CATEGORIES_DATA.map((cat) => {
                  const quest = cat.questions[questionIdx];
                  const isSolved = solvedList.includes(quest.id);

                  return (
                    <motion.div
                      key={quest.id}
                      whileHover={!isSolved ? { scale: 1.04, y: -2 } : {}}
                      onClick={() => handleSelectQuestion(quest, cat)}
                      className={`h-24 md:h-28 rounded-none flex flex-col items-center justify-center relative cursor-pointer border-4 transition-all duration-300 ${
                        isSolved
                          ? 'bg-[#000033]/60 border-[#02066d]/60 text-blue-900/40 cursor-not-allowed shadow-inner'
                          : 'bg-[#000033] border-[#d4af37] hover:bg-[#02066d] hover:border-white shadow-[4px_4px_0_#000] group'
                      }`}
                    >
                      {isSolved ? (
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <CheckCircle className="w-5 h-5 text-blue-900" />
                          <span className="text-blue-900/80 font-black font-kids-rounded text-xs select-none uppercase">SOLVED</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase select-none group-hover:text-yellow-300 transition-colors">
                            PTS
                          </span>
                          <span className="text-2xl md:text-3xl font-black font-mono text-[#d4af37] tracking-tight group-hover:scale-105 transition-transform">
                            {quest.points}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  );
                });
              })}

            </div>
          </div>

          {/* Dashboard info scoreboard (only in Classroom Mode) */}
          {gameMode === 'classroom' && teams.length > 0 && (
            <ScoreBoard
              teams={teams}
              activeTeamId={activeTeamId}
              onModifyScore={handleModifyScore}
              onSelectActiveTeam={handleSelectActiveTeam}
            />
          )}

          {/* Quick instructions for solo mode */}
          {gameMode === 'solo' && (
            <footer className="bg-[#02066d] border-4 border-[#d4af37] p-4 flex justify-between items-center text-xs text-yellow-100 font-kids-rounded shadow-[4px_4px_0_#000]">
              <div className="flex items-center gap-1.5">
                <span>📚 <strong>Study Hint:</strong> Solve the entire board to earn your official <strong>Grand Peace Ambassador</strong> status!</span>
              </div>
              <div className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider">
                Gain full points on correct answers!
              </div>
            </footer>
          )}

        </div>
      )}

      {/* Dynamic Popups overlays */}
      <AnimatePresence>
        {activeQuestion && activeCategory && (
          <QuestionModal
            question={activeQuestion}
            categoryTitle={activeCategory.title}
            categoryColor={activeCategory.color}
            isSoloMode={gameMode === 'solo'}
            teams={teams}
            activeTeamId={activeTeamId}
            onAnswerSolo={handleAnswerSolo}
            onAnswerClassroom={handleAnswerClassroom}
            onClose={() => {
              setActiveQuestion(null);
              setActiveCategory(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Sparks explosion celebrating correct answers */}
      <EmojiExplosion active={showCelebration} onComplete={() => setShowCelebration(false)} />
    </div>
  );
}
