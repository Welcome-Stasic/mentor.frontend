'use client';

import { Question, QuestionOption, Questions } from '@/constants';
import { useEffect, useState } from 'react';
import { useDepartments } from './useDepartments';

export const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>(Questions);
  const [departments, setDepartments] = useState<QuestionOption[]>([]);

  const { data } = useDepartments();

  useEffect(() => {
    if (data && data.length > 0) {
      const options = data.map((i) => ({ label: i.name, value: i.id } as QuestionOption));

      setDepartments(options);

      setQuestions((prev) => prev.map((q) => (q.number === 14 ? { ...q, options } : q)));
    }
  }, [data]);

  return { questions, departments };
};
