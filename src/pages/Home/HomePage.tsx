import { useState, useEffect } from 'react';
import type {FC} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PlusCircle } from 'lucide-react';

import './HomePageStyle.css';
import HeaderHome from './uiHomePage/HeaderHome.tsx';
import InvitationCard, { type Invitation } from './uiHomePage/InvitationCard.tsx';
import CompanyCard, { type Company } from './uiHomePage/CompanyCard.tsx';
import LoadingSpinner from '../../components/Loading/LoadingSpinner.tsx';


interface UserData {
    userId: string;
    fullName: string;
    email: string;
}

// --- COMPONENTES EMBUTIDOS ---

const CreateCompanyCard: FC = () => {
    const navigate = useNavigate();
    return (
        <button className="card create-company-card" onClick={() => navigate('/cadastrarempresa')}>
            <div className="create-company-icon">
                <PlusCircle size={32} />
            </div>
            <h3 className="create-company-text">Criar Nova Empresa</h3>
        </button>
    );
};

// --- COMPONENTE PRINCIPAL DA PÁGINA ---

export default function HomePage() {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [invitations, setInvitations] = useState<Invitation[]>([]);

    useEffect(() => {
        const fetchHomeData = async () => {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                toast.error("Acesso negado. Por favor, faça o login.");
                navigate('/login');
                return;
            }

            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const response = await axios.get('http://localhost:5103/api/friofacil/home', config);
                const data = response.data;

                setUserData({
                    userId: data.userId,
                    fullName: data.fullName,
                    email: data.email,
                });
                setCompanies(data.arrayCompanies || []);
                setInvitations(data.arrayInvites || []);

            } catch (err) {
                setError("Não foi possível carregar os dados da página. Tente novamente mais tarde.");
                toast.error("Erro ao buscar dados. Você será redirecionado.");
                
                if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
                    localStorage.removeItem("accessToken");
                    navigate('/login');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchHomeData();
    }, [navigate]); 

    const handleDeclineInvitation = (id: string) => {
        setInvitations(prev => prev.filter(inv => inv.id !== id));
        toast.info("Convite recusado.");
    };
    
    const handleAcceptInvitation = (id: string) => {
        const accepted = invitations.find(inv => inv.id === id);
        if(accepted) {
            const newCompany: Company = {
                id: String(Date.now()),
                name: accepted.companyName,
                logoUrl: `https://placehold.co/150x150/6D28D9/FFFFFF?text=${accepted.companyName.charAt(0)}`
            };
            setCompanies(prev => [...prev, newCompany]);
            handleDeclineInvitation(id); 
            toast.success(`Você agora faz parte da empresa ${accepted.companyName}!`);
        }
    };

    if (isLoading) {
        return <LoadingSpinner isLoading={true} />;
    }

    if (error) {
        return (
            <div className="home-container error-container">
                <h2>Oops! Algo deu errado.</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/login')}>Voltar para o Login</button>
            </div>
        );
    }

    return (
        <div className="home-container">
            {userData && <HeaderHome user={{ name: userData.fullName, email: userData.email, avatarUrl: '' }} />}
            <main className='containerhome'>
                <section className="welcome-section">
                    <h1 className="welcome-title">
                        Bem-vindo(a) de volta, {userData?.fullName.split(' ')[0]}!
                    </h1>
                    <p className="welcome-subtitle">Escolha uma empresa para gerenciar ou crie uma nova para começar.</p>
                </section>

                <section>
                    <h2 className="section-title">Minhas Empresas</h2>
                    <div className="companies-grid">
                        {companies.map(company => (
                            <CompanyCard key={company.id} company={company} />
                        ))}
                        <CreateCompanyCard />
                    </div>
                </section>
                
                {invitations.length > 0 && (
                    <section>
                        <h2 className="section-title">Convites Pendentes</h2>
                        <div className="invitations-section">
                            {invitations.map(invitation => (
                                <InvitationCard 
                                    key={invitation.id} 
                                    invitation={invitation}
                                    onAccept={handleAcceptInvitation}
                                    onDecline={handleDeclineInvitation}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}