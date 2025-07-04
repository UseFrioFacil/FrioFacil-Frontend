import type { FC, ElementType } from 'react';

interface FeatureIconProps {
  icon: ElementType;
  color: string;
}

const FeatureIcon: FC<FeatureIconProps> = ({ icon: Icon, color }) => (
  <div className={`feature-icon ${color}`}>
    <Icon />
  </div>
);

export default FeatureIcon
