import type { FC } from 'react';
import { 
    Check,
    X,
    Mail
} from 'lucide-react';

interface Invitation {
    id: string;
    companyName: string;
    from: string;
}

const mockInvitations: Invitation[] = [
    { id: 'inv1', companyName: 'Refrigeração Ártico', from: 'contato@artico.com' },
];

const InvitationCard: FC<{ invitation: Invitation, onAccept: (id: string) => void, onDecline: (id: string) => void }> = ({ invitation, onAccept, onDecline }) => (
    <div className="card invitation-card">
        <div className="invitation-icon">
            <Mail size={24} />
        </div>
        <div className="invitation-details">
            <p>Você foi convidado para se juntar à empresa <strong>{invitation.companyName}</strong>.</p>
            <p className="invitation-from">De: {invitation.from}</p>
        </div>
        <div className="invitation-actions">
            <button className="button-icon accept" onClick={() => onAccept(invitation.id)} aria-label="Aceitar">
                <Check size={20} />
            </button>
            <button className="button-icon decline" onClick={() => onDecline(invitation.id)} aria-label="Recusar">
                <X size={20} />
            </button>
        </div>
    </div>
);

export default InvitationCard
export {mockInvitations}