'use client';

import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';

interface ProgressData {
  courseId: string;
  completedModules: number;
  totalModules: number;
  lastAccessed: Date;
  assessmentScores: Record<string, number>;
}

export function ProgressTracker({ studentId, courseId }: {
  studentId: string;
  courseId: string;
}) {
  const [progress, setProgress] = useState<ProgressData | null>(null);

  useEffect(() => {
    // Fetch progress data
    const fetchProgress = async () => {
      const response = await fetch(`/api/progress/${studentId}/${courseId}`);
      const data = await response.json();
      setProgress(data);
    };

    fetchProgress();
  }, [studentId, courseId]);

  if (!progress) return <div>Loading...</div>;

  const completionPercentage = 
    (progress.completedModules / progress.totalModules) * 100;

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-xl font-semibold">Course Progress</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{completionPercentage.toFixed(1)}%</span>
        </div>
        <Progress value={completionPercentage} />
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Assessment Scores</h4>
        {Object.entries(progress.assessmentScores).map(([name, score]) => (
          <div key={name} className="flex justify-between">
            <span>{name}</span>
            <span>{score}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
} 