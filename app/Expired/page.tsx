import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import OverlayMessage from '@/components/OverlayMessage';

export default function ExpiredPage() {
  return (
    <OverlayMessage
      title="Ссылка недействительна"
      message="Срок действия вашей ссылки истёк. Пожалуйста, запросите новую."
      blurBackground
      blurPercent={50}
      icon={<ErrorOutlineIcon color="error" sx={{ fontSize: 60 }} />}
    />
  );
}
