// src/components/LoadingScreen/LoadingScreen.tsx
import type { FC } from 'react';
import './LoadingSpinnerStyle.css';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingSpinner: FC<LoadingScreenProps> = ({ isLoading }) => {
  const loadingClassName = `loading-screen ${!isLoading ? 'hidden' : ''}`;

  return (
    <div className={loadingClassName}>
      <div className="loading-content">
        <div className="spinner"></div>
        <h2 className="loading-title">FrioFácil</h2>
        <p className="loading-text">Preparando tudo para você...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;