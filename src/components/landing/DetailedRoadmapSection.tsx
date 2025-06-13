import React from 'react';
import {
  CheckCircle,
  Zap,
  Rocket,
  Flag,
  Target,
  Building,
  Users,
  ShoppingCart,
} from 'lucide-react';

interface RoadmapItemProps {
  title: string;
  date?: string;
  status: 'completed' | 'inprogress' | 'planned';
  description: string;
  icon: React.ReactNode;
}

const RoadmapItem: React.FC<RoadmapItemProps> = ({ title, date, status, description, icon }) => {
  const statusColors = {
    completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    inprogress: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    planned: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  };
  const statusText = {
    completed: 'Completed',
    inprogress: 'In Progress',
    planned: 'Planned',
  };
  // Safely extract color name (e.g., 'emerald' from 'text-emerald-400')
  const textClass = statusColors[status].split(' ').find(cls => cls.startsWith('text-'));
  const colorName = textClass ? textClass.split('-')[1] : 'gray';

  return (
    <div
      className={`relative p-6 rounded-xl border ${statusColors[status]} shadow-lg backdrop-blur-sm bg-card/70 transition-all duration-300 ease-out hover:shadow-xl hover:scale-[1.03] hover:border-${colorName}-500/50`}
    >
      <div className="flex items-center mb-3">
        <span className="p-2 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 mr-3 text-primary group-hover:scale-110 transition-transform duration-300">
          {icon}
        </span>
        <div>
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
          {date && <p className="text-sm text-muted-foreground">{date}</p>}
        </div>
        <span
          className={`ml-auto px-3 py-1 text-xs font-semibold rounded-full ${statusColors[status].replace('bg-', 'text-').replace('/20', '')} border border-current`}
        >
          {statusText[status]}
        </span>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
};

const DetailedRoadmapSection: React.FC = () => {
  const roadmapPhases = [
    {
      phaseTitle: 'Phase 1: Foundation & Launch (Q2 2025)',
      items: [
        {
          title: 'FlowsyAI Coin Launch',
          date: 'June 2025',
          status: 'completed',
          description:
            'Successful launch of the FlowsyAI native token, establishing the economic backbone of our ecosystem.',
          icon: <Rocket size={24} />,
        },
        {
          title: 'Global Marketing Campaign Kick-off',
          date: 'June 12, 2025',
          status: 'completed',
          description:
            'Initiation of a comprehensive global marketing strategy to build brand awareness and community engagement.',
          icon: <Flag size={24} />,
        },
        {
          title: 'Platform Migration & Enhancement',
          date: 'Target: June 25, 2025',
          status: 'inprogress',
          description:
            'Ongoing migration to a more robust and scalable infrastructure, incorporating initial user feedback and performance upgrades.',
          icon: <Zap size={24} />,
        },
      ],
    },
    {
      phaseTitle: 'Phase 2: Ecosystem Expansion (Q3-Q4 2025)',
      items: [
        {
          title: 'Core Platform: Visual Workflow Builder v1.0',
          status: 'planned',
          description:
            'Full release of our intuitive drag-and-drop AI workflow builder, enabling users to create and deploy custom AI agents.',
          icon: <Target size={24} />,
        },
        {
          title: 'AI Agent Marketplace Launch',
          status: 'planned',
          description:
            'Introduction of an open marketplace for users and developers to share, discover, and monetize AI agents and workflow templates.',
          icon: <ShoppingCart size={24} />,
        },
        {
          title: 'Community Governance Portal',
          status: 'planned',
          description:
            'Launch of a decentralized governance portal for token holders to participate in platform decisions and proposals.',
          icon: <Users size={24} />,
        },
      ],
    },
    {
      phaseTitle: 'Phase 3: Advanced Capabilities & Growth (2026)',
      items: [
        {
          title: 'Real-Time Collaboration Tools',
          status: 'planned',
          description:
            'Implementation of features allowing multiple users to collaboratively design and manage AI workflows in real-time.',
          icon: <Users size={24} />,
        },
        {
          title: 'Advanced AI Model Fine-Tuning',
          status: 'planned',
          description:
            'Integration of tools for users to fine-tune various AI models using their own data, enhancing customization and performance.',
          icon: <CheckCircle size={24} />,
        },
        {
          title: 'Enterprise Solutions & Integrations',
          status: 'planned',
          description:
            'Development of enterprise-grade features, including advanced security, dedicated support, and seamless integrations with major business platforms.',
          icon: <Building size={24} />,
        },
      ],
    },
  ] as const;

  return (
    <section className="py-16 bg-background/70 backdrop-blur-md">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
          Development Roadmap
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
          Follow our journey as we build the future of AI automation. We are committed to
          transparency and continuous innovation.
        </p>
        <div className="space-y-12">
          {roadmapPhases.map((phase, phaseIndex) => (
            <div
              key={phase.phaseTitle}
              className="animate-slide-up"
              style={{
                animationDelay: `${phaseIndex * 0.2}s`,
                opacity: 0,
                animationFillMode: 'forwards',
              }}
            >
              {' '}
              {/* Added entrance animation */}
              <h3 className="text-2xl font-semibold text-foreground mb-6 text-left">
                {phase.phaseTitle}
              </h3>
              <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {phase.items.map((item, itemIndex) => (
                  <div
                    key={item.title}
                    className="animate-fade-in"
                    style={{
                      animationDelay: `${phaseIndex * 0.2 + itemIndex * 0.1}s`,
                      opacity: 0,
                      animationFillMode: 'forwards',
                    }}
                  >
                    {' '}
                    {/* Added entrance animation */}
                    <RoadmapItem {...item} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DetailedRoadmapSection;
