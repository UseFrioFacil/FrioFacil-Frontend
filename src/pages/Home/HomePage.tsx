import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PlusCircle, CreditCard, Trash2, AlertTriangle } from 'lucide-react';
import './HomePageStyle.css';
import HeaderHome from './uiHomePage/HeaderHome.tsx';
import InvitationCard from './uiHomePage/InvitationCard.tsx';
import CompanyCard from './uiHomePage/CompanyCard.tsx';
import LoadingSpinner from '../../components/Loading/LoadingSpinner.tsx';

// --- INTERFACES ---

interface UserData {
    userId: string;
    fullName: string;
    email: string;
}

export interface Company {
    id: string;
    name: string;
    logoUrl: string;
    role: string;
}

// CORREÇÃO: Adicionando a interface 'Invitation' que estava faltando.
export interface Invitation {
    id: string;
    companyName: string;
}

export interface TempCompany {
    companyId: string; 
    tradeName: string;
    status: string;
    paymentToken: string;
}

// Interfaces da API
interface ApiCompany {
    usercompanyid: string;
    userid: string;
    tradename: string;
    companyid:string;
    role: string;
    entrydate: string;
}

interface ApiInvitation {
    inviteid: string;
    tradename: string;
}

interface ApiHomeResponse {
    userId: string;
    fullName: string;
    email: string;
    arrayInvites: ApiInvitation[];
    arrayCompanies: ApiCompany[];
    arrayTempCompanies?: TempCompany[];
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

const TempCompanyCard: FC<{
    company: TempCompany;
    onPay: (token: string) => void;
    onDelete: (id: string) => void;
}> = ({ company, onPay, onDelete }) => {
    return (
        <div className="card temp-company-card">
            <div className="temp-company-header">
                <AlertTriangle size={24} className="temp-company-icon" />
                <h3 className="company-name">{company.tradeName}</h3>
            </div>
            <p className="temp-company-status">Status: <strong>{company.status}</strong></p>
            <p className="temp-company-text">Finalize o cadastro para ativar sua empresa e ter acesso a todos os recursos.</p>
            <div className="temp-company-actions">
                <button className="button button-delete" onClick={() => onDelete(company.companyId)}>
                    <Trash2 size={16} /> Deletar
                </button>
                <button className="button button-primary" onClick={() => onPay(company.paymentToken)}>
                    <CreditCard size={16} /> Ir para Pagamento
                </button>
            </div>
        </div>
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
    const [tempCompanies, setTempCompanies] = useState<TempCompany[]>([]);

    useEffect(() => {
        const fetchHomeData = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                navigate('/login');
                return;
            }
            setIsLoading(true);
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get<ApiHomeResponse>('http://localhost:5103/api/friofacil/home', config);
                const data = response.data;

                setUserData({ userId: data.userId, fullName: data.fullName, email: data.email });

                if (data.arrayCompanies) {
                    const formattedCompanies: Company[] = data.arrayCompanies.map(c => ({
                        id: c.companyid,
                        name: c.tradename,
                        logoUrl: `https://placehold.co/150x150/6D28D9/FFFFFF?text=${c.tradename.charAt(0)}`,
                        role: c.role
                    }));
                    setCompanies(formattedCompanies);
                }

                if (data.arrayInvites) {
                    const formattedInvitations: Invitation[] = data.arrayInvites.map(i => ({
                        id: i.inviteid,
                        companyName: i.tradename,
                    }));
                    setInvitations(formattedInvitations);
                }

                if (data.arrayTempCompanies && Array.isArray(data.arrayTempCompanies)) {
                    setTempCompanies(data.arrayTempCompanies);
                }

            } catch (err) {
                setError("Não foi possível carregar os dados.");
                toast.error("Erro ao buscar dados.");
                if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
                    navigate('/login');
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchHomeData();
    }, [navigate]);

    const handleRespondToInvitation = async (inviteId: string, status: 'aceito' | 'recusado') => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            toast.error("Sessão expirada. Por favor, faça login novamente.");
            navigate('/login');
            return;
        }

        try {
            const payload = { inviteid: inviteId, status: status };
            await axios.patch('http://localhost:5103/api/friofacil/respondinvite', payload, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            const successMessage = status === 'aceito' ? 'Convite aceito com sucesso!' : 'Convite recusado.';
            toast.success(successMessage);
            setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
            console.error("Erro ao responder ao convite:", err);
            toast.error("Não foi possível processar sua resposta. Tente novamente.");
        }
    };

    const handleAcceptInvitation = (id: string) => handleRespondToInvitation(id, 'aceito');
    const handleDeclineInvitation = (id: string) => handleRespondToInvitation(id, 'recusado');

    const handleGoToPayment = (token: string) => {
        navigate('/checkout', { 
            state: { tokenTempCompany: token } 
        });
    };

    const handleDeleteTempCompany = async (id: string) => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            toast.error("Sessão expirada. Por favor, faça login novamente.");
            navigate('/login');
            return;
        }

        try {
            await axios.delete(`http://localhost:5103/api/friofacil/tempcompanydelete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            toast.success("Empresa temporária deletada com sucesso!");
            
            setTempCompanies(prev => prev.filter(c => c.companyId !== id));

        } catch (error) {
            console.error("Erro ao deletar empresa temporária:", error);
            toast.error("Não foi possível deletar a empresa. Tente novamente.");
        }
    };

    if (isLoading) return <LoadingSpinner isLoading={true} />;

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
            {userData && <HeaderHome user={{ 
                name: userData.fullName, 
                email: userData.email, 
                avatarUrl: `https://placehold.co/40x40/FFFFFF/6D28D9?text=${userData.fullName.charAt(0)}` 
            }} />}
            
            <main className='containerhome'>
                <section className="welcome-section">
                    <h1 className="welcome-title">Bem-vindo(a) de volta, {userData?.fullName.split(' ')[0]}!</h1>
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

                {tempCompanies.length > 0 && (
                    <section>
                        <h2 className="section-title">Finalize seu Cadastro</h2>
                        <div className="companies-grid">
                            {tempCompanies.map(company => (
                                <TempCompanyCard
                                    key={company.companyId}
                                    company={company}
                                    onPay={handleGoToPayment}
                                    onDelete={handleDeleteTempCompany}
                                />
                            ))}
                        </div>
                    </section>
                )}
                
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
