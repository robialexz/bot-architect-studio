
import { Link } from 'react-router-dom';
import { Github, Twitter, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <li className="hover:-translate-y-0.5 hover:text-primary transition-all duration-200">
    <Link to={to} className="text-foreground/80 hover:text-primary transition-colors duration-200">
      {children}
    </Link>
  </li>
);

const SocialIconLink = ({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="w-12 h-12 flex items-center justify-center rounded-xl bg-card/90 border border-border/50 hover:border-primary/40 text-foreground hover:text-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-105 hover:-translate-y-0.5 backdrop-blur-sm"
  >
    <Icon className="w-5 h-5" />
  </a>
);

const FooterNoMotion = () => {
  const { isAuthenticated } = useAuth();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { to: '/platform-showcase', label: 'Platform' },
        { to: '/features', label: 'Features' },
        { to: '/pricing', label: 'Pricing' },
        { to: '/roadmap', label: 'Roadmap' },
        { to: '/documentation', label: 'Documentation' },
      ],
    },
    {
      title: 'Company',
      links: [
        { to: '/about', label: 'About' },
        { to: '/contact', label: 'Contact' },
        { to: '/waitlist', label: 'Join Waitlist' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { to: '/privacy', label: 'Privacy Policy' },
        { to: '/terms', label: 'Terms of Service' },
      ],
    },
  ];

  // Add authenticated sections if user is logged in
  if (isAuthenticated) {
    footerSections.unshift({
      title: 'Dashboard',
      links: [
        { to: '/account', label: 'Account' },
        { to: '/projects', label: 'My Projects' },
        { to: '/workflow-builder', label: 'Workflow Builder' },
        { to: '/settings', label: 'Settings' },
      ],
    });
  }

  return (
    <footer className="border-t border-border bg-background/95 backdrop-blur-lg shadow-lg">
      <div className="container mx-auto px-4 max-w-screen-xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="flex flex-col items-start md:col-span-2 lg:col-span-1 animate-fade-in">
            <p className="text-foreground/70 max-w-xs leading-relaxed">
              Seamlessly integrate advanced AI to automate and innovate.
            </p>
          </div>

          {footerSections.map((section, index) => (
            <div
              key={section.title}
              className="space-y-4 animate-slide-up"
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
            >
              <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map(link => (
                  <FooterLink key={link.to} to={link.to}>
                    {link.label}
                  </FooterLink>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-foreground/60 text-sm">
            © 2024 FlowsyAI. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <SocialIconLink
              href="https://github.com/flowsyai"
              icon={Github}
              label="Follow us on GitHub"
            />
            <SocialIconLink
              href="https://x.com/flowsyai"
              icon={Twitter}
              label="Follow us on X (Twitter)"
            />
            <SocialIconLink
              href="https://t.me/flowsyai"
              icon={MessageCircle}
              label="Join our Telegram community"
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out 0.3s both;
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out both;
        }
      `}</style>
    </footer>
  );
};

export default FooterNoMotion;
