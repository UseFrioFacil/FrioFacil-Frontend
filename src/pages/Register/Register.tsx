import './RegisterStyle.css'
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import RegisterScreen from './uiRegister/RegisterScreen';

export default function App() {
    return (
        <>
            <Header showMenu={false} showOptions={false}/>
            <RegisterScreen />
            <Footer/>
        </>
    );
}
