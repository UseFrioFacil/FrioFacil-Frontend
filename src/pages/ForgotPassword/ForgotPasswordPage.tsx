import type { FC } from 'react';
import './ForgotPasswordStyle.css';
import ForgotPasswordScreen from './uiForgotPassword/ForgotPasswordScreen';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

// --- COMPONENTE PRINCIPAL PARA RENDERIZAÇÃO ---
const ForgotPasswordPage: FC = () => {
    return(
        <div>
            <Header showOptions={false} showMenu={false} showBackButton={true}/>
            <ForgotPasswordScreen />
            <Footer/>
        </div>
    ) 
};

export default ForgotPasswordPage;
