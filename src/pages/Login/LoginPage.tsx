import type { FC } from 'react';
import './LoginStyle.css';
import LoginScreen from './uiLogin/LoginScreen';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

// --- COMPONENTE DA TELA DE LOGIN ---


// --- COMPONENTE PRINCIPAL PARA RENDERIZAÇÃO ---
const LoginPage: FC = () => {
    return(
        <div>
            <Header showOptions = {false} showMenu = {false} showBackButton = {true}/>
            <LoginScreen />;
            <Footer/>
        </div>
    ) 
};

export default LoginPage;