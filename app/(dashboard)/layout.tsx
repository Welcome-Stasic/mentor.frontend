import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { CurrentUserStoreProvider } from '@/providers/current-user-provider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <CurrentUserStoreProvider>
      <Header />
      <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexGrow: 1 }}>
          <Sidebar />
          <main style={{ flexGrow: 1, padding: '24px', marginTop: '64px' }}>{children}</main>
        </div>
        <Footer />
      </div>
    </CurrentUserStoreProvider>
  );
}
