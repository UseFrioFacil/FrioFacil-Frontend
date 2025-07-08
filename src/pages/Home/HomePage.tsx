import type { FC } from 'react';
import { useState } from 'react';
import { 
    PlusCircle, 
} from 'lucide-react';
import './HomePageStyle.css'
import HeaderHome from './uiHomePage/HeaderHome.tsx';
import { mockUser } from './uiHomePage/HeaderHome.tsx';

import InvitationCard from './uiHomePage/InvitationCard.tsx';
import { mockInvitations } from './uiHomePage/InvitationCard.tsx';

import CompanyCard from './uiHomePage/CompanyCard.tsx';
import { mockCompanies } from './uiHomePage/CompanyCard.tsx';
import type { Company } from './uiHomePage/CompanyCard.tsx';
import { useNavigate } from 'react-router-dom';


// --- COMPONENTES EMBUTIDOS ---

const CreateCompanyCard: FC = () => {
    const navigate = useNavigate()

    return(
    <button className="card create-company-card" onClick={() => navigate('/cadastrarempresa')}>
        <div className="create-company-icon">
            <PlusCircle size={32} />
        </div>
        <h3 className="create-company-text">Criar Nova Empresa</h3>
    </button>
)};

// --- COMPONENTE PRINCIPAL DA PÁGINA ---

export default function HomePage() {
    const [companies, setCompanies] = useState(mockCompanies);
    const [invitations, setInvitations] = useState(mockInvitations);
    const user = mockUser;

    const handleDeclineInvitation = (id: string) => {
        setInvitations(prev => prev.filter(inv => inv.id !== id));
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
        }
    };

    return (
        <>
            <div className="home-container">
                <HeaderHome user={user}/>
                <main>
                    <section className="welcome-section">
                        <h1 className="welcome-title">Bem-vindo(a) de volta, {user.name.split(' ')[0]}!</h1>
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
        </>
    );
}
