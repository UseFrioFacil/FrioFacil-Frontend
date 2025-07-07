import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
import LandingPage from '../pages/Lading/MainPage';
import RequestServicePage from "../pages/Client/RequestServicePage"
import RegisterPage from '../pages/RegisterCompany/RegisterCompany.tsx'
import LoginPage from '../pages/Login/LoginPage';
import DashboardPage from '../pages/Dashboard/DashboardPage'
import NotFoundPage from '../pages/NotFound/NotFoundPage';
import PaymentPage  from '../pages/Checkout/Payment';
import AcceptInvitePage from '../pages/Invite/Invitelink'

export default function AppRoutes() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path='/solicitarservico' element={<RequestServicePage/>}/>
        <Route path='/cadastreempresa' element={<RegisterPage/>}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path='/checkout' element={<PaymentPage />} />'
        <Route path='/convite' element={<AcceptInvitePage />} />
        {/* "Salvando pra usar dps o Componente de Proteção de tela "element={<ProtectedRoute><HomePage /></ProtectedRoute>}*/}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}