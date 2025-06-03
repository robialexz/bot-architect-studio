import React from 'react';
import { Button } from '@/components/ui/button';
import {
  RocketIcon,
  DesktopIcon,
  GridIcon,
  ArrowRightIcon,
  LightningBoltIcon,
  CodeIcon,
  LockClosedIcon,
} from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';

const features = [
  {
    id: 'workflow-studio',
    title: 'Workflow Studio',
    description:
      'Visually design, build, and automate complex processes. Our intuitive drag-and-drop interface allows you to connect various services and logic blocks to create powerful workflows tailored to your needs.',
    icon: <RocketIcon className="w-10 h-10" />, // Adjusted size for new layout
    link: '/ai-workflow-studio',
    accentColor: 'text-blue-400',
    bgColor: 'hover:bg-blue-500',
    borderColor: 'border-blue-500',
  },
  {
    id: 'ai-agent-management',
    title: 'AI Agent Management',
    description:
      'Create, configure, and deploy intelligent AI agents. Monitor their performance and manage their interactions within your ecosystem, all from a centralized dashboard.',
    icon: <DesktopIcon className="w-10 h-10" />,
    link: '/my-agents',
    accentColor: 'text-pink-400',
    bgColor: 'hover:bg-pink-500',
    borderColor: 'border-pink-500',
  },
  {
    id: 'digital-wallet',
    title: 'Digital Wallet',
    description:
      'Securely manage your digital assets and transactions. Our integrated wallet provides a seamless experience for handling various types of digital value within the platform.',
    icon: (
      <LockClosedIcon className="w-12 h-12 mb-4 text-teal-400 group-hover:scale-110 transition-transform" />
    ),
    link: '/wallet',
    accentColor: 'text-teal-400',
    bgColor: 'hover:bg-teal-500',
    borderColor: 'border-teal-500',
  },
  {
    id: 'project-templates',
    title: 'Project Templates',
    description:
      'Kickstart your projects with pre-built templates. Save time and effort by leveraging our library of common use-cases and configurations, designed for rapid deployment.',
    icon: <GridIcon className="w-10 h-10" />,
    link: '/templates',
    accentColor: 'text-purple-400',
    bgColor: 'hover:bg-purple-500',
    borderColor: 'border-purple-500',
  },
];

const NewLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-20 md:py-32">
        {/* Animated Background Placeholder */}
        <div className="absolute inset-0 z-0">
          {/* Placeholder for a subtle CSS-based animated background or a full-width video/GIF */}
          {/* Option 1: Simple Gradient (can be animated with custom CSS) */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/30 to-purple-900/40 animate-pulse"></div>
          {/* Option 2: Placeholder for Video/GIF - User should replace this div or its content */}
          {/* <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-gray-500 text-xl">
            [Placeholder for Animated Background / Video / GIF]
          </div> */}
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Visual Placeholder for abstract animated graphic or 3D element */}
            <div className="w-48 h-48 md:w-64 md:h-64 bg-slate-800/50 backdrop-blur-sm rounded-full mx-auto mb-10 flex items-center justify-center border-2 border-blue-500/50 shadow-2xl">
              <LightningBoltIcon className="w-24 h-24 md:w-32 md:h-32 text-blue-400 opacity-75" />
              {/* Comment: Placeholder for a more prominent, abstract animated graphic or 3D element */}
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-pink-500 to-purple-500">
              Forge the Future of Intelligence
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Experience a radically new platform to build, deploy, and manage intelligent workflows
              and AI agents with unparalleled power and intuitive design.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
              asChild
            >
              <Link to="/dashboard">
                Launch Your Vision <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-slate-900/70 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-100">Core Capabilities</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Discover the innovative features engineered to elevate your automation and AI
              strategies.
            </p>
          </div>

          <div className="space-y-20 md:space-y-32">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className={`group flex flex-col md:flex-row items-center gap-8 md:gap-12 ${
                  index % 2 !== 0 ? 'md:flex-row-reverse' : ''
                } transition-all duration-500 ease-in-out transform hover:scale-[1.02]`}
              >
                {/* Rich Media Placeholder */}
                <div className="w-full md:w-1/2 aspect-video bg-slate-800 rounded-xl shadow-2xl flex items-center justify-center text-gray-500 overflow-hidden border border-slate-700">
                  {/* Comment: Placeholder for 16:9 image, GIF, or short video related to {feature.title} */}
                  <div
                    className={`w-full h-full flex items-center justify-center ${feature.accentColor} bg-slate-800/50`}
                  >
                    <feature.icon.type
                      {...feature.icon.props}
                      className={`w-24 h-24 opacity-30 group-hover:opacity-60 transition-opacity duration-300 transform group-hover:scale-110`}
                    />
                  </div>
                </div>

                {/* Text Content */}
                <div className="w-full md:w-1/2 md:px-6">
                  <div
                    className={`inline-flex items-center justify-center p-3 rounded-full bg-slate-800 mb-4 border border-slate-700 group-hover:border-${feature.accentColor.split('-')[1]}-500/50 transition-colors duration-300`}
                  >
                    {React.cloneElement(feature.icon, {
                      className: `w-8 h-8 ${feature.accentColor} group-hover:scale-110 transition-transform duration-300`,
                    })}
                  </div>
                  <h3
                    className={`text-3xl md:text-4xl font-bold mb-5 ${feature.accentColor} tracking-tight`}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed">
                    {feature.description}
                  </p>
                  <Button
                    variant="outline"
                    className={`w-full sm:w-auto px-8 py-3 font-semibold rounded-md ${feature.borderColor} ${feature.accentColor} ${feature.bgColor} hover:text-slate-900 transition-all duration-300 ease-in-out transform hover:scale-105 group-hover:shadow-lg`}
                    asChild
                  >
                    <Link to={feature.link}>
                      Explore {feature.title.split(' ')[0]}{' '}
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section (Conceptual) */}
      <section className="py-16 md:py-24 bg-slate-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-100">How It Works</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              A simplified flow to understand our platform's power.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
            {[
              {
                num: '1',
                title: 'Design & Connect',
                desc: 'Visually map your processes using our intuitive studio and connect your data sources.',
                icon: <CodeIcon className="w-12 h-12 text-blue-400" />,
              },
              {
                num: '2',
                title: 'Deploy Agents',
                desc: 'Configure and launch intelligent AI agents to execute tasks and learn.',
                icon: <LightningBoltIcon className="w-12 h-12 text-pink-400" />,
              },
              {
                num: '3',
                title: 'Monitor & Optimize',
                desc: 'Track performance, gain insights, and continuously refine your automated systems.',
                icon: <LockClosedIcon className="w-12 h-12 text-teal-400" />,
              },
            ].map(step => (
              <div
                key={step.num}
                className="bg-slate-800 p-8 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2"
              >
                <div className="w-20 h-20 bg-slate-700 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-gray-300 border-2 border-slate-600">
                  {/* Placeholder for step graphic or icon */}
                  {step.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-100 mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
                {/* Comment: Placeholder for more detailed graphic for step {step.num} */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Showcase Section (Conceptual) */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-100">Under The Hood</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Built on a foundation of cutting-edge, scalable technologies.
            </p>
          </div>
          <div className="w-full h-80 md:h-[500px] bg-gradient-to-tr from-blue-900/50 via-purple-900/50 to-pink-900/50 rounded-xl shadow-2xl flex items-center justify-center text-gray-500 p-8 border border-slate-700">
            {/* Comment: Placeholder for a visually impressive graphic or animation representing the underlying technology */}
            <div className="text-center">
              <CodeIcon className="w-24 h-24 text-slate-600 mx-auto mb-4" />
              <p className="text-2xl font-semibold">Advanced Technology Stack Placeholder</p>
              <p className="text-slate-400">
                Illustrate core technologies, architecture, or data flow here.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewLandingPage;
