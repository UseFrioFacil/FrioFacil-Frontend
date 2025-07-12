import { useState } from "react";
import type { FC } from "react";
import { Send } from "lucide-react";

const NotificacoesView: FC = () => {
    const [message, setMessage] = useState('');
    
    const templates = [
        { title: 'Lembrete de Manutenção', text: 'Olá, {cliente}! Passando para lembrar que a manutenção preventiva do seu ar condicionado está próxima. Vamos agendar?' },
        { title: 'Aviso de Pagamento', text: 'Olá, {cliente}. A sua fatura referente ao serviço {serviço} vence em 3 dias. Agradecemos a sua preferência!' },
        { title: 'Pesquisa de Satisfação', text: 'Olá, {cliente}! Gostaríamos de saber como foi a sua experiência com o nosso serviço. Poderia nos dar o seu feedback?' },
    ];

    return (
        <div className="animate-fade-in">
            <h2 className="view-title">Notificações e Lembretes</h2>
            <p className="view-subtitle">Envie mensagens manuais ou configure lembretes automáticos para os seus clientes via WhatsApp.</p>

            <div className="notifications-layout">
                <div className="notification-main-panel">
                    <h3>Envio Manual de Mensagem</h3>
                    <div className="form-group">
                        <label htmlFor="message">Mensagem</label>
                        <textarea
                            id="message"
                            rows={6}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Escreva a sua mensagem aqui..."
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="recipients">Destinatários</label>
                        <input type="text" id="recipients" placeholder="Todos os clientes, ou selecione..." />
                    </div>
                    <button className="button button-whatsapp">
                        <Send size={16} />
                        <span>Enviar via WhatsApp</span>
                    </button>
                </div>
                <div className="notification-sidebar">
                    <div className="card">
                        <h3>Modelos Rápidos</h3>
                        <div className="templates-list">
                            {templates.map(template => (
                                <button key={template.title} onClick={() => setMessage(template.text)} className="template-button">
                                    {template.title}
                                </button>
                            ))}
                        </div>
                    </div>
                     <div className="card">
                        <h3>Automações</h3>
                         <div className="automation-item">
                             <div>
                                 <p className="font-semibold">Lembrete de Manutenção</p>
                                 <p className="text-xs">Enviado 7 dias antes do prazo.</p>
                             </div>
                             <button className="toggle-switch active">
                                 <span className="toggle-handle"></span>
                             </button>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default NotificacoesView