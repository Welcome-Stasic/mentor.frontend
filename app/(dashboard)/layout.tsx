import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexGrow: 1 }}>
          <Sidebar />
          <main style={{ flexGrow: 1, padding: '24px', marginTop: '64px' }}>{children}</main>
        </div>
        <Footer />
      </div>
    </>
  );
}
