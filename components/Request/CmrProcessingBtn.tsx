import { useQuizCrmProcessing } from '@/hooks/useQuizCrmProcessing';
import { useGetWorkflowInstanceStatus } from '@/hooks/workflowInstance/useGetWorkflowInstanceStatus';
import { IQuiz } from '@/lib/axios/types/quiz';
import { WorkflowInstanceStatus } from '@/lib/axios/types/workflowInstance';
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
  const { data: wiStatus } = useGetWorkflowInstanceStatus(quiz.crmWorkflowinstance);
  const isDisableWi = quiz.crmWorkflowinstance > 0 && wiStatus && wiStatus === WorkflowInstanceStatus.Running;

  const crmProcessing = useQuizCrmProcessing();

  const handleCmrProcessing = async () => {
    await crmProcessing.mutateAsync(quiz.id);
  };

  return (
    <Tooltip title="Отправить по маршруту">
      <IconButton
        onClick={handleCmrProcessing}
        loading={crmProcessing.isPending}
        disabled={!quiz.selectedDepartmentId || isDisableWi || disable}>
        <ForkRightIcon />
      </IconButton>
    </Tooltip>
  );
};
