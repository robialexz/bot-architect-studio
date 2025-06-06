import { useState, useCallback } from 'react';

interface ComingSoonConfig {
  feature?: string;
  expectedDate?: string;
  description?: string;
}

export const useComingSoon = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<ComingSoonConfig>({});

  const showComingSoon = useCallback((config: ComingSoonConfig = {}) => {
    setModalConfig(config);
    setIsModalOpen(true);
  }, []);

  const hideComingSoon = useCallback(() => {
    setIsModalOpen(false);
    // Clear config after animation completes
    setTimeout(() => setModalConfig({}), 300);
  }, []);

  // Pre-configured coming soon handlers for common features
  const comingSoonHandlers = {
    // Authentication & Account
    login: () =>
      showComingSoon({
        feature: 'User Authentication',
        expectedDate: 'Coming Soon',
        description:
          "Secure user authentication system will be available with the full platform launch. We're implementing enterprise-grade security features.",
      }),

    register: () =>
      showComingSoon({
        feature: 'User Registration',
        expectedDate: 'Coming Soon',
        description:
          'New user registration will be available with the platform launch, featuring advanced security and verification capabilities.',
      }),

    // Workflow Features
    workflowBuilder: () =>
      showComingSoon({
        feature: 'AI Workflow Builder',
        expectedDate: 'Coming Soon',
        description:
          'Our revolutionary drag-and-drop workflow builder with AI integration is in active development. Experience the future of automation.',
      }),

    workflowTemplates: () =>
      showComingSoon({
        feature: 'Workflow Templates',
        expectedDate: 'Coming Soon',
        description:
          'Pre-built workflow templates for common automation tasks. Save time with our curated library of professional workflows.',
      }),

    // AI Features
    aiAgents: () =>
      showComingSoon({
        feature: 'AI Agents',
        expectedDate: 'Coming Soon',
        description:
          'Intelligent AI agents that can execute complex tasks autonomously. The next generation of AI automation is coming.',
      }),

    aiOptimization: () =>
      showComingSoon({
        feature: 'AI Optimization Hub',
        expectedDate: 'Coming Soon',
        description:
          'Advanced AI model optimization and performance tuning tools for enterprise-grade deployments.',
      }),

    // Platform Features
    dashboard: () =>
      showComingSoon({
        feature: 'User Dashboard',
        expectedDate: 'Coming Soon',
        description:
          'Comprehensive dashboard with analytics, project management, and real-time monitoring of your AI workflows.',
      }),

    projects: () =>
      showComingSoon({
        feature: 'Project Management',
        expectedDate: 'Coming Soon',
        description:
          'Advanced project organization and collaboration tools for teams building AI automation solutions.',
      }),

    // AR & Advanced Features
    arWorkflow: () =>
      showComingSoon({
        feature: 'AR Workflow Interface',
        expectedDate: 'Coming Soon',
        description:
          'Revolutionary augmented reality interface for 3D workflow manipulation. Experience Iron Man-style gesture controls.',
      }),

    // Enterprise Features
    enterpriseIntegrations: () =>
      showComingSoon({
        feature: 'Enterprise Integrations',
        expectedDate: 'Coming Soon',
        description:
          'Seamless integration with enterprise systems including CRM, ERP, and custom APIs for large-scale deployments.',
      }),

    // Pricing & Launch
    pricing: () =>
      showComingSoon({
        feature: 'Pricing Plans',
        expectedDate: 'Coming Soon',
        description:
          'Our innovative pricing system will launch with the platform. Early supporters will receive exclusive benefits and priority access.',
      }),

    // Demo & Trial
    demo: () =>
      showComingSoon({
        feature: 'Interactive Demo',
        expectedDate: 'Coming Soon',
        description:
          'Experience our platform with a fully interactive demo showcasing real AI workflow automation capabilities.',
      }),

    trial: () =>
      showComingSoon({
        feature: 'Free Trial',
        expectedDate: 'Coming Soon',
        description:
          'Start your AI automation journey with our comprehensive free trial. No credit card required.',
      }),

    // Generic fallback
    generic: (feature?: string) =>
      showComingSoon({
        feature: feature || 'This Feature',
        expectedDate: 'Coming Soon',
        description:
          "We're working hard to bring you this amazing feature as part of our comprehensive AI workflow platform.",
      }),
  };

  return {
    isModalOpen,
    modalConfig,
    showComingSoon,
    hideComingSoon,
    comingSoonHandlers,
  };
};

export default useComingSoon;
