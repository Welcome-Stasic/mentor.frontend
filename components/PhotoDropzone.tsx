/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Box, Typography, Button, IconButton } from '@mui/material';
import { ChangeEvent, DragEvent, useEffect, useState } from 'react';
import { ControllerRenderProps, FieldError } from 'react-hook-form';
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {
  field: ControllerRenderProps<any, any>;
  error?: FieldError;
  onFileError: (message: string) => void;
};

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_FORMATS = ['image/jpeg', 'image/png'];

export function PhotoDropzone({ field, error, onFileError }: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (!ALLOWED_FORMATS.includes(file.type)) {
      onFileError('Разрешены только JPG и PNG');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      onFileError('Файл превышает 2 МБ');
      return;
    }

    field.onChange(file);
    onFileError('');
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    field.onChange(null);
    setPreviewUrl(null);
    onFileError('Загрузите фотографию');
  };

  useEffect(() => {
    if (field.value instanceof File) {
      const objectUrl = URL.createObjectURL(field.value);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [field.value]);

  return (
    <>
      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          border: '2px dashed',
          borderColor: dragActive ? 'primary.main' : error ? 'error.main' : 'grey.400',
          borderRadius: 1,
          height: 180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: dragActive ? 'action.hover' : 'transparent',
          transition: 'background-color 0.3s',
          color: 'text.secondary',
          userSelect: 'none',
          overflow: 'hidden',
          position: 'relative',
          flexDirection: 'column',
        }}>
        {previewUrl ? (
          <>
            <Box
              component="img"
              src={previewUrl}
              alt="preview"
              sx={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
            />
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'white', zIndex: 1 }}
              size="small"
              aria-label="Удалить фото">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </>
        ) : (
          <Typography>Перетащите фото или выберите файл ниже (JPG, PNG, до 2 МБ)</Typography>
        )}
      </Box>

      <Button variant="outlined" component="label" sx={{ mt: 1 }}>
        Выбрать файл
        <input hidden type="file" accept="image/jpeg,image/png" onChange={handleFileInput} />
      </Button>

      {error?.message && (
        <Typography color="error" variant="body2" mt={1}>
          {error.message}
        </Typography>
      )}
    </>
  );
}
