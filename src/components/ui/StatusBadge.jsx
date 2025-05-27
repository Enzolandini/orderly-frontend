import React from 'react';
import { cn } from '../utils';

const StatusBadge = ({ status, className, ...props }) => {
  const statusConfig = {
    PENDENTE: {
      color: "warning",
      label: "Pendente",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )
    },
    APROVADO: {
      color: "success",
      label: "Aprovado",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      )
    },
    REAGENDADO: {
      color: "primary",
      label: "Reagendado",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 2v6h-6" />
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
          <path d="M3 22v-6h6" />
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
        </svg>
      )
    },
    CONCLUIDO: {
      color: "secondary",
      label: "Concluído",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )
    },
    CANCELADO: {
      color: "danger",
      label: "Cancelado",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )
    }
  };

  const config = statusConfig[status] || {
    color: "secondary",
    label: status,
    icon: null
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-yellow-100 text-yellow-800": config.color === "warning",
          "bg-green-100 text-green-800": config.color === "success",
          "bg-blue-100 text-blue-800": config.color === "primary",
          "bg-purple-100 text-purple-800": config.color === "secondary",
          "bg-red-100 text-red-800": config.color === "danger",
        },
        className
      )}
      {...props}
    >
      {config.icon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </div>
  );
};

export { StatusBadge };
