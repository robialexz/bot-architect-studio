import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  useCase: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, useCase }) => {
  return (
    <Card className="bg-slate-800/30 backdrop-blur-md border card-flow-border rounded-xl p-6 transition-all duration-300 shadow-2xl hover:shadow-blue-500/30 flex flex-col h-full">
      <CardHeader className="flex flex-col items-center text-center">
        <div className="mb-4 text-cyan-400">
          {React.cloneElement(icon as React.ReactElement, { size: 40 })}
        </div>
        <CardTitle className="text-xl font-bold text-cyan-400">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <p className="text-neutral-300 mb-4 text-sm">{description}</p>
        <div className="mt-auto pt-4 border-t border-slate-700">
          <h4 className="text-sm font-semibold text-cyan-500 mb-1">Exemplu:</h4>
          <p className="text-neutral-400 text-xs">{useCase}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
