import React from 'react';

const AboutUsSection: React.FC = () => {
  return (
    <section
      id="about"
      className="py-16 sm:py-20 md:py-24 px-6 text-center bg-background/80 backdrop-blur-sm relative"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 text-foreground">
          About Our Company
        </h2>
        <div className="space-y-6 text-left">
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum. Our mission is to deliver excellence and
            innovation.
          </p>
          {/* Optionally, add team member details or company values here */}
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
