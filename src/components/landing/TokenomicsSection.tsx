import React from 'react';
// Removed Coins, ShoppingBag, Zap as they are no longer used in the simplified distribution
import { PieChart, Users, ShieldCheck } from 'lucide-react';

interface TokenDistributionItemProps {
  category: string;
  percentage: number;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
}

const TokenDistributionItem: React.FC<TokenDistributionItemProps> = ({
  category,
  percentage,
  description,
  icon,
  colorClass,
}) => {
  const parts = colorClass.split(' ');
  const rawBgColorClass = parts[0];
  const rawTextColorClass = parts[1];

  let baseColor = 'gray';
  // Ensure finalBgColorClass is a complete, valid Tailwind background class string
  let finalBgColorClass = 'bg-gray-500';
  if (rawBgColorClass && rawBgColorClass.startsWith('bg-')) {
    finalBgColorClass = rawBgColorClass;
    const colorParts = rawBgColorClass.split('-');
    // Ensure colorParts[1] exists and is a non-empty string before assigning
    if (colorParts.length > 1 && typeof colorParts[1] === 'string' && colorParts[1].length > 0) {
      baseColor = colorParts[1];
    }
    // Otherwise, baseColor remains 'gray' as initialized
  }

  // Ensure textColorClass is a complete, valid Tailwind text color class string
  const textColorClass =
    rawTextColorClass && rawTextColorClass.startsWith('text-')
      ? rawTextColorClass
      : 'text-gray-400';

  const spanBgClassWithOpacity = `${finalBgColorClass}/20`;
  const borderColor = `border-${baseColor}-500`;
  const hoverBorderColor = `hover:border-${baseColor}-400`;

  // Construct class strings separately to help TypeScript
  const spanClasses = `p-3 rounded-full ${spanBgClassWithOpacity} mb-4 ${textColorClass} group-hover:scale-110 transition-transform duration-300`;
  const categoryTextClasses = `text-lg font-semibold ${textColorClass} mb-2`;

  return (
    <div
      className={`p-6 rounded-xl border ${borderColor}/30 shadow-lg backdrop-blur-sm bg-card/70 flex flex-col items-center text-center transition-all duration-300 ease-out hover:shadow-xl hover:scale-[1.03] ${hoverBorderColor}/50`}
    >
      <span className={spanClasses}>{icon}</span>
      <h3 className={`text-2xl font-bold text-foreground mb-1`}>{percentage}%</h3>
      <p className={categoryTextClasses}>{category}</p>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
};

const TokenomicsSection: React.FC = () => {
  const distribution = [
    {
      category: 'Public Sale',
      percentage: 90,
      description:
        'Majority of tokens allocated for public sale, ensuring wide distribution and community ownership.',
      icon: <Users size={32} />,
      colorClass: 'bg-emerald-500 text-emerald-400',
    },
    {
      category: 'Dev Wallet (Locked)',
      percentage: 10,
      description:
        'Reserved for development and team incentives. Locked until $10M market cap. At $10M MC, 9% of this wallet (0.9% of total supply) will be burned.',
      icon: <ShieldCheck size={32} />,
      colorClass: 'bg-violet-500 text-violet-400',
    },
  ];

  const totalPercentage = distribution.reduce((sum, item) => sum + item.percentage, 0);

  return (
    <section className="py-16 bg-background/70 backdrop-blur-md">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
          FlowsyAI Tokenomics
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
          A balanced and sustainable token distribution designed to foster long-term growth and
          community engagement.
        </p>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {distribution.map((item, index) => (
            <div
              key={item.category}
              className="animate-fade-in group"
              style={{
                animationDelay: `${index * 0.15}s`,
                opacity: 0,
                animationFillMode: 'forwards',
              }}
            >
              <TokenDistributionItem {...item} />
            </div>
          ))}
        </div>

        <div className="max-w-md mx-auto p-6 rounded-xl border border-primary/30 shadow-lg backdrop-blur-sm bg-card/70">
          <div className="flex justify-center items-center mb-4">
            <PieChart size={48} className="text-primary mr-3" />
            <h3 className="text-2xl font-bold text-foreground">Token Allocation Overview</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            The FlowsyAI token ($FSY) distribution is strategically planned to support the
            ecosystem's growth, development, and community. Below is a summary of the allocation
            categories.
          </p>
          <ul className="space-y-2 text-left">
            {distribution.map(item => {
              const itemTextColorClass = item.colorClass.split(' ')[1] ?? 'text-gray-400';
              return (
                <li key={item.category} className="flex justify-between items-center text-sm">
                  <span className={`font-medium ${itemTextColorClass}`}>{item.category}:</span>
                  <span className="text-foreground font-semibold">{item.percentage}%</span>
                </li>
              );
            })}
          </ul>
          {totalPercentage !== 100 && (
            <p className="text-xs text-destructive mt-4">
              Note: Percentages do not sum to 100%. This is a conceptual representation.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default TokenomicsSection;
