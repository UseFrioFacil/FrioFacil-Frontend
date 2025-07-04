import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
import LandingPage from '../pages/Lading/MainPage';
import RequestServicePage from "../pages/Client/RequestServicePage"
import RegisterPage from '../pages/Register/RegisterPage'
import LoginPage from '../pages/Login/LoginPage';


export default function AppRoutes() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path='/solicitarservico' element={<RequestServicePage/>}/>
        <Route path='/cadastro' element={<RegisterPage/>}/>
        <Route path="/login" element={<LoginPage />} />
        {/*<Route path="/dashboard" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />*/}
      </Routes>
    </Router>
  );
}