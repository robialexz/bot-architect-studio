import React from 'react';

const AuthSection: React.FC = () => {
  return (
    <section
      id="auth"
      className="py-12 sm:py-16 px-6 text-center bg-background/70 backdrop-blur-sm relative"
    >
      {' '}
      {/* Added subtle background to differentiate if needed over complex bg animation */}
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-foreground">Join Us or Sign In</h2>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          <button className="w-full sm:w-auto py-3 px-8 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all duration-300 ease-in-out text-base transform hover:scale-105">
            Sign Up
          </button>
          <button className="w-full sm:w-auto py-3 px-8 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background transition-all duration-300 ease-in-out text-base transform hover:scale-105">
            Log In
          </button>
        </div>
      </div>
    </section>
  );
};

export default AuthSection;
