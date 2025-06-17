import React from 'react';
import {
  Play,
  ArrowRight,
  Sparkles,
  Zap,
  Brain,
  Target,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

const DemoVideoSection: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full px-6 py-3 mb-8">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 font-medium">FlowsyAI in Action</span>
          </div>

          <h2 className="text-6xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              See AI
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              In Action
            </span>
          </h2>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Watch how FlowsyAI transforms complex business processes into intelligent, 
            automated workflows that adapt and evolve with your needs.
          </p>
        </div>

        {/* Platform Showcase */}
        <div className="relative max-w-6xl mx-auto mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Platform Interface Preview */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
                <div className="space-y-6">
                  {/* Mock Interface Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-gray-400 text-sm">FlowsyAI Dashboard</div>
                  </div>

                  {/* Mock Workflow Nodes */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">AI Data Processor</div>
                        <div className="text-gray-400 text-sm">Processing 2.4K items/sec</div>
                      </div>
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">Smart Automation</div>
                        <div className="text-gray-400 text-sm">99.9% accuracy rate</div>
                      </div>
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                      <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">Output Optimizer</div>
                        <div className="text-gray-400 text-sm">Real-time optimization</div>
                      </div>
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Key Benefits */}
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  Powerful AI Automation Platform
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Experience the future of workflow automation with our intelligent platform
                  that adapts, learns, and evolves with your business needs.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium mb-1">Intelligent Decision Making</div>
                    <div className="text-gray-400 text-sm">AI-powered logic that adapts to complex business scenarios</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium mb-1">Real-Time Processing</div>
                    <div className="text-gray-400 text-sm">Lightning-fast execution with live monitoring and optimization</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium mb-1">Enterprise Security</div>
                    <div className="text-gray-400 text-sm">Bank-level encryption with SOC2 compliance and audit trails</div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button className="group flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:scale-105">
                  <span>Explore Platform</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="text-center mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                50M+
              </div>
              <div className="text-gray-400 text-sm font-medium">Tasks Automated</div>
            </div>

            <div className="space-y-2">
              <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                99.9%
              </div>
              <div className="text-gray-400 text-sm font-medium">Uptime Guarantee</div>
            </div>

            <div className="space-y-2">
              <div className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                2.4K
              </div>
              <div className="text-gray-400 text-sm font-medium">Items/Second</div>
            </div>

            <div className="space-y-2">
              <div className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                24/7
              </div>
              <div className="text-gray-400 text-sm font-medium">AI Monitoring</div>
            </div>
          </div>
        </div>

        {/* Simple CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Experience FlowsyAI?
          </h3>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Join the future of AI automation and transform your business processes today.
          </p>

          <button className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative px-8 py-4 bg-black rounded-xl leading-none flex items-center">
              <span className="text-white font-bold text-lg mr-3">Get Started</span>
              <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default DemoVideoSection;
