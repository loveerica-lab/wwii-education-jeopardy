/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Team, soundFX } from '../questions';
import { Sparkles, Trophy, Users, User, ArrowRight, Plus, Trash2, Volume2, ShieldAlert, BookOpen } from 'lucide-react';
import ResourceHubModal from './ResourceHubModal';

interface SetupScreenProps {
  onStartSolo: () => void;
  onStartClassroom: (teams: Team[]) => void;
}

const DEFAULT_TEAM_TEMPLATES = [
  { name: 'Red Fox Pioneers', emoji: '🦊', color: 'bg-rose-500 shadow-rose-900/50 text-white' },
  { name: 'Golden Owls', emoji: '🦉', color: 'bg-amber-400 shadow-amber-900/50 text-slate-900' },
  { name: 'Sea Dolphins', emoji: '🐬', color: 'bg-teal-400 shadow-teal-900/50 text-slate-900' },
  { name: 'Brave Pandas', emoji: '🐼', color: 'bg-emerald-500 shadow-emerald-900/50 text-white' },
  { name: 'Challenger Tigers', emoji: '🐯', color: 'bg-orange-500 shadow-orange-900/50 text-white' },
  { name: 'Space Koalas', emoji: '🐨', color: 'bg-purple-500 shadow-purple-900/50 text-white' },
];

export default function SetupScreen({ onStartSolo, onStartClassroom }: SetupScreenProps) {
  const [activeMenu, setActiveMenu] = useState<'lobby' | 'teams_setup'>('lobby');
  const [showResourceHub, setShowResourceHub] = useState<boolean>(false);
  const [teamList, setTeamList] = useState<Team[]>([
    { id: '1', name: 'Red Fox Pioneers', score: 0, emoji: '🦊', color: 'bg-rose-500' },
    { id: '2', name: 'Golden Owls', score: 0, emoji: '🦉', color: 'bg-amber-400' },
    { id: '3', name: 'Sea Dolphins', score: 0, emoji: '🐬', color: 'bg-teal-400' },
  ]);

  const addTeam = () => {
    if (teamList.length >= 6) {
      soundFX.playWrong();
      return;
    }
    soundFX.playPop();
    const nextTemplate = DEFAULT_TEAM_TEMPLATES[teamList.length];
    const newTeam: Team = {
      id: String(Date.now()),
      name: nextTemplate ? nextTemplate.name : `Team ${teamList.length + 1}`,
      emoji: nextTemplate ? nextTemplate.emoji : '🎒',
      score: 0,
      color: nextTemplate ? nextTemplate.color.split(' ')[0] : 'bg-slate-500',
    };
    setTeamList([...teamList, newTeam]);
  };

  const removeTeam = (id: string) => {
    if (teamList.length <= 1) {
      soundFX.playWrong();
      return;
    }
    soundFX.playPop();
    setTeamList(teamList.filter((t) => t.id !== id));
  };

  const updateTeamName = (id: string, name: string) => {
    setTeamList(teamList.map((t) => (t.id === id ? { ...t, name } : t)));
  };

  const updateTeamEmoji = (id: string, emoji: string) => {
    soundFX.playPop();
    setTeamList(teamList.map((t) => (t.id === id ? { ...t, emoji } : t)));
  };

  const handleStartClassroom = () => {
    soundFX.playCorrect();
    onStartClassroom(teamList);
  };

  const handleStartSolo = () => {
    soundFX.playCorrect();
    onStartSolo();
  };

  return (
    <div className="min-h-screen bg-[#060ce9] text-white flex flex-col items-center justify-between p-6 px-4 font-sans relative overflow-hidden border-[12px] border-[#02066d]">
      
      {/* Absolute overlay: glow radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.55)_100%)] pointer-events-none"></div>

      {/* Retro lines layout deco */}
      <div className="absolute top-10 left-10 text-white/5 pointer-events-none select-none text-8xl font-display font-medium">A B C</div>
      <div className="absolute bottom-10 right-10 text-white/5 pointer-events-none select-none text-8xl font-display font-medium">1 + 2 = 3</div>
      <div className="absolute top-1/4 right-20 text-white/5 pointer-events-none select-none text-7xl font-sans font-medium">✏️ 📐 📚</div>
      <div className="absolute bottom-1/4 left-20 text-white/5 pointer-events-none select-none text-7xl font-sans font-medium">🌍 🎒 🏫</div>

      <header className="w-full max-w-4xl text-center pt-8 z-10">
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 bg-[#d4af37] text-[#02066d] font-kids-rounded font-bold py-1 px-4 text-xs md:text-sm tracking-wide mb-4 shadow-[4px_4px_0_#000] border border-white">
            <Sparkles className="w-4 h-4 text-[#02066d] fill-current" />
            4TH GRADE CLASS PROJECT SHOWCASE
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tight leading-none drop-shadow-[5px_5px_0_#000] font-kids-rounded uppercase">
            WWII <span className="text-[#d4af37]">Education</span> Jeopardy!
          </h1>
          <p className="text-yellow-100 text-sm md:text-base mt-4 max-w-xl font-medium tracking-wide">
            Discover how World War II completely rewrote school rules, created free high schools, started hot lunches, and built global peace programs!
          </p>
          <div className="mt-4 text-[#d4af37]/80 text-xs md:text-sm font-bold tracking-[0.2em] border-t border-[#d4af37]/40 pt-3.5 w-full max-w-md mx-auto uppercase">
            Created by: <span className="text-white hover:text-yellow-400 transition-colors">Ren Smith</span>
          </div>
        </motion.div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-4xl flex-grow flex items-center justify-center py-8 z-10">
        {activeMenu === 'lobby' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-6 w-full max-w-3xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* Solo Mode Portal */}
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                onClick={handleStartSolo}
                className="bg-[#02066d] hover:bg-[#000033] border-4 border-[#d4af37] cursor-pointer rounded-none p-8 flex flex-col justify-between shadow-[8px_8px_0_#000] transition-colors duration-300 relative overflow-hidden group"
                id="solo-mode-card"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-2xl transform translate-x-12 -translate-y-12"></div>
                
                <div>
                  <div className="w-12 h-12 rounded-none bg-[#d4af37] text-[#02066d] flex items-center justify-center mb-6 shadow-[3px_3px_0_#000] group-hover:scale-110 transition-transform duration-300">
                    <User className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h2 className="text-2xl font-kids-rounded font-extrabold text-white mb-3 uppercase tracking-tight">
                    JUNIOR HISTORIAN MODE
                  </h2>
                  <div className="space-y-3.5 text-yellow-100 font-medium text-sm leading-relaxed mb-6">
                    <p className="flex items-center gap-2">🚀 Solo practice or with close friends!</p>
                    <p className="flex items-center gap-2">⭐ Dynamic Multiple Choice format.</p>
                    <p className="flex items-center gap-2">🎖️ Collect cool badges & achievements.</p>
                  </div>
                </div>

                <div className="flex items-center text-[#d4af37] font-kids-rounded font-black text-sm group-hover:translate-x-1.5 transition-transform duration-300 uppercase tracking-widest">
                  Play Solo Practice <ArrowRight className="w-4 h-4 ml-2 stroke-[3]" />
                </div>
              </motion.div>

              {/* Classroom / Team Mode Portal */}
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                onClick={() => {
                  soundFX.playPop();
                  setActiveMenu('teams_setup');
                }}
                className="bg-[#02066d] hover:bg-[#000033] border-4 border-[#d4af37] cursor-pointer rounded-none p-8 flex flex-col justify-between shadow-[8px_8px_0_#000] transition-colors duration-300 relative overflow-hidden group"
                id="team-mode-card"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-2xl transform translate-x-12 -translate-y-12"></div>
                
                <div>
                  <div className="w-12 h-12 rounded-none bg-[#d4af37] text-[#02066d] flex items-center justify-center mb-6 shadow-[3px_3px_0_#000] group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h2 className="text-2xl font-kids-rounded font-extrabold text-white mb-3 uppercase tracking-tight">
                    CLASSROOM TEAM BATTLE
                  </h2>
                  <div className="space-y-3.5 text-yellow-100 font-medium text-sm leading-relaxed mb-6">
                    <p className="flex items-center gap-2">👥 Grid selection with buzzer rules.</p>
                    <p className="flex items-center gap-2">🍎 Built for project smartboards.</p>
                    <p className="flex items-center gap-2">🔊 Cool retro double sound effects!</p>
                  </div>
                </div>

                <div className="flex items-center text-[#d4af37] font-kids-rounded font-black text-sm group-hover:translate-x-1.5 transition-transform duration-300 uppercase tracking-widest">
                  Setup Class Teams <ArrowRight className="w-4 h-4 ml-2 stroke-[3]" />
                </div>
              </motion.div>
            </div>

            {/* Scholars Study & Teacher Hub Launcher */}
            <motion.div
              whileHover={{ scale: 1.015, y: -2 }}
              onClick={() => {
                soundFX.playPop();
                setShowResourceHub(true);
              }}
              className="bg-[#02066d] hover:bg-[#000033] border-4 border-[#d4af37] cursor-pointer rounded-none p-5 flex flex-col md:flex-row items-center justify-between shadow-[8px_8px_0_#000] transition-colors duration-300 relative overflow-hidden group gap-4"
              id="resource-hub-launcher-card"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-2xl pointer-events-none transform translate-x-10 -translate-y-10"></div>
              <div className="flex items-center gap-4 text-left w-full md:w-auto">
                <div className="w-12 h-12 rounded-none bg-[#d4af37] text-[#02066d] flex items-center justify-center shadow-[3px_3px_0_#000] flex-shrink-0 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-black font-kids-rounded text-white uppercase tracking-wider">
                    📚 Scholars Prep Center & Host Key
                  </h3>
                  <p className="text-yellow-100 text-[11px] font-bold uppercase tracking-wide leading-tight mt-1 text-yellow-105">
                    Includes safe study worksheets, printable game keys, and fully narrated audible rules!
                  </p>
                </div>
              </div>
              
              <div className="flex-shrink-0 w-full md:w-auto text-center bg-[#000033] border-2 border-[#d4af37] text-[#d4af37] hover:border-white p-2.5 px-6 font-kids-rounded font-black text-xs uppercase tracking-wide transition-all shadow-[3px_3px_0_#000]">
                ENTER STUDY HUB ➔
              </div>
            </motion.div>
          </motion.div>
        ) : (
          /* Custom Team Setup Screen */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl bg-[#02066d] border-4 border-[#d4af37] rounded-none p-6 md:p-8 shadow-[10px_10px_0_#000] relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#d4af37]/30">
              <div>
                <h2 className="text-2xl font-kids-rounded font-black text-[#d4af37] uppercase tracking-tight">
                  Prepare Your Teams
                </h2>
                <p className="text-xs text-yellow-100 font-semibold tracking-wide">
                  Add up to 6 custom teams to face off on the smartboard!
                </p>
              </div>

              <button
                onClick={addTeam}
                disabled={teamList.length >= 6}
                className="flex items-center gap-1.5 bg-[#d4af37] hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-[#02066d] font-black font-kids-rounded py-2 px-4 shadow-[3px_3px_0_#000] border-2 border-white text-sm transition-colors cursor-pointer"
                id="add-team-btn"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> ADD TEAM
              </button>
            </div>

            {/* Team Rows */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1 mb-6">
              {teamList.map((team, idx) => (
                <div
                  key={team.id}
                  className="bg-[#000033] py-3.5 px-4 rounded-none border-2 border-[#d4af37]/60 flex items-center justify-between gap-3 shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
                >
                  <div className="flex items-center gap-3 flex-grow">
                    {/* Emoji selector dropdown or direct picker */}
                    <select
                      value={team.emoji}
                      onChange={(e) => updateTeamEmoji(team.id, e.target.value)}
                      className="bg-[#02066d] border-2 border-[#d4af37] text-white text-xl p-1.5 px-2.5 rounded-none text-center cursor-pointer hover:bg-[#000033] focus:outline-none transition-colors"
                    >
                      {['🦊', '🦉', '🐬', '🐼', '🐯', '🐨', '🦁', '🦖', '🦄', '🐝', '🎨', '🚀'].map((em) => (
                        <option key={em} value={em}>
                          {em}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      maxLength={24}
                      value={team.name}
                      onChange={(e) => updateTeamName(team.id, e.target.value)}
                      className="bg-[#02066d] border-2 border-[#d4af37]/45 text-sm md:text-base px-3 py-2 rounded-none focus:outline-none focus:border-[#d4af37] font-black tracking-wide text-white flex-grow uppercase"
                      placeholder={`Team Name ${idx + 1}`}
                    />
                  </div>

                  <button
                    onClick={() => removeTeam(team.id)}
                    disabled={teamList.length <= 1}
                    className="p-2 text-yellow-100 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Remove Team"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-[#d4af37]/30 pt-6">
              <button
                onClick={() => {
                  soundFX.playPop();
                  setActiveMenu('lobby');
                }}
                className="w-full sm:w-1/3 bg-[#000033] hover:bg-[#02066d] text-yellow-100 border-2 border-[#d4af37]/50 font-bold font-kids-rounded py-3.5 rounded-none text-sm transition-colors cursor-pointer uppercase tracking-wider"
              >
                Back
              </button>
              <button
                onClick={handleStartClassroom}
                className="w-full sm:w-2/3 bg-[#d4af37] hover:bg-yellow-400 text-[#02066d] font-black font-kids-rounded py-3.5 rounded-none text-base shadow-[5px_5px_0_#000] border-2 border-white flex items-center justify-center gap-2 transition-transform active:translate-y-0.5 cursor-pointer uppercase"
                id="start-classroom-game-btn"
              >
                Launch Jeopardy Board <ArrowRight className="w-5 h-5 stroke-[3]" />
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Rules Notice and Speaker Icon footer */}
      <footer className="w-full max-w-4xl border-t border-[#d4af37]/30 mt-4 py-6 z-10 flex flex-col md:flex-row justify-between items-center text-center gap-4">
        <div className="flex items-center gap-2 text-xs text-yellow-100 font-bold bg-[#02066d] p-2.5 px-4 border-2 border-[#d4af37]/65 shadow-[3px_3px_0_#000]">
          <ShieldAlert className="w-4 h-4 text-[#d4af37]" />
          <span>🚀 NO POINT LOSS FOR WRONG ANSWERS! WORLD HISTORY ROCKS!</span>
        </div>
        <div className="text-xs text-[#d4af37] font-bold tracking-[0.2em] uppercase">
          WWII Impact on Education • Curator: Ren Smith
        </div>
      </footer>

      {/* Scholars & Instructors Resource Academy portal */}
      {showResourceHub && (
        <ResourceHubModal onClose={() => setShowResourceHub(false)} />
      )}
    </div>
  );
}
