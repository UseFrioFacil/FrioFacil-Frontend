import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface Company {
    id: string;
    name: string;
    logoUrl: string;
    role: string; 
}

const roleDisplayNames: { [key: string]: string } = {
    owner: 'Proprietário',
    admin: 'Administrador',
    funcionario: 'Membro',
};

const CompanyCard: FC<{ company: Company }> = ({ company }) => {
    const navigate = useNavigate();

    const displayRole = roleDisplayNames[company.role.toLowerCase()] || company.role;

    return(
        <div className="card company-card">
            <img src={company.logoUrl} alt={`${company.name} logo`} className="company-logo" />
            <h3 className="company-name">{company.name}</h3>
            <p className="company-role">{displayRole}</p>
            <button className="button button-primary manage-button" onClick={() => navigate('/dashboard')}>Gerenciar</button>
        </div>
    )
};

export default CompanyCard;
export type { Company };
