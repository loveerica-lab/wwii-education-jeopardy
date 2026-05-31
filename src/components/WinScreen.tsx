/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Team, soundFX } from '../questions';
import { Trophy, Star, RotateCcw, Award, Shield, Sparkles, Heart } from 'lucide-react';

interface WinScreenProps {
  isSoloMode: boolean;
  soloScore: number;
  teams: Team[];
  onReset: () => void;
}

export default function WinScreen({ isSoloMode, soloScore, teams, onReset }: WinScreenProps) {
  useEffect(() => {
    // Play great victory fanfare
    soundFX.playWin();
  }, []);

  // Calculate medals for classroom mode
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const highestScore = sortedTeams[0]?.score || 0;
  const isClassroomTieCount = sortedTeams.filter((t) => t.score === highestScore).length;

  const getSoloBadge = (score: number) => {
    if (score >= 5000) return { title: 'Grand Peace Ambassador 🕊️', desc: 'You are an absolute master of WWII history! UNESCO would be proud of your educational wisdom.' };
    if (score >= 3500) return { title: 'Education Officer 📜', desc: 'Incredible job! You know all about major acts, bills, and curriculum efforts that rebuilt school life.' };
    if (score >= 2000) return { title: 'History Detective 🕵️', desc: 'Splendid! You picked up critical clues about history makers and tough battlefields.' };
    return { title: 'Junior Assistant Scout ⛺', desc: 'Wonderful focus! Continue reading and playing to reveal even more awesome history secrets!' };
  };

  const soloBadge = getSoloBadge(soloScore);

  return (
    <div className="min-h-screen bg-[#060ce9] text-white flex flex-col items-center justify-center p-6 px-4 relative overflow-hidden font-sans select-none border-[12px] border-[#02066d]">
      
      {/* Absolute overlay: glow radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.55)_100%)] pointer-events-none"></div>

      {/* Main Celebration Box */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-2xl bg-[#02066d] border-4 border-[#d4af37] p-6 md:p-8 text-center shadow-[10px_10px_0_#000] rounded-none relative z-10"
      >
        {/* Big Rotating Trophy */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
          className="inline-flex p-4 bg-[#000033] border-4 border-[#d4af37] text-[#d4af37] rounded-none mb-6 shadow-[4px_4px_0_#000]"
        >
          <Trophy className="w-14 h-14 text-[#d4af37] fill-[#d4af37]" />
        </motion.div>

        {isSoloMode ? (
          /* ================= SOLO WIN CELEBRATION ================= */
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#d4af37] text-[#02066d] border border-white text-xs font-black font-kids-rounded py-1 px-4 shadow-[2px_2px_0_#000] mb-4 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 fill-[#02066d] text-[#02066d]" /> CAMPAIGN COMPLETE
              </div>
              <h2 className="text-3xl md:text-4xl font-black font-kids-rounded text-white uppercase tracking-tight">
                Awesome Job, Historian!
              </h2>
            </div>

            {/* Score Showcase */}
            <div className="bg-[#000033] p-5 rounded-none border-4 border-[#d4af37] max-w-sm mx-auto shadow-[4px_4px_0_#000]">
              <span className="text-xs font-black text-[#d4af37] font-kids-rounded uppercase tracking-wider block">
                TOTAL SCORE ACHIEVED
              </span>
              <motion.span
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="text-4xl md:text-5xl font-black font-mono text-[#00ff00] leading-tight block mt-1"
              >
                {soloScore} <span className="text-lg font-kids-rounded text-white font-black">PTS</span>
              </motion.span>
            </div>

            {/* Earned Badge */}
            <div className="p-5 bg-[#000033] rounded-none border-4 border-[#d4af37] max-w-md mx-auto space-y-2 shadow-[4px_4px_0_#000]">
              <div className="flex items-center justify-center gap-2 text-[#d4af37]">
                <Award className="w-5 h-5 flex-shrink-0 animate-bounce" />
                <h4 className="font-kids-rounded font-black text-lg text-white uppercase tracking-wider">
                  {soloBadge.title}
                </h4>
              </div>
              <p className="text-xs md:text-sm text-yellow-105 leading-relaxed font-kids-rounded font-semibold">
                {soloBadge.desc}
              </p>
            </div>
          </div>
        ) : (
          /* ================= CLASSROOM TEAM WIN CELEBRATION ================= */
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#d4af37] text-[#02066d] border border-white text-xs font-black font-kids-rounded py-1 px-4 shadow-[2px_2px_0_#000] mb-4 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 fill-[#02066d] text-[#02066d]" /> SHOWDOWN CONCLUDED
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white font-kids-rounded uppercase tracking-tight">
                {isClassroomTieCount > 1 ? "WE HAVE A TIE! 🤝" : "VICTORY IS DECIDED! 🏆"}
              </h2>
            </div>

            {/* Winner Presentation */}
            <div className="bg-[#000033] border-4 border-[#d4af37] p-6 rounded-none max-w-md mx-auto shadow-[4px_4px_0_#000]">
              <span className="text-xs font-black text-[#d4af37] font-kids-rounded uppercase tracking-widest block mb-4">
                FINAL LEADERBOARD STANDINGS
              </span>

              <div className="space-y-3">
                {sortedTeams.map((team, index) => {
                  const is1st = index === 0;
                  const medal = is1st ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🎖️';
                  return (
                    <div
                      key={team.id}
                      className={`flex items-center justify-between p-3 px-4 rounded-none border-2 transition-all ${
                        is1st
                          ? 'bg-[#02066d] border-[#d4af37] text-[#00ff00]'
                          : 'bg-[#02066d]/60 border-[#d4af37]/45 text-yellow-105'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{medal}</span>
                        <span className="text-2xl">{team.emoji}</span>
                        <span className="font-black font-kids-rounded truncate text-sm md:text-base uppercase tracking-wider text-left max-w-[150px]">
                          {team.name}
                        </span>
                      </div>
                      <span className="font-mono font-black text-lg md:text-xl text-white">
                        {team.score} PTS
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Sponsor/Curator Credit in celebration card */}
        <div className="mt-8 border-t border-[#d4af37]/30 pt-5 text-center">
          <p className="text-yellow-105 text-xs font-bold flex items-center justify-center gap-1.5 uppercase tracking-wider">
            <span>Special thanks to our Curator:</span>
            <strong className="text-white font-black hover:text-[#d4af37] transition-colors font-sans">Ren Smith</strong>
            <span>• 4th Grade Project</span>
          </p>
        </div>

        {/* Action button */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onReset}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#d4af37] hover:bg-yellow-400 text-[#02066d] font-black font-kids-rounded rounded-none text-base shadow-[4px_4px_0_#000] border-2 border-white flex items-center justify-center gap-2 transition-transform active:scale-[0.98] cursor-pointer uppercase tracking-wider"
            id="play-again-btn"
          >
            <RotateCcw className="w-5 h-5 stroke-[3]" /> Start New Game
          </button>
        </div>
      </motion.div>
    </div>
  );
}
