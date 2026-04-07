"use client";

import { useState, useEffect } from 'react';
import type { TrainingTip } from '../lib/types';
import { getRelevantTips, getRandomTip } from '../lib/tips-library';
import styles from '../marathon.module.css';

interface TipsPanelProps {
  weekNumber?: number;
  phase?: string;
  showMultiple?: boolean;
}

export function TipsPanel({ weekNumber, phase, showMultiple = false }: TipsPanelProps) {
  const [tips, setTips] = useState<TrainingTip[]>([]);

  useEffect(() => {
    if (weekNumber && phase) {
      const relevantTips = getRelevantTips(weekNumber, phase, showMultiple ? 3 : 1);
      setTips(relevantTips);
    } else {
      setTips([getRandomTip()]);
    }
  }, [weekNumber, phase, showMultiple]);

  if (tips.length === 0) return null;

  return (
    <div className={styles.tipsPanel}>
      <h3 className={styles.tipsPanelTitle}>Training Tips</h3>

      <div className={styles.tipsContainer}>
        {tips.map(tip => (
          <div key={tip.id} className={styles.tipCard}>
            <div className={styles.tipHeader}>
              <span className={`${styles.tipCategory} ${styles[`category${tip.category}`]}`}>
                {tip.category.replace('_', ' ')}
              </span>
            </div>
            <h4 className={styles.tipTitle}>{tip.title}</h4>
            <p className={styles.tipContent}>{tip.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
