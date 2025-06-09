'use client';

import { useState, ChangeEvent, DragEvent } from 'react';
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Paper,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@mui/material';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 МБ
const ALLOWED_FORMATS = ['image/jpeg', 'image/png'];

export default function QuizPage() {
  const [tab, setTab] = useState(0);
  const [contact, setContact] = useState({
    name: '',
    email: '',
    photo: null as File | null,
    consent: false,
  });
  const [photoError, setPhotoError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [answers, setAnswers] = useState({ q1: '', q2: '' });

  // Общая проверка файла
  const validateFile = (file: File) => {
    if (!ALLOWED_FORMATS.includes(file.type)) {
      setPhotoError('Допустимы только JPG и PNG форматы');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setPhotoError('Максимальный размер файла 2 МБ');
      return false;
    }
    setPhotoError('');
    return true;
  };

  const handleContactChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target;

    if (name === 'photo' && files) {
      const file = files[0];
      if (!file) return;

      if (!validateFile(file)) {
        setContact((prev) => ({ ...prev, photo: null }));
        return;
      }

      setContact((prev) => ({ ...prev, photo: file }));
      return;
    }

    if (type === 'checkbox') {
      setContact((prev) => ({ ...prev, [name]: checked }));
    } else {
      setContact((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Drag & Drop обработчики
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    const file = files[0];

    if (!validateFile(file)) {
      setContact((prev) => ({ ...prev, photo: null }));
      return;
    }

    setContact((prev) => ({ ...prev, photo: file }));
  };

  const handleAnswerChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (!contact.name || !contact.email) {
      alert('Пожалуйста, заполните имя и email.');
      return;
    }
    if (!contact.consent) {
      alert('Необходимо согласие на обработку данных.');
      return;
    }
    if (!contact.photo) {
      alert('Пожалуйста, прикрепите фото.');
      return;
    }

    setTab(1);
  };

  const handleSubmit = () => {
    console.log({ contact, answers });
    alert('Ответы отправлены!');
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        maxWidth: 600,
        mx: 'auto',
        overflow: 'visible', // <-- важно
      }}>
      <Tabs value={tab} sx={{ mb: 2 }}>
        <Tab label="Контактные данные" />
        <Tab
          label="Вопросы"
          disabled={!contact.name || !contact.email || !contact.consent || !contact.photo}
        />
      </Tabs>

      {tab === 0 && (
        <Box component="form" display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Имя"
            name="name"
            value={contact.name}
            onChange={handleContactChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={contact.email}
            onChange={handleContactChange}
            type="email"
            fullWidth
          />

          {/* Drag & Drop зона */}
          <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              border: '2px dashed',
              borderColor: dragActive ? 'primary.main' : 'grey.400',
              borderRadius: 1,
              height: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: dragActive ? 'action.hover' : 'transparent',
              transition: 'background-color 0.3s',
              color: 'text.secondary',
              userSelect: 'none',
              position: 'relative',
            }}>
            {contact.photo ? (
              <Typography>Файл загружен: {contact.photo.name}</Typography>
            ) : (
              <Typography>
                Перетащите фото сюда или нажмите ниже, чтобы выбрать файл (JPG, PNG, до 2 МБ)
              </Typography>
            )}
          </Box>

          {/* Кнопка выбора файла */}
          <Button variant="outlined" component="label" sx={{ mt: 1 }}>
            Выбрать файл
            <input
              hidden
              accept="image/jpeg,image/png"
              type="file"
              name="photo"
              onChange={handleContactChange}
            />
          </Button>

          {photoError && (
            <Typography variant="body2" color="error">
              {photoError}
            </Typography>
          )}

          <FormControlLabel
            control={
              <Checkbox checked={contact.consent} onChange={handleContactChange} name="consent" />
            }
            label="Я согласен(на) на обработку персональных данных"
          />

          <Button variant="contained" onClick={handleNext}>
            Далее
          </Button>
        </Box>
      )}

      {tab === 1 && (
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Вопрос 1: Как вы узнали о нас?"
            name="q1"
            value={answers.q1}
            onChange={handleAnswerChange}
            fullWidth
          />
          <TextField
            label="Вопрос 2: Что вы ожидаете от продукта?"
            name="q2"
            value={answers.q2}
            onChange={handleAnswerChange}
            fullWidth
          />
          <Button variant="contained" onClick={handleSubmit}>
            Отправить
          </Button>
        </Box>
      )}
    </Paper>
  );
}
