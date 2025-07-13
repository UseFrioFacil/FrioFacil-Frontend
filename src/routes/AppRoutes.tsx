import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop.tsx';
import LandingPage from '../pages/Lading/MainPage.tsx';
import RequestServicePage from "../pages/Client/RequestServicePage.tsx"
import RegisterPage from '../pages/RegisterCompany/RegisterCompany.tsx'
import LoginPage from '../pages/Login/LoginPage.tsx';
import DashboardPage from '../pages/Dashboard/DashboardPage.tsx'
import NotFoundPage from '../pages/NotFound/NotFoundPage.tsx';
import PaymentPage  from '../pages/Checkout/Payment.tsx';
import AcceptInvitePage from '../pages/Invite/InviteLink.tsx'
import HomePage from '../pages/Home/HomePage.tsx';
import Cadastro from '../pages/Register/Register.tsx'
import ProtectedRoute from "../components/ProtectedRoute.tsx"
import MinhaContaPage from '../pages/MyAccount/MyAccount.tsx';

export default function AppRoutes() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path='/solicitarservico' element={<RequestServicePage/>}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path='/cadastro' element={<Cadastro/>}/>
        <Route path='/convite' element={<AcceptInvitePage />} />
        <Route path='/home' element={<ProtectedRoute><HomePage/></ProtectedRoute>}/>
        <Route path='/minhaconta' element={<ProtectedRoute><MinhaContaPage/></ProtectedRoute>}/>
        <Route path='/cadastrarempresa' element={<ProtectedRoute><RegisterPage/></ProtectedRoute>}/>
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path='/checkout' element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />'

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
