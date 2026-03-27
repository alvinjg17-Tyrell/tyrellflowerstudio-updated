import { ArrowRight } from "lucide-react";

export const DynamicSection = ({ section }) => {
  if (!section || !section.active) return null;

  const {
    title,
    subtitle,
    type,
    content,
    image,
    images,
    buttonText,
    buttonLink,
    backgroundColor,
    textColor,
  } = section;

  // Banner type - full width with image background or solid color
  if (type === "banner") {
    return (
      <section 
        className="relative py-16 lg:py-24 overflow-hidden"
        style={{ backgroundColor: backgroundColor || "#F5F1EB" }}
      >
        {image && (
          <div className="absolute inset-0">
            <img src={image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-light mb-4"
            style={{ color: image ? "#FFFFFF" : (textColor || "#1a1a1a") }}
          >
            {title}
          </h2>
          {subtitle && (
            <p 
              className="text-lg mb-4 opacity-80"
              style={{ color: image ? "#FFFFFF" : (textColor || "#1a1a1a") }}
            >
              {subtitle}
            </p>
          )}
          {content && (
            <p 
              className="text-base mb-6 opacity-70 max-w-2xl mx-auto"
              style={{ color: image ? "#FFFFFF" : (textColor || "#1a1a1a") }}
            >
              {content}
            </p>
          )}
          {buttonText && buttonLink && (
            <a
              href={buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-tyrell-gold hover:bg-tyrell-gold-dark text-white transition-colors"
            >
              {buttonText}
              <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </section>
    );
  }

  // Promo type - highlight promotion
  if (type === "promo") {
    return (
      <section 
        className="py-12 lg:py-16"
        style={{ backgroundColor: backgroundColor || "#B76E79" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {image && (
              <div className="w-full md:w-1/3">
                <img src={image} alt={title} className="w-full h-auto rounded-lg shadow-lg" />
              </div>
            )}
            <div className={`${image ? "md:w-2/3" : "w-full"} text-center md:text-left`}>
              <h2 
                className="font-display text-2xl sm:text-3xl lg:text-4xl font-light mb-3"
                style={{ color: textColor || "#FFFFFF" }}
              >
                {title}
              </h2>
              {subtitle && (
                <p 
                  className="text-lg mb-2"
                  style={{ color: textColor || "#FFFFFF", opacity: 0.9 }}
                >
                  {subtitle}
                </p>
              )}
              {content && (
                <p 
                  className="mb-4"
                  style={{ color: textColor || "#FFFFFF", opacity: 0.8 }}
                >
                  {content}
                </p>
              )}
              {buttonText && buttonLink && (
                <a
                  href={buttonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2 bg-white text-tyrell-gold hover:bg-gray-100 transition-colors"
                >
                  {buttonText}
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Text type - simple text with optional image
  if (type === "text") {
    return (
      <section 
        className="py-16 lg:py-24"
        style={{ backgroundColor: backgroundColor || "#FFFFFF" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className={`${image ? "grid md:grid-cols-2 gap-12 items-center" : ""}`}>
            {image && (
              <div>
                <img src={image} alt={title} className="w-full h-auto rounded-lg" />
              </div>
            )}
            <div className={image ? "" : "text-center"}>
              <h2 
                className="font-display text-2xl sm:text-3xl lg:text-4xl font-light mb-4"
                style={{ color: textColor || "#1a1a1a" }}
              >
                {title}
              </h2>
              {subtitle && (
                <p 
                  className="text-lg mb-3"
                  style={{ color: textColor || "#1a1a1a", opacity: 0.7 }}
                >
                  {subtitle}
                </p>
              )}
              {content && (
                <p 
                  className="mb-6 leading-relaxed"
                  style={{ color: textColor || "#1a1a1a", opacity: 0.6 }}
                >
                  {content}
                </p>
              )}
              {buttonText && buttonLink && (
                <a
                  href={buttonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2 bg-tyrell-gold hover:bg-tyrell-gold-dark text-white transition-colors"
                >
                  {buttonText}
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Gallery type - image gallery
  if (type === "gallery") {
    const allImages = [image, ...(images || [])].filter(Boolean);
    return (
      <section 
        className="py-16 lg:py-24"
        style={{ backgroundColor: backgroundColor || "#F5F1EB" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-light mb-3"
              style={{ color: textColor || "#1a1a1a" }}
            >
              {title}
            </h2>
            {subtitle && (
              <p 
                className="text-lg"
                style={{ color: textColor || "#1a1a1a", opacity: 0.7 }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {allImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allImages.map((img, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-lg">
                  <img 
                    src={img} 
                    alt={`${title} ${i + 1}`} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          )}
          {content && (
            <p 
              className="text-center mt-8"
              style={{ color: textColor || "#1a1a1a", opacity: 0.6 }}
            >
              {content}
            </p>
          )}
        </div>
      </section>
    );
  }

  // Default fallback
  return null;
};
