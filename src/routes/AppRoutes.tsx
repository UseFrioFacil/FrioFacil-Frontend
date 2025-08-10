import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ScrollToTop from '../components/ScrollToTop.tsx';
import PageTransition from '../components/PageTransition.tsx';
import LandingPage from '../pages/Lading/MainPage.tsx';
import RequestServicePage from "../pages/Client/RequestServicePage.tsx"
import RegisterPage from '../pages/RegisterCompany/RegisterCompany.tsx'
import LoginPage from '../pages/Login/LoginPage.tsx';
import ForgotPasswordPage from '../pages/ForgotPassword/ForgotPasswordPage.tsx';
import DashboardPage from '../pages/Dashboard/DashboardPage.tsx'
import NotFoundPage from '../pages/NotFound/NotFoundPage.tsx';
import PaymentPage  from '../pages/Checkout/Payment.tsx';
import AcceptInvitePage from '../pages/Invite/InviteLink.tsx'
import HomePage from '../pages/Home/HomePage.tsx';
import Cadastro from '../pages/Register/Register.tsx'
import ProtectedRoute from "../components/ProtectedRoute.tsx"
import MinhaContaPage from '../pages/MyAccount/MyAccount.tsx';
import SecurityPage from '../pages/MyAccount/Security/SecurityPage.tsx';
import PersonalDataPage from '../pages/MyAccount/PersonalData/PersonalDataPage.tsx';
import SubscriptionsPage from '../pages/MyAccount/Subscriptions/SubscriptionsPage.tsx';

// Componente interno para usar useLocation
function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <LandingPage />
          </PageTransition>
        } />
        <Route path='/solicitarservico' element={
          <PageTransition>
            <RequestServicePage/>
          </PageTransition>
        }/>
        <Route path="/login" element={
          <PageTransition>
            <LoginPage />
          </PageTransition>
        } />
        <Route path="/forgot-password" element={
          <PageTransition>
            <ForgotPasswordPage />
          </PageTransition>
        } />
        <Route path='/cadastro' element={
          <PageTransition>
            <Cadastro/>
          </PageTransition>
        }/>
        <Route path='/convite' element={
          <PageTransition>
            <AcceptInvitePage />
          </PageTransition>
        } />
        <Route path='/home' element={
          <PageTransition>
            <ProtectedRoute><HomePage/></ProtectedRoute>
          </PageTransition>
        }/>
        <Route path='/minhaconta' element={
          <PageTransition>
            <ProtectedRoute><MinhaContaPage/></ProtectedRoute>
          </PageTransition>
        }/>
        <Route path='/seguranca' element={
          <PageTransition>
            <ProtectedRoute><SecurityPage/></ProtectedRoute>
          </PageTransition>
        }/>
        <Route path='/minhaconta/dados-pessoais' element={
          <PageTransition>
            <ProtectedRoute><PersonalDataPage/></ProtectedRoute>
          </PageTransition>
        }/>
        <Route path='/minhaconta/assinaturas' element={
          <PageTransition>
            <ProtectedRoute><SubscriptionsPage/></ProtectedRoute>
          </PageTransition>
        }/>
        <Route path='/cadastrarempresa' element={
          <PageTransition>
            <ProtectedRoute><RegisterPage/></ProtectedRoute>
          </PageTransition>
        }/>
        <Route path="/dashboard" element={
          <PageTransition>
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          </PageTransition>
        } />
        <Route path='/checkout' element={
          <PageTransition>
            <ProtectedRoute><PaymentPage /></ProtectedRoute>
          </PageTransition>
        } />
        <Route path="*" element={
          <PageTransition>
            <NotFoundPage />
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
}

export default function AppRoutes() {
  return (
    <Router>
      <ScrollToTop />
      <AnimatedRoutes />
    </Router>
  );
}
