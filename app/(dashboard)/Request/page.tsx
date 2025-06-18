'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Pagination,
  Chip,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import { useQuizzesStore } from '@/providers/quizzes-provider';

type Request = {
  id: number;
  name: string;
  age: number;
  category: string;
  description: string;
  photo: string;
  createdAt: string; // ISO дата строки
};

const requestsData: Request[] = [
  {
    id: 1,
    name: 'Анна Иванова',
    age: 28,
    category: 'Категория A',
    description: 'Любит путешествия и спорт',
    photo: '',
    createdAt: '2025-06-10T12:00:00Z',
  },
  {
    id: 2,
    name: 'Иван Петров',
    age: 35,
    category: 'Категория B',
    description: 'Программист и геймер',
    photo: '',
    createdAt: '2025-06-14T09:30:00Z',
  },
  {
    id: 3,
    name: 'Мария Смирнова',
    age: 22,
    category: 'Категория A',
    description: 'Фотограф и блогер',
    photo: '',
    createdAt: '2025-06-12T18:45:00Z',
  },
  {
    id: 4,
    name: 'Алексей Козлов',
    age: 30,
    category: 'Категория C',
    description: 'Музыкант и путешественник',
    photo: '',
    createdAt: '2025-06-09T14:20:00Z',
  },
];

const ITEMS_PER_PAGE = 10;

export default function RequestPage() {
  const quizzes = useQuizzesStore((state) => state.quizzes);

  const [category, setCategory] = useState<string>('Все');
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(requestsData.map((r) => r.category)));
    return ['Все', ...cats];
  }, []);

  // Фильтрация + поиск + сортировка
  const filteredRequests = useMemo(() => {
    let filtered = requestsData;

    // Фильтр по категории
    if (category !== 'Все') {
      filtered = filtered.filter((r) => r.category === category);
    }

    // Поиск по всем полям (name, description, category)
    if (search.trim() !== '') {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(lowerSearch) ||
          r.description.toLowerCase().includes(lowerSearch) ||
          r.category.toLowerCase().includes(lowerSearch),
      );
    }

    // Сортировка по дате createdAt
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [category, search, sortOrder]);

  const pageCount = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);

  const paginatedRequests = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredRequests.slice(start, start + ITEMS_PER_PAGE);
  }, [page, filteredRequests]);

  const handleCategoryChange = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
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
      <Typography variant="h3" mb={1} align="left">
        Анкеты
      </Typography>

      {/* Фильтры: категории, поиск, сортировка */}
      <Box
        mb={4}
        display="flex"
        flexWrap="wrap"
        gap={2}
        justifyContent="space-between"
        alignItems="center">
        {/* Чипы категорий */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              color={category === cat ? 'primary' : 'default'}
              variant={category === cat ? 'filled' : 'outlined'}
              onClick={() => handleCategoryChange(cat)}
              clickable
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {/* Поиск */}
          <TextField
            label="Поиск"
            variant="outlined"
            size="small"
            value={search}
            onChange={handleSearchChange}
            sx={{ minWidth: 200 }}
          />

          {/* Сортировка */}
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
        {quizzes.length === 0 ? (
          <Typography variant="h6" color="text.secondary" textAlign="center" width="100%">
            Анкет не найдено.
          </Typography>
        ) : (
          quizzes.map((quiz) => (
            <Grid item xs={12} sm={6} key={quiz.id}>
              <Card>
                <CardMedia component="img" height="200" image='' alt='' />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    1
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    2
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                    Дата создания: {new Date(quiz.creationDate).toLocaleDateString('ru-RU')}
                  </Typography>
                  <Box display="flex" gap={1}>
                    <Button variant="contained" size="small" fullWidth>
                      Просмотр
                    </Button>
                    <Button variant="outlined" size="small" fullWidth>
                      Контакт
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
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
            disabled={pageCount === 0}
          />
        </Box>
      )}
    </Box>
  );
}
