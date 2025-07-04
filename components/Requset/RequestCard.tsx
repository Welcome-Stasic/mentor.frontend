'use client';

import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
  Typography,
} from '@mui/material';
import { Delete, Download, Visibility } from '@mui/icons-material';
import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { IQuiz } from '@/lib/axios/types/quiz';
import { IApplicationUser } from '@/lib/axios/types/user';
import { API } from '@/lib/axios';
import { useSession } from 'next-auth/react';
import { useDepartments } from '@/hooks/useDepartments';

interface IRequestCardProps {
  quiz: IQuiz;
}

export const RequestCard = ({ quiz }: IRequestCardProps) => {
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  const [loading, setLoading] = useState(true);
  const [photoOpen, setPhotoOpen] = useState(false);

  const [user, setUser] = useState<IApplicationUser | null>(null);

  const { data: departments } = useDepartments();

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const userResponse = await API.user.getUserById(quiz.applicationUserId, accessToken);

      setUser(userResponse?.Result || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleDepartmentChange = (event: SelectChangeEvent) => {
    if (!user) return;

    const newValue = event.target.value;

    console.log(newValue);
  };

  const handleViewResults = () => {
    alert(`Просмотр результатов анкетирования для ${user?.id}`);
  };

  const handleDownload = () => {
    alert(`Скачивание анкеты ${user?.id}`);
  };

  const handleDelete = () => {
    const confirmed = confirm(`Удалить анкету ${user?.id}?`);
    if (confirmed) {
      alert(`Анкета ${user?.id} удалена`);
    }
  };

  if (loading || !user) {
    return (
      <Card
        sx={{
          maxWidth: 500,
          m: 2,
          borderRadius: 4,
          p: 3,
          display: 'flex',
          justifyContent: 'center',
        }}></Card>
    );
  }

  return (
    <>
      <Card sx={{ maxWidth: 500, borderRadius: 2, boxShadow: 2 }}>
        <CardHeader
          avatar={
            <Tooltip title="Нажмите, чтобы увеличить фото">
              <Avatar
                src=""
                sx={{ width: 56, height: 56, cursor: 'pointer' }}
                onClick={() => setPhotoOpen(true)}
              />
            </Tooltip>
          }
          title={<Typography variant="h6">{user.userName}</Typography>}
          subheader={<Typography variant="body2">{user.email}</Typography>}
        />
        <Divider />
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2">
            <strong>Дата рождения:</strong> {user.birthDay}
          </Typography>
          <Typography variant="body2">
            <strong>Телефон:</strong> {user.phoneNumber}
          </Typography>
          <Typography variant="body2">
            <strong>Учебное заведение:</strong> {quiz.institution}
          </Typography>
          <Typography variant="body2">
            <strong>Класс/Курс:</strong> {quiz.course}
          </Typography>
          <Typography variant="body2">
            <strong>Специальность:</strong> {quiz.specialty}
          </Typography>
          <Typography variant="body2">
            <strong>Статус тестирования:</strong> {quiz.stage}
          </Typography>
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Подразделение:</strong>
            </Typography>
            <Select
              value={quiz.selectedDepartmentId || ''}
              onChange={handleDepartmentChange}
              size="small"
              fullWidth>
              {departments?.map((dep) => (
                <MenuItem key={dep.id} value={dep.id}>
                  {dep.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Tooltip title="Открыть результаты тестирования">
            <Button
              variant="contained"
              onClick={handleViewResults}
              sx={{
                background: 'linear-gradient(45deg, #2196f3, #21cbf3)',
                color: '#fff',
                textTransform: 'none',
                px: 3,
                transition: '0.3s',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1e88e5, #1de9b6)',
                },
              }}
              startIcon={<Visibility />}>
              Результаты
            </Button>
          </Tooltip>
          <Box>
            <Tooltip title="Скачать анкету">
              <IconButton color="primary" onClick={handleDownload}>
                <Download />
              </IconButton>
            </Tooltip>
            <Tooltip title="Удалить анкету">
              <IconButton color="error" onClick={handleDelete}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        </CardActions>
      </Card>

      {/* Модальное окно с изображением */}
      <Dialog
        open={photoOpen}
        onClose={() => setPhotoOpen(false)}
        maxWidth="md"
        slotProps={{
          paper: {
            sx: {
              backgroundColor: 'transparent',
              boxShadow: 'none',
            },
          },
        }}>
        <DialogContent sx={{ p: 0 }}>
          <img
            src=""
            alt="Фото пользователя"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              maxHeight: '80vh',
              objectFit: 'contain',
              borderRadius: '12px',
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
