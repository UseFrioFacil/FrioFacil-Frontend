import { ChevronUp, ChevronDown } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";

const InformacoesView: FC = () => {
    const FaqItem: FC<{ question: string; answer: string }> = ({ question, answer }) => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <div className="faq-item">
                <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
                    <h4>{question}</h4>
                    {isOpen ? <ChevronUp size={20} color="#3b82f6" /> : <ChevronDown size={20} />}
                </button>
                {isOpen && (
                    <div className="faq-answer">
                        <p>{answer}</p>
                    </div>
                )}
            </div>
        );
    };

    return (
       <div className="animate-fade-in">
             <h2 className="view-title">Informações e Políticas</h2>
             <p className="view-subtitle">Políticas e diretrizes importantes para a equipa.</p>
             <div className="card">
                <FaqItem
                    question="Código de Vestimenta"
                    answer="Todos os técnicos devem usar o uniforme completo fornecido pela empresa durante o horário de trabalho. O uniforme deve estar sempre limpo e em bom estado. O uso de calçado de segurança é obrigatório em todas as visitas técnicas."
                />
                <FaqItem
                    question="Política de Reembolso de Despesas"
                    answer="Despesas com combustível e pequenas ferramentas (até R$50,00) podem ser reembolsadas mediante apresentação de nota fiscal. As solicitações de reembolso devem ser feitas através do portal do funcionário até ao dia 25 de cada mês."
                />
                <FaqItem
                    question="Protocolo de Atendimento ao Cliente"
                    answer="Seja sempre cordial e profissional. Apresente-se ao chegar no local, explique o serviço que será realizado e, ao finalizar, mostre ao cliente o que foi feito e peça a sua assinatura na ordem de serviço digital."
                />
             </div>
        </div>
    );
};

export default InformacoesView