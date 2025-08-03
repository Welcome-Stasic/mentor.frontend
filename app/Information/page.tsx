import BackGroundImageWrapper from '@/components/BackGroundImageWrapper';
import OverlayMessage from '@/components/OverlayMessage';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';

export default function InformationPage() {
  return (
    <BackGroundImageWrapper>
      <OverlayMessage
        title="Спасибо за прохождение опроса!"
        message="Мы внимательно ознакомимся с вашими ответами, и свяжемся с вами в ближайшее время 😉"
        blurBackground
        blurPercent={50}
        isShowLogout
        icon={<ManageSearchOutlinedIcon color="info" sx={{ fontSize: 60 }} />}
      />
    </BackGroundImageWrapper>
  );
}
