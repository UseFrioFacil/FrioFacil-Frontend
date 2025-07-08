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

export default function AppRoutes() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path='/home' element={<HomePage/>}/>
        <Route path='/solicitarservico' element={<RequestServicePage/>}/>
        <Route path='/cadastrarempresa' element={<RegisterPage/>}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path='/cadastro' element={<Cadastro/>}/>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path='/checkout' element={<PaymentPage />} />'
        <Route path='/convite' element={<AcceptInvitePage />} />
        {/* "Salvando pra usar dps o Componente de Proteção de tela "element={<ProtectedRoute><HomePage /></ProtectedRoute>}*/}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
