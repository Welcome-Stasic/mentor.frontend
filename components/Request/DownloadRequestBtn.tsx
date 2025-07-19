import { useDownloadQuiz } from '@/hooks/useDownloadQuiz';
import { Download } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

interface IDownloadRequestBtnProps {
  quizId: string;
}

export const DownloadRequestBtn = ({ quizId }: IDownloadRequestBtnProps) => {
  const downloadQuiz = useDownloadQuiz();

  const handleDownload = async () => {
    await downloadQuiz.mutateAsync(quizId);
  };

  return (
    <Tooltip title="Скачать анкету">
      <IconButton color="primary" onClick={handleDownload} loading={downloadQuiz.isPending}>
        <Download />
      </IconButton>
    </Tooltip>
  );
};
