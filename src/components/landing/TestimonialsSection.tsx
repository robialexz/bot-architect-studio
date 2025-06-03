import React from 'react';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: 'This service is absolutely fantastic! Highly recommended.',
      author: 'Jane Doe, CEO of ExampleCorp',
    },
    {
      quote: "A game changer for our workflow. We've seen incredible results.",
      author: 'John Smith, Project Manager',
    },
    {
      quote: 'Top-notch support and an intuitive platform. Five stars!',
      author: 'Alice Brown, Freelancer',
    },
  ];

  return (
    <section
      id="testimonials"
      className="py-16 sm:py-20 md:py-24 px-6 text-center bg-background relative"
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 sm:mb-16 text-foreground">
          What Our Clients Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card/50 backdrop-blur-md p-6 sm:p-8 rounded-xl border border-border/50 hover:border-primary/60 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 flex flex-col justify-between"
            >
              <p className="italic text-base sm:text-lg text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <p className="font-semibold text-sm sm:text-base text-foreground">
                - {testimonial.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
