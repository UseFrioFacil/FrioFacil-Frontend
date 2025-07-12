import type { FC } from 'react';
import { MapPin, Star } from 'lucide-react';

interface Technician {
  id: number;
  name: string;
  avatarUrl: string;
  location: string;
  rating: number;
}

const TechnicianInfoCard: FC<{ tech: Technician }> = ({ tech }) => (
  <div className="technician-card">
    <img src={tech.avatarUrl} alt={`Foto de ${tech.name}`} className="technician-avatar" />
    <div className="technician-info">
      <p className="technician-label">Solicitando serviço para:</p>
      <h2 className="technician-name">{tech.name}</h2>
      <div className="technician-details">
        <div className="detail-item">
          <MapPin className="w-4 h-4" />
          <span>{tech.location}</span>
        </div>
        <div className="detail-item">
          <Star className="rating-icon" />
          <span>{tech.rating}</span>
        </div>
      </div>
    </div>
  </div>
);

export default TechnicianInfoCard