/**
 * Course Creator Wizard Component
 * 
 * Purpose: Multi-step form for creating/editing courses
 * Usage: Used by instructors to create and manage courses
 * 
 * Dependencies:
 * - @hookform/resolvers/zod (form validation)
 * - zod (schema validation)
 * 
 * Related Components:
 * - assignment-manager.tsx
 * - quiz-component.tsx
 * 
 * Database Tables:
 * - Course
 * - Lesson
 */
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const courseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().min(0),
  content: z.string()
});

type CourseData = z.infer<typeof courseSchema>;

interface CourseCreatorProps {
  onSubmit: (data: CourseData) => void;
  initialData?: CourseData;
}

export const CourseCreatorWizard: React.FC<CourseCreatorProps> = ({
  onSubmit,
  initialData
}) => {
  const [step, setStep] = useState(1);
  const { register, handleSubmit, formState: { errors } } = useForm<CourseData>({
    resolver: zodResolver(courseSchema),
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {step === 1 && (
        <div>
          <input {...register('title')} placeholder="Course Title" />
          {errors.title && <span className="text-red-500">{errors.title.message}</span>}
          
          <textarea {...register('description')} placeholder="Course Description" />
          {errors.description && <span className="text-red-500">{errors.description.message}</span>}
        </div>
      )}
      
      {step === 2 && (
        <div>
          <input type="number" {...register('price', { valueAsNumber: true })} placeholder="Price" />
          {errors.price && <span className="text-red-500">{errors.price.message}</span>}
          
          <textarea {...register('content')} placeholder="Course Content" />
          {errors.content && <span className="text-red-500">{errors.content.message}</span>}
        </div>
      )}
      
      <div className="flex justify-between">
        {step > 1 && (
          <button type="button" onClick={() => setStep(step - 1)}>
            Previous
          </button>
        )}
        
        {step < 2 ? (
          <button type="button" onClick={() => setStep(step + 1)}>
            Next
          </button>
        ) : (
          <button type="submit">Create Course</button>
        )}
      </div>
    </form>
  );
};