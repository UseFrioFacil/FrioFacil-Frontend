import type { FC } from 'react';
import './RegisterCompanyStyle.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import RegistrationScreen from './uiRegisterCompany/RegistrationCompanyScreen'

// --- COMPONENTE PRINCIPAL PARA RENDERIZAÇÃO ---
const RegisterPage: FC = () => {
    return(
      <div>
        <Header showOptions = {false} showMenu = {false} showBackButton = {true}/>
        <RegistrationScreen />
        <Footer/>
      </div>
    ) 
}

export default RegisterPage;