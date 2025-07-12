import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface Company {
    id: string;
    name: string;
    logoUrl: string;
}

const mockCompanies: Company[] = [
    { id: '1', name: 'FrioFácil Refrigeração', logoUrl: 'https://placehold.co/150x150/E0F2FE/3B82F6?text=FF' },
    { id: '2', name: 'Gelado Express', logoUrl: 'https://placehold.co/150x150/D1FAE5/065F46?text=GE' },
];

const CompanyCard: FC<{ company: Company }> = ({ company }) => {
    const navigate = useNavigate()

    return(
        <div className="card company-card">
            <img src={company.logoUrl} alt={`${company.name} logo`} className="company-logo" />
            <h3 className="company-name">{company.name}</h3>
            <p className="company-role">Administrador</p>
            <button className="button button-primary manage-button" onClick={() => navigate('/dashboard')}>Gerenciar</button>
        </div>
    )

};

export default CompanyCard
export {mockCompanies}
export type {Company}