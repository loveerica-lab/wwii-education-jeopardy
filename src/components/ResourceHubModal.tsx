/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CATEGORIES_DATA } from '../questions';
import { 
  X, BookOpen, Printer, Sparkles, CheckCircle2, Copy
} from 'lucide-react';

interface ResourceHubModalProps {
  onClose: () => void;
}

export default function ResourceHubModal({ onClose }: ResourceHubModalProps) {
  const [activeTab, setActiveTab] = useState<'study_guide' | 'cheat_sheet'>('study_guide');
  const [studyCatIdx, setStudyCatIdx] = useState<number>(0);
  const [copiedState, setCopiedState] = useState<boolean>(false);

  const handleCopyToClipboard = () => {
    let plainText = `WWII EDUCATION JEOPARDY - HOST CHEAT SHEET\n`;
    plainText += `Curator: Ren Smith (4th Grade Project)\n\n`;

    CATEGORIES_DATA.forEach((cat) => {
      plainText += `=========================================\n`;
      plainText += `CATEGORY: ${cat.title}\n`;
      plainText += `=========================================\n\n`;
      cat.questions.forEach((q) => {
        plainText += `[${q.points} Points] Clue: ${q.clue}\n`;
        plainText += `>> Correct Answer: ${q.answer}\n`;
        plainText += `>> Educational Explanation: ${q.explanation}\n\n`;
      });
    });

    navigator.clipboard.writeText(plainText).then(() => {
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2000);
    });
  };

  const handleDownloadPDF = () => {
    let htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>WWII Education Jeopardy - Host Answer Key</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 40px;
      margin: 0 auto;
      max-width: 850px;
      color: #111;
      background: #ffffff;
      line-height: 1.5;
    }
    .header {
      border-bottom: 4px solid #02066d;
      padding-bottom: 12px;
      margin-bottom: 24px;
    }
    h1 {
      font-size: 26px;
      margin: 0;
      color: #02066d;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .meta {
      font-size: 13px;
      color: #555;
      margin-top: 5px;
    }
    .category-section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    .category-title {
      font-size: 16px;
      font-weight: 800;
      color: #02066d;
      background: #f1f5f9;
      padding: 8px 12px;
      margin-bottom: 15px;
      text-transform: uppercase;
      border-left: 6px solid #d4af37;
    }
    .question-block {
      border: 1px solid #cbd5e1;
      padding: 12px 16px;
      margin-bottom: 12px;
      page-break-inside: avoid;
      background: #fff;
    }
    .q-header {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      color: #475569;
      font-size: 11px;
      margin-bottom: 4px;
      text-transform: uppercase;
    }
    .clue {
      font-size: 14px;
      font-style: italic;
      color: #0f172a;
      margin: 6px 0;
    }
    .answer {
      font-size: 13px;
      font-weight: 800;
      color: #166534;
      background: #f0fdf4;
      display: inline-block;
      padding: 2px 8px;
      border: 1px solid #bbf7d0;
      margin: 4px 0;
    }
    .explanation {
      font-size: 12px;
      color: #334155;
      margin-top: 4px;
    }
    .instructions {
      background: #fef08a;
      border: 1px solid #fde047;
      padding: 14px;
      margin-bottom: 24px;
      font-size: 13px;
      color: #713f12;
      border-radius: 4px;
    }
    @media print {
      body { padding: 10px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>WWII Education Jeopardy — Host Cheat Sheet</h1>
    <div class="meta">
      Curator: <strong>Ren Smith</strong> • 4th Grade History Smartboard Project
    </div>
  </div>

  <div class="instructions">
    <strong>💡 CLASSROOM INSTRUCTOR TIP (SAVE AS PDF):</strong> 
    This document was formatted for direct print/PDF creation! In the Print wizard that just opened, select <strong>"Save as PDF"</strong> (or "Microsoft Print to PDF") as your Destination printer. This downloads a high-fidelity PDF copy onto your desktop!
  </div>

  <div class="no-print" style="margin-bottom: 25px; text-align: right;">
    <button onclick="window.print()" style="padding: 10px 20px; background: #02066d; color: white; border: none; font-weight: bold; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px;">
      🖨️ Prompt PDF Print dialog Again
    </button>
  </div>
`;

    CATEGORIES_DATA.forEach((cat) => {
      htmlContent += `
  <div class="category-section">
    <div class="category-title">${cat.emoji} ${cat.title}</div>
      `;

      cat.questions.forEach((q) => {
        htmlContent += `
    <div class="question-block">
      <div class="q-header">
        <span>VALUE: ${q.points} Points</span>
        <span>MASCOT: ${q.emoji}</span>
      </div>
      <div class="clue">"Clue: ${q.clue}"</div>
      <div><strong>Correct Answer:</strong> <span class="answer">${q.answer}</span></div>
      <div class="explanation"><strong>Explanation:</strong> ${q.explanation}</div>
    </div>
        `;
      });

      htmlContent += `
  </div>
      `;
    });

    htmlContent += `
  <script>
    // Prompt print automatically on outer page load
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>`;

    // Download dynamic printable html blob
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'WWII_Jeopardy_Host_Answers_Key.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000033]/90 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-4xl bg-[#02066d] border-[8px] border-[#d4af37] p-6 md:p-8 shadow-[12px_12px_0_#000] relative overflow-hidden my-auto"
      >
        {/* Banner header inside card */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-4 border-[#d4af37] pb-4 mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-[#d4af37] uppercase font-kids-rounded tracking-widest">
              <Sparkles className="w-4.5 h-4.5 text-[#d4af37] fill-[#d4af37]" />
              Scholars & Host Hub
            </div>
            <h2 className="text-2xl md:text-3xl font-black font-kids-rounded text-white mt-1 uppercase tracking-wider">
              Preparation Academy
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 px-5 bg-[#000033] border-4 border-[#d4af37] hover:border-white text-rose-400 hover:text-white font-black text-sm font-kids-rounded transition-colors flex items-center gap-2 cursor-pointer uppercase shadow-[3px_3px_0_#000]"
          >
            <X className="w-4 h-4 stroke-[3]" /> Close Hub
          </button>
        </div>

        {/* Tab Navigation header */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab('study_guide')}
            className={`py-2 px-4 font-black font-kids-rounded text-xs md:text-sm uppercase tracking-wide flex items-center gap-2 border-2 transition-all cursor-pointer ${
              activeTab === 'study_guide'
                ? 'bg-[#d4af37] border-white text-[#02066d] shadow-[3px_3px_0_#000]'
                : 'bg-[#000033] border-[#d4af37]/60 text-slate-300 hover:bg-[#02066d]'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Scholars Study Guide
          </button>

          <button
            onClick={() => setActiveTab('cheat_sheet')}
            className={`py-2 px-4 font-black font-kids-rounded text-xs md:text-sm uppercase tracking-wide flex items-center gap-2 border-2 transition-all cursor-pointer ${
              activeTab === 'cheat_sheet'
                ? 'bg-[#d4af37] border-white text-[#02066d] shadow-[3px_3px_0_#000]'
                : 'bg-[#000033] border-[#d4af37]/60 text-slate-300 hover:bg-[#02066d]'
            }`}
          >
            <Printer className="w-4 h-4" /> Host Answers & PDF Key
          </button>
        </div>

        {/* TAB 1: STUDY GUIDE */}
        {activeTab === 'study_guide' && (
          <div className="space-y-6">
            <div className="bg-[#000033] border-2 border-[#d4af37]/50 p-4 font-kids-rounded text-xs md:text-sm text-yellow-105 leading-relaxed uppercase tracking-wider">
              💡 <strong>Pupils' Handbook:</strong> Choose an educational category below to study the classroom historical questions! Review the clues and master the secrets to secure a victory!
            </div>

            {/* Topic buttons */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {CATEGORIES_DATA.map((cat, idx) => (
                <button
                  key={cat.id}
                  onClick={() => setStudyCatIdx(idx)}
                  className={`py-2 px-3 font-black font-kids-rounded text-[11px] uppercase truncate border-2 transition-all cursor-pointer text-center ${
                    studyCatIdx === idx
                      ? 'bg-[#02066d] border-[#d4af37] text-[#00ff00] font-black shadow-[3px_3px_0_#d4af37] scale-105'
                      : 'bg-[#000033]/60 border-[#d4af37]/30 text-white/80 hover:border-white'
                  }`}
                >
                  <span className="block text-lg mb-0.5">{cat.emoji}</span>
                  {cat.title.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Selected Category Study Cards */}
            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
              <h3 className="text-yellow-300 font-black font-kids-rounded uppercase tracking-widest text-sm pb-1 border-b border-[#d4af37]/20 flex items-center gap-2">
                <span>{CATEGORIES_DATA[studyCatIdx].emoji} Category:</span>
                <span className="text-white">{CATEGORIES_DATA[studyCatIdx].title}</span>
              </h3>

              {CATEGORIES_DATA[studyCatIdx].questions.map((q) => (
                <div 
                  key={q.id}
                  className="bg-[#000033] border-2 border-[#d4af37] p-4 shadow-[4px_4px_0_rgba(0,0,0,0.5)] flex flex-col space-y-2.5 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="bg-[#02066d] border border-[#d4af37]/50 text-white text-[10px] font-black font-kids-rounded py-0.5 px-3 uppercase tracking-wider">
                      {q.points} Points • Answer Clue Study
                    </span>
                    <span className="text-lg">{q.emoji}</span>
                  </div>

                  <p className="text-white font-bold text-xs uppercase leading-relaxed font-kids-rounded">
                    "Clue: {q.clue}"
                  </p>

                  <div className="bg-[#02066d] border-t border-[#d4af37]/25 pt-2.5 mt-1 flex flex-col space-y-1">
                    <div className="text-[#00ff00] text-xs font-black font-kids-rounded uppercase">
                      Answer Key: {q.answer}
                    </div>
                    <p className="text-yellow-100 font-medium font-kids-rounded text-[11px] leading-relaxed">
                      💡 <strong>Why it Matters:</strong> {q.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PRINTABLE ANSWER CHEAT SHEET */}
        {activeTab === 'cheat_sheet' && (
          <div className="space-y-6">
            <div className="bg-[#000033] border-2 border-[#d4af37]/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="font-kids-rounded text-xs text-yellow-100 uppercase tracking-wider leading-relaxed pr-2">
                📂 <strong>Instructors & Game Host Panel:</strong> This section displays the complete game master answering catalog. Save as a gorgeous high-fidelity PDF, print copies for reference, or copy to clipboard.
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={handleCopyToClipboard}
                  className="py-2.5 px-4 bg-[#000033] border-2 border-[#d4af37] text-white hover:border-white font-black text-xs font-kids-rounded uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-[3px_3px_0_#000]"
                >
                  {copiedState ? <CheckCircle2 className="w-4 h-4 text-[#00ff00]" /> : <Copy className="w-4 h-4" />}
                  {copiedState ? "Copied!" : "Copy Text"}
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="py-2.5 px-4 bg-[#00ff00] hover:bg-lime-400 text-slate-900 border-2 border-white font-black text-xs font-kids-rounded uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-[3px_3px_0_#000]"
                >
                  <Printer className="w-4 h-4 stroke-[3]" /> Save as PDF / Print Sheet
                </button>
              </div>
            </div>

            {/* Continuous List of All 25 Questions */}
            <div className="space-y-8 max-h-[380px] overflow-y-auto pr-2">
              {CATEGORIES_DATA.map((cat) => (
                <div key={cat.id} className="space-y-4">
                  <h4 className="text-yellow-300 font-extrabold uppercase font-kids-rounded text-xs tracking-widest pb-1.5 border-b-4 border-[#d4af37]/40 flex items-center gap-1.5">
                    <span>{cat.emoji}</span> 
                    <span className="uppercase text-white">{cat.title} Answers Key</span>
                  </h4>

                  <div className="grid grid-cols-1 gap-3">
                    {cat.questions.map((q) => (
                      <div 
                        key={q.id}
                        className="bg-[#000033]/70 p-4 border-2 border-[#d4af37]/45 rounded-none shadow-sm flex flex-col space-y-1.5 text-white"
                      >
                        <div className="flex items-center justify-between font-mono font-bold text-[10px] text-slate-350">
                          <span>🎯 VALUE: {q.points} PTS</span>
                          <span>MASCOT: {q.emoji}</span>
                        </div>
                        <p className="font-kids-rounded text-[#ffff00] font-bold text-xs uppercase">
                          "{q.clue}"
                        </p>
                        <div className="text-[#00ff00] text-xs font-extrabold uppercase font-kids-rounded mt-1">
                          🔑 ANSWER: <span className="bg-[#000033] px-1.5 py-0.5 ml-1 border border-[#d4af37]/50">{q.answer}</span>
                        </div>
                        <p className="text-yellow-100 font-medium font-kids-rounded text-[10px] leading-relaxed mt-1">
                          <strong>Exposition:</strong> {q.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
