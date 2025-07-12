
import type { FC } from 'react';
import { useState, useMemo } from 'react';
import { 
    DollarSign, X, PlusCircle, TrendingUp, TrendingDown
} from 'lucide-react';
import StatCard from './layout/StatCard';

type TransactionType = 'Receita' | 'Despesa';

interface Transaction {
    id: number;
    description: string;
    type: TransactionType;
    amount: number;
    date: string;
}

const initialTransactions: Transaction[] = [
    { id: 1, description: "Serviço #2 - Instalação de Câmara Fria", type: "Receita", amount: 3500, date: "2025-07-03" },
    { id: 2, description: "Compra de Ferramentas", type: "Despesa", amount: 450, date: "2025-07-01" },
    { id: 3, description: "Adiantamento Funcionário", type: "Despesa", amount: 300, date: "2025-06-30" },
    { id: 4, description: "Serviço #X - ...", type: "Receita", amount: 800, date: "2025-06-25" },
];

const TransactionModal: FC<{isOpen: boolean, onClose: () => void, onSave: (data: any) => void}> = ({ isOpen, onClose, onSave }) => {
    const initialState = { description: '', amount: '', type: 'Receita' as TransactionType };
    const [formData, setFormData] = useState(initialState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, amount: Number(formData.amount) });
        setFormData(initialState);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-fade-in">
                <div className="modal-header">
                    <h3>Nova Transação</h3>
                    <button onClick={onClose} className="modal-close-button"><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="description">Descrição</label>
                            <input type="text" name="description" id="description" value={formData.description} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="amount">Valor (R$)</label>
                            <input type="number" step="0.01" name="amount" id="amount" value={formData.amount} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="type">Tipo</label>
                            <select name="type" id="type" value={formData.type} onChange={handleChange}>
                                <option value="Receita">Receita</option>
                                <option value="Despesa">Despesa</option>
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="button button-secondary">Cancelar</button>
                        <button type="submit" className="button button-primary">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const FinanceiroView: FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const { receita, despesa, lucro } = useMemo(() => {
        const receita = transactions.filter(t => t.type === 'Receita').reduce((acc, t) => acc + t.amount, 0);
        const despesa = transactions.filter(t => t.type === 'Despesa').reduce((acc, t) => acc + t.amount, 0);
        return { receita, despesa, lucro: receita - despesa };
    }, [transactions]);
    
    const handleSaveTransaction = (data: Omit<Transaction, 'id' | 'date'>) => {
        const newTransaction: Transaction = {
            ...data,
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
        };
        setTransactions(prev => [newTransaction, ...prev]);
        setIsModalOpen(false);
    };

    return (
        <div className="animate-fade-in">
            <div className="view-header">
                <div>
                    <h2 className="view-title">Financeiro</h2>
                    <p className="view-subtitle">Acompanhe as suas receitas e despesas.</p>
                </div>
                <div className="view-header-actions">
                    <button onClick={() => setIsModalOpen(true)} className="button button-primary">
                        <PlusCircle size={20} />
                        <span>Nova Transação</span>
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <StatCard icon={TrendingUp} iconColor="#22c55e" title="Faturamento Total" value={`R$ ${receita.toFixed(2)}`} />
                <StatCard icon={TrendingDown} iconColor="#ef4444" title="Despesas Totais" value={`R$ ${despesa.toFixed(2)}`} />
                <StatCard icon={DollarSign} iconColor="#3b82f6" title="Lucro Líquido" value={`R$ ${lucro.toFixed(2)}`} />
            </div>

            <div className="table-container">
                <h3 className="table-title">Últimas Transações</h3>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead className="hide-sm">
                            <tr>
                                <th>Descrição</th>
                                <th>Data</th>
                                <th style={{textAlign: 'right'}}>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(t => (
                                <tr key={t.id}>
                                    <td data-label="Descrição" className="text-main">{t.description}</td>
                                    <td data-label="Data">{new Date(t.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                                    <td data-label="Valor" className={`font-semibold ${t.type === 'Receita' ? 'text-green' : 'text-red'}`} style={{textAlign: 'right'}}>
                                        {t.type === 'Despesa' && '- '}R$ {t.amount.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveTransaction} />
        </div>
    );
};

export default FinanceiroView