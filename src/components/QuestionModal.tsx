/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question, Team, soundFX } from '../questions';
import { X, Check, ArrowRight, HelpCircle, Volume2, Clock, RotateCcw } from 'lucide-react';

interface QuestionModalProps {
  question: Question;
  categoryTitle: string;
  categoryColor: string;
  isSoloMode: boolean;
  teams: Team[];
  activeTeamId: string | null;
  onAnswerSolo: (isCorrect: boolean) => void;
  onAnswerClassroom: (awardedTeamId: string | null, isCorrect: boolean) => void;
  onClose: () => void;
}

export default function QuestionModal({
  question,
  categoryTitle,
  categoryColor,
  isSoloMode,
  teams,
  activeTeamId,
  onAnswerSolo,
  onAnswerClassroom,
  onClose,
}: QuestionModalProps) {
  const [selectedSoloOption, setSelectedSoloOption] = useState<string | null>(null);
  const [isSoloAnswered, setIsSoloAnswered] = useState(false);
  const [isSoloCorrect, setIsSoloCorrect] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  
  // Shuffle options whenever the question changes to randomize the choices
  useEffect(() => {
    if (question && question.options) {
      const opts = [...question.options];
      for (let i = opts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opts[i], opts[j]] = [opts[j], opts[i]];
      }
      setShuffledOptions(opts);
    }
  }, [question]);
  
  // Classroom mode states
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [selectedRecipientTeamId, setSelectedRecipientTeamId] = useState<string | null>(activeTeamId);

  // Timer states
  const [timerSeconds, setTimerSeconds] = useState(25);
  const [isTimerActive, setIsTimerActive] = useState(true);

  // Active Team object
  const activeTeam = teams.find((t) => t.id === activeTeamId);

  // Timer countdown hook
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerActive && timerSeconds > 0 && !isSoloAnswered && !isAnswerRevealed) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false);
            soundFX.playWrong();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timerSeconds, isSoloAnswered, isAnswerRevealed]);

  const handleSoloOptionClick = (option: string) => {
    if (isSoloAnswered) return;
    const correct = option === question.answer;
    setSelectedSoloOption(option);
    setIsSoloAnswered(true);
    setIsSoloCorrect(correct);
    setIsTimerActive(false);

    if (correct) {
      soundFX.playCorrect();
    } else {
      soundFX.playWrong();
    }
  };

  const handleSoloContinue = () => {
    onAnswerSolo(isSoloCorrect);
  };

  const handleRevealAnswer = () => {
    soundFX.playPop();
    setIsAnswerRevealed(true);
    setIsTimerActive(false);
  };

  const handleClassroomResolution = (isCorrect: boolean) => {
    if (isCorrect && selectedRecipientTeamId) {
      soundFX.playCorrect();
      onAnswerClassroom(selectedRecipientTeamId, true);
    } else {
      soundFX.playWrong();
      onAnswerClassroom(null, false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000033]/90 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 180 }}
        className="w-full max-w-2xl bg-[#02066d] border-[8px] border-[#d4af37] rounded-none p-6 md:p-8 shadow-[10px_10px_0_#000] relative overflow-hidden my-auto"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#d4af37]/45">
          <div className="flex flex-col">
            <span className="text-xs font-black tracking-widest text-[#d4af37] uppercase font-kids-rounded">
              {categoryTitle}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-kids-rounded font-black text-[#00ff00]">
                {question.points} POINTS
              </span>
              <span className="text-xl">{question.emoji}</span>
            </div>
          </div>

          {/* Classroom timer or simple status */}
          <div className="flex items-center gap-3">
            {!isSoloAnswered && !isAnswerRevealed && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 border-2 text-xs md:text-sm font-black font-kids-rounded transition-all ${
                  timerSeconds > 5
                    ? 'bg-[#000033] border-[#d4af37] text-[#00ff00]'
                    : 'bg-rose-950 border-rose-500 text-rose-400 animate-pulse'
                }`}
              >
                <Clock className="w-4 h-4 text-[#d4af37] stroke-[3]" />
                <span>{timerSeconds}s</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1 px-3 bg-[#000033] border-2 border-[#d4af37] text-rose-400 hover:text-white font-black transition-colors cursor-pointer text-xs font-kids-rounded uppercase"
              title="Close Question"
            >
              CLOSE
            </button>
          </div>
        </div>

        {/* Question Content */}
        <div className="space-y-6 pt-2">
          <div className="bg-[#000033] p-6 rounded-none border-4 border-[#d4af37] relative shadow-[4px_4px_0_#000]">
            <div className="absolute -top-3 left-6 px-3 py-0.5 bg-[#02066d] border-2 border-[#d4af37] text-[10px] font-black text-[#d4af37] tracking-wider uppercase font-kids-rounded">
              The Clue
            </div>
            <p className="text-lg md:text-xl font-bold text-white leading-relaxed text-center font-kids-rounded mt-1 uppercase">
              "{question.clue}"
            </p>
          </div>

          {/* Dual Interactive Interfaces */}
          {isSoloMode ? (
            /* ================= SOLO MODE INTERACTION ================= */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
                {shuffledOptions.map((option, idx) => {
                  const isSelected = selectedSoloOption === option;
                  const isCorrectAnswer = option === question.answer;
                  
                  let btnStyle = 'bg-[#000033] border-2 border-[#d4af37] hover:bg-[#02066d] hover:border-white text-white shadow-[3px_3px_0_#000]';
                  
                  if (isSelected) {
                    btnStyle = 'bg-[#02066d] border-4 border-[#d4af37] text-[#00ff00] shadow-[3px_3px_0_#d4af37]';
                  }
                  
                  if (isSoloAnswered) {
                    if (isCorrectAnswer) {
                      btnStyle = 'border-4 border-emerald-500 bg-emerald-950/80 text-[#00ff00] font-black';
                    } else if (isSelected) {
                      btnStyle = 'border-4 border-rose-600 bg-rose-950/85 text-rose-300';
                    } else {
                      btnStyle = 'opacity-35 border-dashed border-[#d4af37]/45 bg-[#000033] text-slate-400';
                    }
                  }

                  return (
                    <motion.button
                      key={idx}
                      whileHover={!isSoloAnswered ? { scale: 1.015, y: -1 } : {}}
                      onClick={() => handleSoloOptionClick(option)}
                      disabled={isSoloAnswered}
                      className={`py-3.5 px-4 rounded-none text-left font-black text-sm transition-all flex items-center justify-between gap-2.5 ${btnStyle} cursor-pointer uppercase`}
                    >
                      <span className="font-kids-rounded truncate">{option}</span>
                      {isSoloAnswered && isCorrectAnswer && (
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 stroke-[3]" />
                      )}
                      {isSelected && !isCorrectAnswer && isSoloAnswered && (
                        <X className="w-4 h-4 text-rose-400 flex-shrink-0 stroke-[3]" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Solo Explanation Card */}
              <AnimatePresence>
                {isSoloAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-[#000033] border-4 border-[#d4af37] rounded-none space-y-3 shadow-[5px_5px_0_#000]"
                    id="solo-explanation-panel"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 font-black uppercase tracking-wider font-kids-rounded text-xs ${isSoloCorrect ? 'bg-emerald-500/20 text-[#00ff00]' : 'bg-rose-500/20 text-rose-400'}`}>
                        {isSoloCorrect ? '✨ CORRECT! 🎉' : '💪 GREAT TRY!'}
                      </div>
                      <span className="text-xs text-[#d4af37] font-black font-kids-rounded">
                        CORRECT ANSWER: <strong className="text-white uppercase tracking-wide">{question.answer}</strong>
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-yellow-105 leading-relaxed font-kids-rounded font-semibold">
                      {question.explanation}
                    </p>
                    <button
                      onClick={handleSoloContinue}
                      className="w-full mt-2 bg-[#d4af37] hover:bg-yellow-400 text-[#02066d] font-black font-kids-rounded py-3.5 rounded-none text-sm flex items-center justify-center gap-2 border-2 border-white shadow-[4px_4px_0_#000] transition-all cursor-pointer uppercase tracking-wider"
                    >
                      Continue <ArrowRight className="w-4.5 h-4.5 stroke-[3]" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* ================= CLASSROOM TEAM PLAY MODE INTERACTION ================= */
            <div className="space-y-5">
              {/* Show active turn banner if not revealed yet */}
              {!isAnswerRevealed && (
                <div className="bg-[#000033] border-2 border-[#d4af37] rounded-none p-3.5 flex items-center justify-between text-sm shadow-[3px_3px_0_#000]">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{activeTeam?.emoji}</span>
                    <span className="font-kids-rounded font-black text-yellow-100 uppercase tracking-widest text-xs">
                      ACTIVE TEAM: <span className="text-[#00ff00]">{activeTeam?.name}</span>'s TURN
                    </span>
                  </div>
                  <span className="text-xs text-[#d4af37] font-black font-kids-rounded animate-pulse uppercase tracking-wider">
                    🔔 RING IN NOW!
                  </span>
                </div>
              )}

              {!isAnswerRevealed ? (
                <button
                  onClick={handleRevealAnswer}
                  className="w-full bg-[#d4af37] hover:bg-yellow-400 text-[#02066d] font-black font-kids-rounded py-4 rounded-none text-xl shadow-[5px_5px_0_#000] border-2 border-white flex items-center justify-center gap-2.5 transition-transform active:translate-y-0.5 cursor-pointer uppercase"
                  id="reveal-answer-btn"
                >
                  <HelpCircle className="w-6 h-6 stroke-[3]" /> Reveal Answer
                </button>
              ) : (
                /* Admin Reveal Interface */
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-5"
                >
                  {/* Correct Answer Board */}
                  <div className="bg-[#000033] p-5 rounded-none border-4 border-[#d4af37] text-center relative shadow-[4px_4px_0_#000]">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-0.5 bg-[#02066d] border-2 border-[#d4af37] text-[10px] font-black text-[#00ff00] tracking-widest uppercase font-kids-rounded">
                      Correct Answer
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black font-kids-rounded text-yellow-300 mt-2 mb-2 tracking-wide uppercase">
                      {question.answer}
                    </h3>
                    <p className="text-xs md:text-sm text-yellow-105 leading-relaxed font-kids-rounded text-left bg-[#02066d] p-4 border border-[#d4af37]/35 mt-3">
                      💡 <strong className="text-[#00ff00]">Educational Tip:</strong> {question.explanation}
                    </p>
                  </div>

                  {/* Allocate Point controls */}
                  <div className="space-y-3.5 border-t border-[#d4af37]/30 pt-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-black text-slate-300 tracking-wider font-kids-rounded uppercase">
                        Select Recipient Team for Points:
                      </span>
                      <div className="grid grid-cols-2 shadow-inner sm:grid-cols-3 gap-2 p-1.5 bg-[#000033] border-2 border-[#d4af37] rounded-none">
                        {teams.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => {
                              soundFX.playPop();
                              setSelectedRecipientTeamId(t.id);
                            }}
                            className={`py-2 px-2.5 rounded-none border text-xs font-black font-kids-rounded flex items-center gap-1.5 transition-all text-left ${
                              selectedRecipientTeamId === t.id
                                ? 'bg-[#02066d] border-2 border-[#d4af37] text-[#00ff00] shadow-[2px_2px_0_#d4af37]'
                                : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-slate-900'
                            } cursor-pointer`}
                          >
                            <span className="text-base flex-shrink-0">{t.emoji}</span>
                            <span className="truncate pr-1 uppercase tracking-wide">{t.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <button
                        onClick={() => handleClassroomResolution(false)}
                        className="bg-[#000033] hover:bg-rose-950 hover:text-white text-rose-400 border border-rose-500 font-black font-kids-rounded py-3.5 rounded-none text-sm transition-colors cursor-pointer uppercase tracking-wider"
                      >
                        Pass / No Point Award
                      </button>
                      <button
                        onClick={() => handleClassroomResolution(true)}
                        className="bg-[#00ff00] hover:bg-lime-400 text-slate-900 font-black font-kids-rounded py-3.5 rounded-none text-sm shadow-[4px_4px_0_#000] border-2 border-white flex items-center justify-center gap-2 transition-transform active:translate-y-0.5 cursor-pointer uppercase tracking-wider"
                        id="award-points-btn"
                      >
                        <Check className="w-5 h-5 stroke-[3]" /> Award {question.points} Pts!
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
