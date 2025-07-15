import type { FC } from 'react';
import { 
    Check,
    X,
    Mail
} from 'lucide-react';

// ATUALIZAÇÃO 1: A interface foi sincronizada com a de HomePage.tsx, removendo o campo 'from'.
export interface Invitation {
    id: string;
    companyName: string;
}

const InvitationCard: FC<{ invitation: Invitation, onAccept: (id: string) => void, onDecline: (id: string) => void }> = ({ invitation, onAccept, onDecline }) => (
    <div className="card invitation-card">
        <div className="invitation-icon">
            <Mail size={24} />
        </div>
        <div className="invitation-details">
            {/* O texto foi ajustado para não depender mais do campo 'from' */}
            <p>Você recebeu um convite para se juntar à empresa <strong>{invitation.companyName}</strong>.</p>
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

export default InvitationCard;
