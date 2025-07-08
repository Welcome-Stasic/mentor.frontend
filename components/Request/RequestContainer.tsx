'use client';

import { useQuizzes } from '@/hooks/useQuizzes';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Pagination,
  Chip,
  Grid,
} from '@mui/material';
import { useState } from 'react';
import { RequestCard } from './RequestCard';
import { useDepartments } from '@/hooks/useDepartments';
import { useQuizStatues } from '@/hooks/useQuizStatues';
import { IQuizStatus } from '@/lib/axios/types/quiz';

const ITEMS_PER_PAGE = 10;

export const RequestContainer = () => {
  const [category, setCategory] = useState<IQuizStatus>({ id: '', name: 'Все' });
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const { data, isLoading, isError } = useQuizzes({
    pageNumber: page,
    pageSize: ITEMS_PER_PAGE,
    sortDirection: sortOrder === 'newest' ? 'desc' : 'asc',
    statusId: category.id,
  });

  const { data: departments } = useDepartments();
  const { data: statues } = useQuizStatues();

  const quizzes = data?.Result?.data || [];
  const allQuizStatues = statues || [];

  const pageCount = Math.ceil((data?.Result?.totalCount || 0) / ITEMS_PER_PAGE);

  const categories = [{ id: '', name: 'Все' }, ...allQuizStatues];

  const handleCategoryChange = (selectedCategory: IQuizStatus) => {
    setCategory(selectedCategory);
    setPage(1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortOrder(event.target.value as 'newest' | 'oldest');
  };

  return (
    <Box>
      <Box mb={4} display="flex" flexWrap="wrap" gap={2} justifyContent="space-between">
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.name}
              color={category.id === cat.id ? 'primary' : 'default'}
              variant={category.id === cat.id ? 'filled' : 'outlined'}
              onClick={() => handleCategoryChange(cat)}
              clickable
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Поиск"
            variant="outlined"
            size="small"
            value={search}
            onChange={handleSearchChange}
            sx={{ minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="sort-select-label">Сортировка по дате</InputLabel>
            <Select
              labelId="sort-select-label"
              value={sortOrder}
              onChange={handleSortChange}
              label="Сортировка по дате">
              <MenuItem value="newest">Сначала новые</MenuItem>
              <MenuItem value="oldest">Сначала старые</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Карточки */}
      <Grid container spacing={3}>
        {isLoading ? (
          <Typography>Загрузка...</Typography>
        ) : isError ? (
          <Typography color="error">Ошибка загрузки анкет</Typography>
        ) : quizzes.length === 0 ? (
          <Typography variant="h6" color="text.secondary" textAlign="center" width="100%">
            Анкет не найдено
          </Typography>
        ) : (
          quizzes.map((quiz) => (
            <RequestCard key={quiz.id} quiz={quiz} departments={departments || []} />
          ))
        )}
      </Grid>

      {/* Пагинация */}
      {pageCount > 1 && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={pageCount}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
};
