import type { FC } from "react";
import { useState,useMemo } from "react";
import { X, ChevronLeft, ChevronRightIcon } from "lucide-react";

//Clientes
import { initialMockClientes } from './ClientesView';
import type { Cliente } from './ClientesView';

//Servicos
import { initialMockServicos } from './ServicesView.tsx';
import type { Servico } from './ServicesView.tsx';
import type { ServicoStatus } from './ServicesView.tsx';

//Funcionario
import type { Funcionario } from './FuncionariosView.tsx';
import { initialMockFuncionarios } from './FuncionariosView.tsx';

const AgendaView: FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 4)); // July 4, 2025
    const [servicos] = useState<Servico[]>(initialMockServicos);
    const [clientes] = useState<Cliente[]>(initialMockClientes);
    const [funcionarios] = useState<Funcionario[]>(initialMockFuncionarios);
    const [selectedServico, setSelectedServico] = useState<Servico | null>(null);

    const findCliente = (id: number) => clientes.find(c => c.id === id);
    const findFuncionario = (id: number | null) => id ? funcionarios.find(f => f.id === id) : null;

    const getStatusColorClass = (status: ServicoStatus) => {
        switch (status) {
            case 'Aguardando Contato': return 'bg-purple-500';
            case 'Agendado': return 'bg-blue-500';
            case 'Em Andamento': return 'bg-yellow-500';
            case 'Concluído': return 'bg-green-500';
            case 'Cancelado': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startingDay = firstDayOfMonth.getDay();
    const daysInMonth = Array.from({ length: lastDayOfMonth.getDate() }, (_, i) => i + 1);
    const today = new Date();

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    const servicesByDate = useMemo(() => {
        const grouped: { [key: string]: Servico[] } = {};
        servicos.forEach(servico => {
            if (servico.dataAgendamento) {
                const date = servico.dataAgendamento;
                if (!grouped[date]) {
                    grouped[date] = [];
                }
                grouped[date].push(servico);
            }
        });
        return grouped;
    }, [servicos]);

    return (
        <div className="animate-fade-in">
            <div className="view-header" style={{marginBottom: '1.5rem'}}>
                <h2 className="view-title">Agenda</h2>
                <div className="calendar-navigation">
                    <button onClick={() => changeMonth(-1)} className="nav-button"><ChevronLeft size={20} /></button>
                    <span className="calendar-month-year">
                        {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={() => changeMonth(1)} className="nav-button"><ChevronRightIcon size={20} /></button>
                </div>
            </div>
            <div className="calendar-container">
                <div className="calendar-grid-header">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="calendar-grid">
                    {Array.from({ length: startingDay }).map((_, i) => <div key={`empty-${i}`} className="calendar-day empty"></div>)}
                    {daysInMonth.map(day => {
                        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const isToday = day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
                        const dailyServices = servicesByDate[dateStr] || [];
                        return (
                            <div key={day} className={`calendar-day ${isToday ? 'today' : ''}`}>
                                <span className="day-number">{day}</span>
                                <div className="services-list">
                                    {dailyServices.map(servico => (
                                        <button key={servico.id} onClick={() => setSelectedServico(servico)} className={`service-entry ${getStatusColorClass(servico.status)}`}>
                                            {servico.horario} - {findCliente(servico.clienteId)?.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            {selectedServico && (
                <div className="modal-overlay" onClick={() => setSelectedServico(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Detalhes do Serviço</h3>
                            <button onClick={() => setSelectedServico(null)} className="modal-close-button"><X size={24} /></button>
                        </div>
                        <div className="modal-body">
                            <p><strong>Cliente:</strong> {findCliente(selectedServico.clienteId)?.name}</p>
                            <p><strong>Telefone:</strong> {findCliente(selectedServico.clienteId)?.telefone}</p>
                            <p><strong>Descrição:</strong> {selectedServico.descricao}</p>
                            <p><strong>Local:</strong> {selectedServico.local}</p>
                            <p><strong>Funcionário:</strong> {findFuncionario(selectedServico.funcionarioId)?.name || 'Não atribuído'}</p>
                            <p><strong>Data:</strong> {new Date(selectedServico.dataAgendamento!).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
                            <p><strong>Horário:</strong> {selectedServico.horario}</p>
                            <p><strong>Valor:</strong> R$ {selectedServico.valor.toFixed(2)}</p>
                            <p><strong>Status:</strong> <span className={`status-badge ${getStatusColorClass(selectedServico.status)}`}>{selectedServico.status}</span></p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default AgendaView