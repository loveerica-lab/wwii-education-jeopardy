/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FUN_EMOJIS_CORRECT } from '../questions';

interface Particle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  angle: number;
  speed: number;
  rotate: number;
}

interface EmojiExplosionProps {
  active: boolean;
  onComplete?: () => void;
}

export default function EmojiExplosion({ active, onComplete }: EmojiExplosionProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      const newParticles: Particle[] = Array.from({ length: 40 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 400 + Math.random() * 400; // Pixels per second
        const randomEmojiIndex = Math.floor(Math.random() * FUN_EMOJIS_CORRECT.length);
        
        return {
          id: Date.now() + i,
          emoji: FUN_EMOJIS_CORRECT[randomEmojiIndex],
          x: window.innerWidth / 2,
          y: window.innerHeight / 2 - 100, // slightly higher center
          angle: angle,
          speed: speed,
          rotate: Math.random() * 360 - 180,
        };
      });

      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        if (onComplete) onComplete();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [active]);

  return (
    <AnimatePresence>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            x: p.x,
            y: p.y,
            scale: 0.2,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            x: p.x + Math.cos(p.angle) * p.speed * 0.8,
            y: p.y + Math.sin(p.angle) * p.speed * 0.8 + 200, // include artificial gravity
            scale: [0.5, 1.8, 1],
            opacity: [1, 1, 0],
            rotate: p.rotate,
          }}
          transition={{
            duration: 1.4,
            ease: 'easeOut',
          }}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            pointerEvents: 'none',
            fontSize: '2.5rem',
            zIndex: 9999,
          }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
