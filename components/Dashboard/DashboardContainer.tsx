import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import OverlayMessage from '@/components/OverlayMessage';
import Sidebar from '@/components/Sidebar';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import { getServerSession } from 'next-auth';
import { DashboardPageTitle } from './DashboardPageTitle';
import { USER_ROLES } from '@/constants';

export default async function DashboardContainer({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const currentUserRoles = session?.user.roles || [];

  return (
    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
      {currentUserRoles.includes(USER_ROLES.PENDING_APPROVAL.name) && (
        <OverlayMessage
          title="Спасибо за прохождение опроса!"
          message="Мы внимательно ознакомимся с вашими ответами, и свяжемся с вами в ближайшее время 😉"
          blurBackground
          blurPercent={80}
          isShowLogout
          icon={<ManageSearchOutlinedIcon color="info" sx={{ fontSize: 60 }} />}
        />
      )}
      <Header />
      <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexGrow: 1 }}>
          <Sidebar />
          <main style={{ position: 'relative', flexGrow: 1, padding: '14px', marginTop: '64px' }}>
            <DashboardPageTitle />
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
}
