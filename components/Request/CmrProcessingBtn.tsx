import { useQuizCrmProcessing } from '@/hooks/useQuizCrmProcessing';
import { IQuiz } from '@/lib/axios/types/quiz';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import { IconButton, Tooltip } from '@mui/material';

interface ICmrProcessingBtnProps {
  quiz: IQuiz;
  disable?: boolean;
}

export const CmrProcessingBtn = ({
  quiz,
  disable = false,
}: ICmrProcessingBtnProps) => {
  const crmProcessing = useQuizCrmProcessing();

  const handleCmrProcessing = async () => {
    await crmProcessing.mutateAsync(quiz.id);
  };

  return (
    <Tooltip title="Отправить по маршруту">
      <IconButton
        onClick={handleCmrProcessing}
        loading={crmProcessing.isPending}
        disabled={!quiz.selectedDepartmentId || quiz.crmWorkflowinstance > 0 || disable}>
        <ForkRightIcon />
      </IconButton>
    </Tooltip>
  );
};
