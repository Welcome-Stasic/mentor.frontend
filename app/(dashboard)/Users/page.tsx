'use client';

import { UserCard } from '@/components/Users/UserCard';
import { useUsers } from '@/hooks/user/useUsers';
import { Box, Grid, Pagination, Skeleton, TextField, Typography } from '@mui/material';
import { useState } from 'react';

const ITEMS_PER_PAGE = 20;
const SPACING = 2;

export default function UsersPage() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');

  const { data, isLoading, isError } = useUsers({
    pageNumber: page,
    pageSize: ITEMS_PER_PAGE,
    search
  });

  const users = data?.data || [];

  const pageCount = Math.ceil((data?.totalCount || 0) / ITEMS_PER_PAGE);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };
  
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <TextField
          label="Поиск"
          variant="outlined"
          size="small"
          value={search}
          onChange={handleSearchChange}
          sx={{ minWidth: 300 }}
        />
      </Box>

      {/* Карточки */}
      <Grid container spacing={SPACING}>
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, xl: 3 }} key={i}>
              <Skeleton
                variant="rounded"
                sx={{ borderRadius: 2, boxShadow: 2 }}
                width="100%"
                height={200}
              />
            </Grid>
          ))
        ) : isError ? (
          <Grid size={{ xs: 12 }}>
            <Typography color="error">Ошибка загрузки пользователей</Typography>
          </Grid>
        ) : users.length === 0 ? (
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" color="text.secondary" textAlign="center" width="100%">
              Пользователей не найдено
            </Typography>
          </Grid>
        ) : (
          users.map((user) => (
            <Grid key={user.id} size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
              <Box height="100%">
                <UserCard user={user} />
              </Box>
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
          />
        </Box>
      )}
    </>
  );
}
