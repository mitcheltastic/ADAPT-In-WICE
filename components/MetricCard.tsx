import React from 'react';

interface MetricCardProps {
  title: string;
  value: number | string;
  borderColor: string;
  textColor: string;
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  borderColor,
  textColor,
  icon,
}) => {
  return (
    <div
      className="glass-card glass-card-hover rounded-2xl p-5 text-center relative overflow-hidden border-t-4"
      style={{ borderTopColor: borderColor }}
    >
      <div className="flex items-center justify-center gap-2 mb-1">
        {icon}
        <h4 className="text-xs font-bold text-pink-700 tracking-wider uppercase">
          {title}
        </h4>
      </div>
      <h2
        className="text-3xl md:text-4xl font-extrabold"
        style={{ color: textColor }}
      >
        {value}
      </h2>
    </div>
  );
};
