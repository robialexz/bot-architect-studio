import React, { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border/50">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 sm:py-5 px-1 sm:px-2 text-left text-base sm:text-lg font-medium text-foreground hover:text-primary focus:outline-none transition-colors duration-200 ease-in-out flex justify-between items-center group"
      >
        <span>{question}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-hover:text-primary transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {isOpen && (
        <div className="pt-1 pb-4 sm:pb-5 px-1 sm:px-2 text-sm sm:text-base text-muted-foreground bg-card/30 rounded-b-md">
          {answer}
        </div>
      )}
    </div>
  );
};

const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: 'When will the FlowsyAI token be launched?',
      answer:
        'The FlowsyAI token is scheduled to launch in June 2025. Early waitlist members will receive priority access and exclusive pricing during the initial token sale.',
    },
    {
      question: 'When will the FlowsyAI platform be available?',
      answer:
        'We are targeting Q3 2025 for the public launch. Beta testing will begin in July 2025 with selected early access users from our waitlist.',
    },
    {
      question: 'What are the benefits of holding FlowsyAI tokens?',
      answer:
        'FlowsyAI token holders enjoy 30% discounts on platform subscriptions, priority access to new features, exclusive community events, and potential value appreciation through our token burn mechanism.',
    },
    {
      question: 'How does the token burn mechanism work?',
      answer:
        'After the official platform launch, 20% of all FlowsyAI tokens will be permanently burned, reducing the total supply and creating deflationary pressure that can increase token value for holders.',
    },
    {
      question: 'How secure is the investment?',
      answer:
        'Our developer wallet is locked for 3 months to ensure project commitment. The token smart contract will be audited by leading security firms before launch, and we maintain full transparency in our development roadmap.',
    },
    {
      question: 'What does early access include?',
      answer:
        'Early access members get first priority for beta testing, exclusive FlowsyAI token allocations, direct communication with our development team, and special pricing on premium features.',
    },
  ];

  return (
    <section
      id="faq"
      className="py-16 sm:py-20 md:py-24 px-6 bg-background/80 backdrop-blur-sm relative"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 sm:mb-12 text-center text-foreground">
          Frequently Asked Questions
        </h2>
        <div className="space-y-1">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
