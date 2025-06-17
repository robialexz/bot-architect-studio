import React from 'react';
import { Link } from 'react-router-dom';

const PricingSection: React.FC = () => {
  const plans = [
    {
      name: 'Basic',
      price: '$10/mo',
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
      cta: 'Choose Basic',
    },
    {
      name: 'Pro',
      price: '$30/mo',
      features: ['Feature 1', 'Feature 2', 'Feature 3', 'Pro Feature 4'],
      cta: 'Choose Pro',
    },
    {
      name: 'Enterprise',
      price: 'Contact Us',
      features: ['All Pro Features', 'Dedicated Support', 'Custom Integrations'],
      cta: 'Contact Sales',
    },
  ];

  return (
    <section
      id="pricing"
      className="py-16 sm:py-20 md:py-24 px-6 text-center bg-background/80 backdrop-blur-sm relative"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 sm:mb-16 text-foreground">
          Our Pricing Plans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 items-stretch">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`flex flex-col bg-card/60 backdrop-blur-md p-6 sm:p-8 rounded-xl border transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl ${
                plan.name === 'Pro'
                  ? 'border-primary/80 shadow-primary/20 hover:shadow-primary/30'
                  : 'border-border/50 hover:border-primary/70 shadow-lg shadow-background/20 hover:shadow-primary/10'
              }`}
            >
              <h3 className="text-2xl sm:text-3xl font-semibold mb-4 text-foreground">
                {plan.name}
              </h3>
              <p
                className={`text-3xl sm:text-4xl font-bold mb-6 ${plan.name === 'Pro' ? 'text-primary' : 'text-accent'}`}
              >
                {plan.price}
              </p>
              <ul className="space-y-3 text-left mb-8 text-muted-foreground flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className={`w-5 h-5 mr-2 ${plan.name === 'Pro' ? 'text-primary' : 'text-accent'}`}
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to={plan.name === 'Enterprise' ? '/contact' : '/auth'}
                className={`w-full py-3 px-6 font-semibold rounded-lg transition-all duration-300 ease-in-out text-base transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background block text-center ${
                  plan.name === 'Pro'
                    ? 'bg-primary text-primary-foreground hover:bg-primary/80 focus:ring-primary'
                    : 'bg-accent text-accent-foreground hover:bg-accent/80 focus:ring-accent'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
