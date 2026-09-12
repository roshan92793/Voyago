import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

const MainLayout = () => {
  const { pathname } = useLocation();
  const isAuthPage = ['/login', '/register'].includes(pathname);
  const showSiteSun = !isAuthPage && pathname !== '/';

  return (
    <>
      {showSiteSun && <div className="site-sun" aria-hidden="true" />}
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
