import type { FC } from 'react';
import './LoginStyle.css';
import LoginScreen from './uiLogin/LoginScreen';

// --- COMPONENTE PRINCIPAL PARA RENDERIZAÇÃO ---
const LoginPage: FC = () => {
    return(
        <div>
            <LoginScreen />
        </div>
    ) 
};

export default LoginPage;