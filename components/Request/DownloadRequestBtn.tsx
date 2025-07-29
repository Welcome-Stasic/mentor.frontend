import { useDownloadQuiz } from '@/hooks/useDownloadQuiz';
import { IQuiz } from '@/lib/axios/types/quiz';
import { Download } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

interface IDownloadRequestBtnProps {
  quiz: IQuiz;
}

export const DownloadRequestBtn = ({ quiz }: IDownloadRequestBtnProps) => {
  const downloadQuiz = useDownloadQuiz();

  const handleDownload = async () => {
    await downloadQuiz.mutateAsync(quiz.id);
  };

  return (
    <Tooltip title="Скачать анкету">
      <IconButton color="primary" onClick={handleDownload} loading={downloadQuiz.isPending}>
        <Download />
      </IconButton>
    </Tooltip>
  );
};
