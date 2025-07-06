import type { FC } from "react";
import { AlertTriangle } from "lucide-react";

const ConfirmationModal: FC<{isOpen: boolean, onClose: () => void, onConfirm: () => void, title: string, message: string}> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content animate-fade-in" style={{maxWidth: '448px'}}>
                <div style={{textAlign: 'center', padding: '1.5rem'}}>
                    <div className="confirmation-icon-wrapper">
                        <AlertTriangle size={24} color="#dc2626" />
                    </div>
                    <h3 className="confirmation-title">{title}</h3>
                    <div className="confirmation-message">
                        <p>{message}</p>
                    </div>
                </div>
                <div className="confirmation-footer">
                    <button onClick={onClose} className="button button-secondary">Cancelar</button>
                    <button onClick={onConfirm} className="button button-danger">Confirmar Exclusão</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal