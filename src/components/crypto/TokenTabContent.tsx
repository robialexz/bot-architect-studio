import React from 'react';
import {
  MotionDiv,
  MotionSection,
  MotionH1,
  MotionH2,
  MotionP,
  MotionButton,
  MotionLi,
  MotionTr,
} from '@/lib/motion-wrapper';

import {
  Users,
  Lock,
  Shield,
  Star,
  Coins,
  PieChart,
  CheckCircle,
  AlertTriangle,
  Globe,
  Activity,
  Crown,
  ExternalLink,
  Copy,
  Eye,
  Award,
  Timer,
  Target,
  Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TokenDistribution {
  category: string;
  percentage: number;
  amount: string;
  color: string;
  description: string;
  locked: boolean;
  unlockDate?: string;
  highlight?: boolean;
  burnScheduled?: boolean;
}

interface TopHolder {
  rank: number;
  address: string;
  percentage: number;
  amount: string;
  type: 'team' | 'investor' | 'public' | 'treasury' | 'liquidity';
  locked: boolean;
  burnScheduled?: boolean;
}

interface TokenTabContentProps {
  selectedTab: string;
  tokenDistribution: TokenDistribution[];
  topHolders: TopHolder[];
  hoveredSection: string | null;
  setHoveredSection: (section: string | null) => void;
  getHolderTypeIcon: (type: TopHolder['type']) => React.ReactNode;
  getHolderTypeBadge: (type: TopHolder['type']) => string;
}

export const TokenTabContent: React.FC<TokenTabContentProps> = ({
  selectedTab,
  tokenDistribution,
  topHolders,
  hoveredSection,
  setHoveredSection,
  getHolderTypeIcon,
  getHolderTypeBadge,
}) => {
  if (selectedTab === 'distribution') {
    return (
      <MotionDiv
        key="distribution"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-12"
      >
        {/* Revolutionary Header */}
        <MotionDiv
          className="text-center mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <MotionDiv
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 via-orange-500/20 to-blue-500/20 rounded-full px-8 py-4 mb-6 border border-emerald-500/30"
            animate={{
              boxShadow: [
                '0 0 20px rgba(16, 185, 129, 0.3)',
                '0 0 40px rgba(249, 115, 22, 0.3)',
                '0 0 20px rgba(59, 130, 246, 0.3)',
                '0 0 20px rgba(16, 185, 129, 0.3)',
              ],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <MotionDiv
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <PieChart className="w-6 h-6 text-emerald-500" />
            </MotionDiv>
            <span className="text-lg font-bold text-foreground">REVOLUTIONARY TOKENOMICS</span>
            <MotionDiv
              className="w-3 h-3 bg-emerald-500 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </MotionDiv>

          <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-500 via-orange-500 to-blue-500 bg-clip-text text-transparent">
            Token Distribution
          </h3>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The most <span className="text-emerald-500 font-semibold">community-focused</span>{' '}
            tokenomics in DeFi with
            <span className="text-orange-500 font-semibold"> strategic burns</span> and
            <span className="text-blue-500 font-semibold"> ultra-locked</span> developer funds
          </p>
        </MotionDiv>

        {/* Interactive Bar Chart Visualization */}
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Public Sale Bar */}
              <MotionDiv
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredSection('public')}
                onMouseLeave={() => setHoveredSection(null)}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl p-6 h-80 flex flex-col justify-between relative overflow-hidden">
                  {/* Background Animation */}
                  <MotionDiv
                    className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10"
                    animate={{
                      opacity: [0.5, 0.8, 0.5],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-emerald-500" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-emerald-500">Public Sale</h4>
                        <p className="text-sm text-muted-foreground">Community Ownership</p>
                      </div>
                    </div>

                    <MotionDiv
                      className="text-4xl font-black text-emerald-500 mb-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: 'spring' }}
                    >
                      80%
                    </MotionDiv>
                    <div className="text-xl font-semibold text-foreground mb-4">80M FLOWSY</div>
                  </div>

                  {/* Animated Bar */}
                  <div className="relative z-10">
                    <div className="h-4 bg-emerald-500/20 rounded-full overflow-hidden">
                      <MotionDiv
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '80%' }}
                        transition={{ delay: 1, duration: 2, ease: 'easeOut' }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Maximum community control
                    </div>
                  </div>
                </div>
              </MotionDiv>

              {/* Developer Fund Bar */}
              <MotionDiv
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredSection('dev')}
                onMouseLeave={() => setHoveredSection(null)}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-2xl p-6 h-80 flex flex-col justify-between relative overflow-hidden">
                  {/* Background Animation */}
                  <MotionDiv
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10"
                    animate={{
                      opacity: [0.5, 0.8, 0.5],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <Shield className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-blue-500">Developer Fund</h4>
                        <p className="text-sm text-muted-foreground">Ultra-Locked</p>
                      </div>
                    </div>

                    <MotionDiv
                      className="text-4xl font-black text-blue-500 mb-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7, type: 'spring' }}
                    >
                      10%
                    </MotionDiv>
                    <div className="text-xl font-semibold text-foreground mb-4">10M FLOWSY</div>
                  </div>

                  {/* Animated Bar */}
                  <div className="relative z-10">
                    <div className="h-4 bg-blue-500/20 rounded-full overflow-hidden">
                      <MotionDiv
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '10%' }}
                        transition={{ delay: 1.2, duration: 2, ease: 'easeOut' }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Locked until milestones
                    </div>
                  </div>
                </div>
              </MotionDiv>

              {/* Burn Reserve Bar */}
              <MotionDiv
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredSection('burn')}
                onMouseLeave={() => setHoveredSection(null)}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-6 h-80 flex flex-col justify-between relative overflow-hidden">
                  {/* Background Animation */}
                  <MotionDiv
                    className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10"
                    animate={{
                      opacity: [0.5, 0.8, 0.5],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                        <Flame className="w-6 h-6 text-orange-500" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-orange-500">Burn Reserve</h4>
                        <p className="text-sm text-muted-foreground">Strategic Burns</p>
                      </div>
                    </div>

                    <MotionDiv
                      className="text-4xl font-black text-orange-500 mb-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.9, type: 'spring' }}
                    >
                      10%
                    </MotionDiv>
                    <div className="text-xl font-semibold text-foreground mb-4">10M FLOWSY</div>
                  </div>

                  {/* Animated Bar */}
                  <div className="relative z-10">
                    <div className="h-4 bg-orange-500/20 rounded-full overflow-hidden">
                      <MotionDiv
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '10%' }}
                        transition={{ delay: 1.4, duration: 2, ease: 'easeOut' }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Value enhancement burns
                    </div>
                  </div>
                </div>
              </MotionDiv>
            </div>
          </div>
        </MotionDiv>

        {/* Interactive 3D Distribution Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {tokenDistribution.map((item, index) => (
            <MotionDiv
              key={item.category}
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8, type: 'spring' }}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                z: 50,
                transition: { duration: 0.3 },
              }}
              onMouseEnter={() => setHoveredSection(item.category)}
              onMouseLeave={() => setHoveredSection(null)}
              className="relative group cursor-pointer"
              style={{ perspective: '1000px' }}
            >
              <Card
                className={`premium-card relative overflow-hidden rounded-3xl border-2 transition-all duration-500 ${
                  item.highlight
                    ? `bg-gradient-to-br ${item.color}/20 border-current shadow-2xl`
                    : 'bg-gradient-to-br from-muted/20 to-muted/10 border-border/30'
                }`}
              >
                {/* Animated Background Effects */}
                <div className="absolute inset-0 opacity-30">
                  <MotionDiv
                    className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${item.color}`}
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </div>

                {/* Floating Particles */}
                {[...Array(6)].map((_, i) => (
                  <MotionDiv
                    key={i}
                    className="absolute w-2 h-2 bg-white/30 rounded-full"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${10 + i * 10}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.3, 1, 0.3],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 2 + i * 0.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}

                <CardContent className="relative z-10 p-8">
                  {/* Category Header */}
                  <div className="text-center mb-6">
                    <MotionDiv
                      className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      {item.category === 'Public Sale' && <Users className="w-8 h-8 text-white" />}
                      {item.category === 'Burn Reserve' && <Flame className="w-8 h-8 text-white" />}
                      {item.category === 'Developer Fund' && (
                        <Shield className="w-8 h-8 text-white" />
                      )}
                    </MotionDiv>

                    <h4 className="text-xl font-bold text-white mb-2">{item.category}</h4>

                    {/* Animated Percentage */}
                    <MotionDiv
                      className="text-4xl font-black text-white mb-2"
                      key={`${item.category}-${hoveredSection}`}
                      initial={{ scale: 1.2, opacity: 0.8 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {item.percentage}%
                    </MotionDiv>

                    <div className="text-lg font-semibold text-white/90">{item.amount}</div>
                  </div>

                  {/* Description */}
                  <div className="text-center mb-6">
                    <p className="text-sm text-white/80 leading-relaxed">{item.description}</p>
                  </div>

                  {/* Special Features */}
                  {item.burnScheduled && (
                    <MotionDiv
                      className="bg-orange-500/20 border border-orange-500/30 rounded-xl p-3 mb-4"
                      animate={{
                        boxShadow: [
                          '0 0 0 rgba(249, 115, 22, 0.5)',
                          '0 0 20px rgba(249, 115, 22, 0.5)',
                          '0 0 0 rgba(249, 115, 22, 0.5)',
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="flex items-center gap-2 text-orange-300">
                        <MotionDiv
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Flame className="w-4 h-4" />
                        </MotionDiv>
                        <span className="text-sm font-semibold">BURN SCHEDULED</span>
                      </div>
                    </MotionDiv>
                  )}

                  {item.locked && (
                    <MotionDiv
                      className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3 mb-4"
                      animate={{
                        borderColor: [
                          'rgba(59, 130, 246, 0.3)',
                          'rgba(59, 130, 246, 0.6)',
                          'rgba(59, 130, 246, 0.3)',
                        ],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <div className="flex items-center gap-2 text-blue-300">
                        <MotionDiv
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Lock className="w-4 h-4" />
                        </MotionDiv>
                        <span className="text-sm font-semibold">ULTRA-LOCKED</span>
                      </div>
                    </MotionDiv>
                  )}

                  {/* Unlock Date */}
                  {item.unlockDate && (
                    <div className="text-center">
                      <div className="text-xs text-white/70 bg-white/10 rounded-full px-3 py-1 inline-block">
                        {item.unlockDate}
                      </div>
                    </div>
                  )}

                  {/* Interactive Progress Bar */}
                  <MotionDiv
                    className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: index * 0.3 + 0.5, duration: 1 }}
                  >
                    <MotionDiv
                      className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ delay: index * 0.3 + 1, duration: 1.5, ease: 'easeOut' }}
                    />
                  </MotionDiv>
                </CardContent>

                {/* Hover Glow Effect */}
                <MotionDiv
                  className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${item.color}`}
                  style={{
                    filter: 'blur(20px)',
                    transform: 'scale(1.1)',
                    zIndex: -1,
                  }}
                />
              </Card>
            </MotionDiv>
          ))}
        </div>

        {/* Strategic Milestones Section */}
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-500 via-blue-500 to-emerald-500 bg-clip-text text-transparent">
              Strategic Milestones
            </h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Transparent roadmap for burns and developer fund unlocks based on market cap
              achievements
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Burn Schedule */}
            <MotionDiv
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-3xl p-8 relative overflow-hidden"
            >
              {/* Background Effects */}
              <MotionDiv
                className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <MotionDiv
                    className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  >
                    <Flame className="w-8 h-8 text-white" />
                  </MotionDiv>
                  <div>
                    <h4 className="text-2xl font-bold text-orange-500">Strategic Burns</h4>
                    <p className="text-muted-foreground">Deflationary milestones</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* First Burn */}
                  <MotionDiv
                    className="bg-orange-500/20 border border-orange-500/30 rounded-2xl p-6"
                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(249, 115, 22, 0.3)' }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-2xl font-bold text-orange-500">$5M Market Cap</div>
                      <div className="bg-orange-500/20 px-3 py-1 rounded-full">
                        <span className="text-sm font-semibold text-orange-500">MILESTONE 1</span>
                      </div>
                    </div>
                    <div className="text-xl font-semibold text-foreground mb-2">
                      5% Burn (5M FLOWSY)
                    </div>
                    <p className="text-sm text-muted-foreground">
                      First strategic burn to reduce total supply and increase scarcity
                    </p>
                    <div className="mt-4 h-2 bg-orange-500/20 rounded-full overflow-hidden">
                      <MotionDiv
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '50%' }}
                        transition={{ delay: 1.5, duration: 2 }}
                      />
                    </div>
                  </MotionDiv>

                  {/* Second Burn */}
                  <MotionDiv
                    className="bg-red-500/20 border border-red-500/30 rounded-2xl p-6"
                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)' }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-2xl font-bold text-red-500">$10M Market Cap</div>
                      <div className="bg-red-500/20 px-3 py-1 rounded-full">
                        <span className="text-sm font-semibold text-red-500">MILESTONE 2</span>
                      </div>
                    </div>
                    <div className="text-xl font-semibold text-foreground mb-2">
                      5% Burn (5M FLOWSY)
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Second burn completing the deflationary mechanism
                    </p>
                    <div className="mt-4 h-2 bg-red-500/20 rounded-full overflow-hidden">
                      <MotionDiv
                        className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '50%' }}
                        transition={{ delay: 1.7, duration: 2 }}
                      />
                    </div>
                  </MotionDiv>
                </div>
              </div>
            </MotionDiv>

            {/* Developer Fund Schedule */}
            <MotionDiv
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-3xl p-8 relative overflow-hidden"
            >
              {/* Background Effects */}
              <MotionDiv
                className="absolute top-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <MotionDiv
                    className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Shield className="w-8 h-8 text-white" />
                  </MotionDiv>
                  <div>
                    <h4 className="text-2xl font-bold text-blue-500">Developer Fund</h4>
                    <p className="text-muted-foreground">Gradual unlock schedule</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* First Unlock */}
                  <MotionDiv
                    className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-6"
                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)' }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-2xl font-bold text-blue-500">$15M Market Cap</div>
                      <div className="bg-blue-500/20 px-3 py-1 rounded-full">
                        <span className="text-sm font-semibold text-blue-500">UNLOCK 1</span>
                      </div>
                    </div>
                    <div className="text-xl font-semibold text-foreground mb-2">
                      5% Unlock (5M FLOWSY)
                    </div>
                    <p className="text-sm text-muted-foreground">
                      First partial unlock for continued development and operations
                    </p>
                    <div className="mt-4 h-2 bg-blue-500/20 rounded-full overflow-hidden">
                      <MotionDiv
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '50%' }}
                        transition={{ delay: 1.9, duration: 2 }}
                      />
                    </div>
                  </MotionDiv>

                  {/* Second Unlock */}
                  <MotionDiv
                    className="bg-indigo-500/20 border border-indigo-500/30 rounded-2xl p-6"
                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(99, 102, 241, 0.3)' }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-2xl font-bold text-indigo-500">$25M Market Cap</div>
                      <div className="bg-indigo-500/20 px-3 py-1 rounded-full">
                        <span className="text-sm font-semibold text-indigo-500">UNLOCK 2</span>
                      </div>
                    </div>
                    <div className="text-xl font-semibold text-foreground mb-2">
                      5% Unlock (5M FLOWSY)
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Final unlock completing the developer fund release schedule
                    </p>
                    <div className="mt-4 h-2 bg-indigo-500/20 rounded-full overflow-hidden">
                      <MotionDiv
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '50%' }}
                        transition={{ delay: 2.1, duration: 2 }}
                      />
                    </div>
                  </MotionDiv>
                </div>
              </div>
            </MotionDiv>
          </div>

          {/* Summary Stats */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="mt-12 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-orange-500/10 border border-emerald-500/30 rounded-3xl p-8"
          >
            <div className="text-center mb-6">
              <h4 className="text-2xl font-bold text-foreground mb-2">Milestone Summary</h4>
              <p className="text-muted-foreground">Complete transparency in tokenomics execution</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-2">$5M</div>
                <div className="text-sm text-muted-foreground">First Burn</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500 mb-2">$10M</div>
                <div className="text-sm text-muted-foreground">Second Burn</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">$15M</div>
                <div className="text-sm text-muted-foreground">First Unlock</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-500 mb-2">$25M</div>
                <div className="text-sm text-muted-foreground">Final Unlock</div>
              </div>
            </div>
          </MotionDiv>
        </MotionDiv>

        {/* Trust Indicators */}
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: Users,
              title: 'Community First',
              description: '80% public ownership - highest in DeFi',
              color: 'text-emerald-500',
              bgColor: 'bg-emerald-500/10',
            },
            {
              icon: Flame,
              title: 'Strategic Burns',
              description: '10% burn reserve for value enhancement',
              color: 'text-orange-500',
              bgColor: 'bg-orange-500/10',
            },
            {
              icon: Shield,
              title: 'Anti-Rug Guarantee',
              description: 'Only 10% dev fund locked until $1B',
              color: 'text-blue-500',
              bgColor: 'bg-blue-500/10',
            },
          ].map((feature, index) => (
            <MotionDiv
              key={feature.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`p-6 ${feature.bgColor} rounded-2xl border border-current/20 text-center group cursor-pointer`}
            >
              <MotionDiv
                className={`w-12 h-12 mx-auto mb-4 ${feature.bgColor} rounded-xl flex items-center justify-center`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </MotionDiv>
              <h5 className={`font-bold mb-2 ${feature.color}`}>{feature.title}</h5>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </MotionDiv>
          ))}
        </MotionDiv>
      </MotionDiv>
    );
  }

  if (selectedTab === 'holders') {
    return (
      <MotionDiv
        key="holders"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-8"
      >
        <Card className="premium-card bg-card/50 backdrop-blur-lg border border-border/30 rounded-2xl p-6">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Users className="w-6 h-6 text-primary" />
              Top Token Holders
            </CardTitle>
            <p className="text-muted-foreground">
              Transparent view of largest token holders and their lock status
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topHolders.map((holder, index) => (
                <MotionDiv
                  key={holder.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-muted/20 rounded-xl hover:bg-muted/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {holder.rank}
                    </div>
                    {getHolderTypeIcon(holder.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-sm font-mono bg-muted/30 px-2 py-1 rounded">
                        {holder.address}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getHolderTypeBadge(holder.type)}>
                        {holder.type}
                      </Badge>
                      {holder.locked && (
                        <Badge
                          variant="outline"
                          className="bg-orange-500/10 text-orange-500 border-orange-500/30"
                        >
                          <Lock className="w-3 h-3 mr-1" />
                          Locked
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">{holder.percentage}%</div>
                    <div className="text-sm text-muted-foreground">{holder.amount}</div>
                  </div>
                </MotionDiv>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-blue-500">Transparency Note</span>
              </div>
              <p className="text-sm text-muted-foreground">
                All wallet addresses are publicly verifiable on the Solana blockchain. Locked tokens
                are secured by smart contracts and cannot be moved until unlock conditions are met.
              </p>
            </div>
          </CardContent>
        </Card>
      </MotionDiv>
    );
  }

  if (selectedTab === 'security') {
    return (
      <MotionDiv
        key="security"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Security Features */}
        <Card className="premium-card bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/30 rounded-2xl p-6">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3">
              <Shield className="w-6 h-6 text-emerald-500" />
              Security Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-emerald-500/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
              <div>
                <div className="font-semibold text-emerald-500">Smart Contract Audited</div>
                <div className="text-sm text-muted-foreground">
                  Independently verified by blockchain security experts
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-emerald-500/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
              <div>
                <div className="font-semibold text-emerald-500">Multi-Signature Wallet</div>
                <div className="text-sm text-muted-foreground">
                  Requires multiple signatures for critical operations
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-emerald-500/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
              <div>
                <div className="font-semibold text-emerald-500">Time-Locked Contracts</div>
                <div className="text-sm text-muted-foreground">
                  Developer funds locked until $1B market cap milestone
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-emerald-500/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
              <div>
                <div className="font-semibold text-emerald-500">Immutable Code</div>
                <div className="text-sm text-muted-foreground">
                  Core tokenomics cannot be changed after deployment
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <Card className="premium-card bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30 rounded-2xl p-6">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3">
              <Award className="w-6 h-6 text-blue-500" />
              Trust Indicators
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-blue-500">Contract Verification</span>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Smart contract source code is publicly available and verified on Solscan
              </p>
              <Button variant="outline" size="sm" className="mt-2 gap-2">
                <ExternalLink className="w-3 h-3" />
                View on Solscan
              </Button>
            </div>

            <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-purple-500">Liquidity Lock</span>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
                  <Timer className="w-3 h-3 mr-1" />2 Years
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Initial liquidity is locked for 2 years to ensure market stability
              </p>
            </div>

            <div className="p-4 bg-gold/10 rounded-xl border border-gold/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gold">Team Commitment</span>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
                  <Target className="w-3 h-3 mr-1" />
                  Long-term
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Team tokens vest over 2 years with 6-month cliff period
              </p>
            </div>
          </CardContent>
        </Card>
      </MotionDiv>
    );
  }

  return null;
};
