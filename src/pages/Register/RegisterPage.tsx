import type { FC } from 'react';
import './RegisterStyle.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import RegistrationScreen from './uiRegister/RegistrationScreen'

// --- COMPONENTE PRINCIPAL PARA RENDERIZAÇÃO ---
const RegisterPage: FC = () => {
    return(
      <div>
        <Header showOptions={false} showMenu={false}/>
        <RegistrationScreen />
        <Footer/>
      </div>
    ) 
}

export default RegisterPage;