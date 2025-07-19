import { useQuizCrmProcessing } from '@/hooks/useQuizCrmProcessing';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import { IconButton, Tooltip } from '@mui/material';

interface ICmrProcessingBtnProps {
  quizId: string;
  crmWorkflowinstance: number;
}

export const CmrProcessingBtn = ({ quizId, crmWorkflowinstance }: ICmrProcessingBtnProps) => {
  const crmProcessing = useQuizCrmProcessing();

  const handleCmrProcessing = async () => {
    await crmProcessing.mutateAsync(quizId);
  };

  return (
    <Tooltip title="Отправить по маршруту">
      <IconButton
        onClick={handleCmrProcessing}
        loading={crmProcessing.isPending}
        disabled={crmWorkflowinstance > 0}>
        <ForkRightIcon />
      </IconButton>
    </Tooltip>
  );
};
