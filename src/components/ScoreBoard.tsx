/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Team, soundFX } from '../questions';
import { Plus, Minus, Trophy, Sparkles, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface ScoreBoardProps {
  teams: Team[];
  activeTeamId: string | null;
  onModifyScore: (teamId: string, amount: number) => void;
  onSelectActiveTeam?: (teamId: string) => void;
}

export default function ScoreBoard({ teams, activeTeamId, onModifyScore, onSelectActiveTeam }: ScoreBoardProps) {
  const handleScoreChange = (teamId: string, amount: number) => {
    soundFX.playPop();
    onModifyScore(teamId, amount);
  };

  return (
    <div className="w-full bg-[#02066d] border-4 border-[#d4af37] p-5 shadow-[6px_6px_0_#000] rounded-none relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 pb-3 border-b border-[#d4af37]/30 gap-2">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#d4af37] fill-[#d4af37]" />
          <h3 className="font-kids-rounded font-black uppercase text-lg text-white tracking-wide">Classroom Scoreboard</h3>
        </div>
        <div className="text-xs text-yellow-105 font-bold uppercase tracking-wider">
          💡 Click a team card to active-turn! Click <span className="bg-[#000033] px-1.5 border border-[#d4af37] text-white">+</span> / <span className="bg-[#000033] px-1.5 border border-[#d4af37] text-white">-</span> to modify points.
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
        {teams.map((team) => {
          const isActive = team.id === activeTeamId;
          return (
            <motion.div
              key={team.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => onSelectActiveTeam && onSelectActiveTeam(team.id)}
              className={`rounded-none p-3 flex flex-col justify-between items-center text-center cursor-pointer relative border transition-all duration-300 ${
                isActive
                  ? 'bg-[#000033] border-4 border-[#d4af37] shadow-[4px_4px_0_#d4af37] ring-4 ring-[#d4af37]/30'
                  : 'bg-[#000033]/60 border-2 border-[#d4af37]/45 hover:border-[#d4af37]'
              }`}
            >
              {/* Highlight badge if active */}
              {isActive && (
                <div className="absolute -top-3.5 bg-[#d4af37] text-[#02066d] text-[10px] font-black font-kids-rounded py-0.5 px-3 border border-white shadow-md flex items-center gap-1 uppercase tracking-wider">
                  <Star className="w-3 h-3 fill-current" /> Turn
                </div>
              )}

              <div className="flex flex-col items-center">
                <span className="text-3xl mb-1 mt-1 drop-shadow-sm select-none">{team.emoji || '🎒'}</span>
                <span className="text-xs font-black text-slate-100 tracking-wider truncate max-w-[120px] font-kids-rounded block uppercase">
                  {team.name}
                </span>
                <motion.span
                  key={team.score}
                  initial={{ scale: 1.3, color: '#00ff00' }}
                  animate={{ scale: 1, color: '#00ff00' }}
                  className="text-2xl font-black font-mono tracking-tight my-1 select-none text-[#00ffFF]"
                >
                  {team.score}
                </motion.span>
              </div>

              {/* Adjust buttons */}
              <div className="flex items-center gap-1.5 mt-2 w-full pt-2 border-t border-[#d4af37]/35 justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleScoreChange(team.id, -100);
                  }}
                  className="p-1 px-1.5 rounded-none bg-[#02066d] hover:bg-rose-500 hover:text-white text-slate-200 border border-[#d4af37]/50 transition-colors"
                  title="Minus 100"
                >
                  <Minus className="w-3 h-3 stroke-[3]" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleScoreChange(team.id, 100);
                  }}
                  className="p-1 px-1.5 rounded-none bg-[#02066d] hover:bg-emerald-500 hover:text-white text-slate-200 border border-[#d4af37]/50 transition-colors"
                  title="Plus 100"
                >
                  <Plus className="w-3 h-3 stroke-[3]" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
