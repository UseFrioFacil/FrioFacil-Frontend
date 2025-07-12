import type { FC, ElementType } from 'react';
import '../../DashboardStyle.css'


interface StatCardProps {
    icon: ElementType;
    iconColor: string;
    title: string;
    value: string;
    description?: string;
}

const StatCard: FC<StatCardProps> = ({ icon: Icon, iconColor, title, value, description }) => (
    <div className="stat-card">
        <div className="stat-card-icon" style={{ backgroundColor: iconColor }}>
            <Icon size={24} color="white" />
        </div>
        <div>
            <p className="stat-card-title">{title}</p>
            <p className="stat-card-value">{value}</p>
            {description && <p className="stat-card-description">{description}</p>}
        </div>
    </div>
);

export default StatCard
