import type { FC } from 'react';

interface ProblemTagProps {
  icon: React.ElementType;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const ProblemTag: FC<ProblemTagProps> = ({ icon: Icon, label, isSelected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`problem-tag ${isSelected ? 'problem-tag-selected' : 'problem-tag-default'}`}
  >
    <Icon className="problem-icon" />
    <span className="problem-label">{label}</span>
  </button>
);

export default ProblemTag