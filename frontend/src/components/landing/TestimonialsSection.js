import { useEffect, useRef, useState } from "react";
import { Star, Quote } from "lucide-react";

export const TestimonialsSection = ({ testimonials }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 bg-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-tyrell-gold/15 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-[1px] w-10 bg-tyrell-gold/40" />
            <span className="text-tyrell-gold text-xs tracking-[0.3em] uppercase font-light">Testimonios</span>
            <div className="h-[1px] w-10 bg-tyrell-gold/40" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-tyrell-dark font-light tracking-tight">
            Lo que dicen nuestros<span className="text-tyrell-gold"> clientes</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id || index}
              className={`relative bg-tyrell-cream/30 border border-tyrell-gold/10 p-8 lg:p-10 transition-all duration-700 hover:border-tyrell-gold/25 hover:shadow-[0_10px_40px_rgba(201,169,110,0.08)] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${300 + index * 200}ms` }}
            >
              <Quote className="w-8 h-8 text-tyrell-gold/20 mb-4" />
              <div className="flex gap-1 mb-5">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-tyrell-gold fill-tyrell-gold" />
                ))}
              </div>
              <p className="text-tyrell-dark/60 text-sm leading-relaxed font-light italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="mt-6 pt-6 border-t border-tyrell-gold/10">
                <span className="font-display text-base text-tyrell-dark font-medium tracking-wide">{testimonial.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
