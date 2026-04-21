"use client";
import { useQuizzes } from "@/hooks/useQuizzes";
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
  styled,
  Skeleton,
} from "@mui/material";
import { parseAsInteger, useQueryState } from "nuqs";
import { useMemo, useState, useEffect } from "react";
import { RequestCard } from "./RequestCard";
import { useDepartments } from "@/hooks/useDepartments";
import { useQuizStatues } from "@/hooks/useQuizStatues";
import { IQuizStatus } from "@/lib/axios/types/quiz";

const ITEMS_PER_PAGE = 12;
const SPACING = 2;

const formatNumber = (value: number) =>
  new Intl.NumberFormat("ru-RU").format(value);

const CountBox = styled(Box)(({ theme }) => ({
  padding: "0 6px",
  border: `1px solid ${theme.palette.info}`,
  borderRadius: theme.shape.borderRadius,
  fontSize: "0.75rem",
  fontWeight: 600,
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.action.hover,
  lineHeight: 1.5,
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  "& .MuiChip-label": {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },
}));

export const RequestContainer = () => {
  const [statusUrl, setStatusUrl] = useQueryState("status", {
    defaultValue: "",
  });
  const [pageUrl, setPageUrl] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
  );
  const [sortUrl, setSortUrl] = useQueryState("sort", { defaultValue: "" });
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });

  const [category, setCategory] = useState<IQuizStatus>({
    id: "",
    name: "Все",
    quizCount: 0,
  });
  const { data, isLoading, isError } = useQuizzes({
    pageNumber: pageUrl,
    pageSize: ITEMS_PER_PAGE,
    sortDirection: sortUrl === "newest" ? "desc" : "asc",
    statusId: category.id,
    search,
  });

  const { data: departments } = useDepartments();
  const { data: statues } = useQuizStatues();

  const quizzes = data?.data || [];
  // const allQuizStatues = statues || [];
  const allQuizStatues = useMemo(() => statues || [], [statues]);
  const pageCount = Math.ceil((data?.totalCount || 0) / ITEMS_PER_PAGE);

  const categories = useMemo(() => {
    const totalQuizCount = allQuizStatues
      .filter((s) => s.quizCount > 0)
      .reduce((sum, s) => sum + s.quizCount, 0);
    return [
      { id: "", name: "Все", quizCount: totalQuizCount },
      ...allQuizStatues,
    ];
  }, [allQuizStatues]);

  useEffect(() => {
    if (!statues) {
      return;
    }
    const found = statues.find((s) => s.id === statusUrl);
    if (found) {
      setCategory(found);
    }
  }, [statues, statusUrl]);

  const handleCategoryChange = (selectedCategory: IQuizStatus) => {
    setCategory(selectedCategory);
    setPageUrl(1);
    setStatusUrl(selectedCategory.id);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setPageUrl(1);
  };

  const handlePageChange = (_: unknown, value: number) => {
    setPageUrl(value);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    const value = event.target.value as "newest" | "oldest";
    setSortUrl(value);
  };

  return (
    <Box>
      <Box
        mb={4}
        display="flex"
        flexWrap="wrap"
        gap={2}
        justifyContent="space-between"
      >
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <StyledChip
              key={cat.id}
              label={
                <>
                  {cat.name}
                  {cat.quizCount > 0 && (
                    <CountBox>{formatNumber(cat.quizCount)}</CountBox>
                  )}
                </>
              }
              color={category.id === cat.id ? "primary" : "default"}
              variant={category.id === cat.id ? "filled" : "outlined"}
              onClick={() => handleCategoryChange(cat)}
              clickable
            />
          ))}
        </Box>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
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
              value={sortUrl}
              onChange={handleSortChange}
              label="Сортировка по дате"
            >
              <MenuItem value="newest">Сначала новые</MenuItem>
              <MenuItem value="oldest">Сначала старые</MenuItem>
            </Select>
          </FormControl>
        </Box>
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
            <Typography color="error">Ошибка загрузки анкет</Typography>
          </Grid>
        ) : quizzes.length === 0 ? (
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="h6"
              color="text.secondary"
              textAlign="center"
              width="100%"
            >
              Анкет не найдено
            </Typography>
          </Grid>
        ) : (
          quizzes.map((quiz) => (
            <Grid key={quiz.id} size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
              <Box height="100%">
                <RequestCard
                  quiz={quiz}
                  departments={departments ?? []}
                  statues={statues ?? []}
                />
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
            page={pageUrl}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
};
