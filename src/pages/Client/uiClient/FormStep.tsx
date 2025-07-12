import type { FC } from 'react';

interface StepProps {
  title: string;
  children: React.ReactNode;
}

const FormStep: FC<StepProps> = ({ title, children }) => (
  <div className="form-step">
    <h3 className="step-title">{title}</h3>
    {children}
  </div>
);

export default FormStep