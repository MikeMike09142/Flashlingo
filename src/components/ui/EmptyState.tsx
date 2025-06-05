import React from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  actionLink?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText = "Create New Card",
  actionLink = "/create",
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
        {icon || <Plus size={24} className="text-neutral-400" />}
      </div>
      <h3 className="text-lg font-medium text-neutral-700 mb-2">{title}</h3>
      <p className="text-neutral-500 max-w-md mb-6">{description}</p>
      
      {actionLink ? (
        <Link
          to={actionLink}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          <Plus size={18} className="mr-2" />
          {actionText}
        </Link>
      ) : onAction ? (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          <Plus size={18} className="mr-2" />
          {actionText}
        </button>
      ) : null}
    </div>
  );
};

export default EmptyState;