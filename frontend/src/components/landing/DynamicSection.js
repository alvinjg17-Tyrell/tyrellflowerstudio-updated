import { ArrowRight } from "lucide-react";

const SectionButton = ({ buttonText, buttonLink }) => {
  if (!buttonText || !buttonLink) return null;

  return (
    <a
      href={buttonLink}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-6 py-3 bg-tyrell-gold hover:bg-tyrell-gold-dark text-white transition-colors"
    >
      {buttonText}
      <ArrowRight className="w-4 h-4" />
    </a>
  );
};

const SectionTitle = ({ title, subtitle, textColor, centered = false }) => (
  <div className={centered ? "text-center mb-10" : "mb-6"}>
    <h2
      className="font-display text-2xl sm:text-3xl lg:text-4xl font-light mb-3"
      style={{ color: textColor || "#1a1a1a" }}
    >
      {title}
    </h2>

    {subtitle && (
      <p
        className="text-lg"
        style={{ color: textColor || "#1a1a1a", opacity: 0.72 }}
      >
        {subtitle}
      </p>
    )}
  </div>
);

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

  const allImages = [image, ...(images || [])].filter(Boolean);

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
            style={{ color: image ? "#FFFFFF" : textColor || "#1a1a1a" }}
          >
            {title}
          </h2>

          {subtitle && (
            <p
              className="text-lg mb-4 opacity-80"
              style={{ color: image ? "#FFFFFF" : textColor || "#1a1a1a" }}
            >
              {subtitle}
            </p>
          )}

          {content && (
            <p
              className="text-base mb-6 opacity-70 max-w-2xl mx-auto"
              style={{ color: image ? "#FFFFFF" : textColor || "#1a1a1a" }}
            >
              {content}
            </p>
          )}

          <SectionButton buttonText={buttonText} buttonLink={buttonLink} />
        </div>
      </section>
    );
  }

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
                <img
                  src={image}
                  alt={title}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
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

  if (type === "text" || type === "image_text") {
    return (
      <section
        className="py-16 lg:py-24"
        style={{ backgroundColor: backgroundColor || "#FFFFFF" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className={`${image ? "grid md:grid-cols-2 gap-12 items-center" : ""}`}>
            {image && (
              <div>
                <img src={image} alt={title} className="w-full h-auto rounded-lg" />
              </div>
            )}

            <div className={image ? "" : "text-center"}>
              <SectionTitle
                title={title}
                subtitle={subtitle}
                textColor={textColor}
                centered={!image}
              />

              {content && (
                <p
                  className="mb-6 leading-relaxed"
                  style={{ color: textColor || "#1a1a1a", opacity: 0.68 }}
                >
                  {content}
                </p>
              )}

              <SectionButton buttonText={buttonText} buttonLink={buttonLink} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (type === "gallery" || type === "gallery_grid") {
    return (
      <section
        className="py-16 lg:py-24"
        style={{ backgroundColor: backgroundColor || "#F5F1EB" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionTitle
            title={title}
            subtitle={subtitle}
            textColor={textColor}
            centered
          />

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
              style={{ color: textColor || "#1a1a1a", opacity: 0.65 }}
            >
              {content}
            </p>
          )}
        </div>
      </section>
    );
  }

  if (type === "carousel") {
    return (
      <section
        className="py-16 lg:py-24"
        style={{ backgroundColor: backgroundColor || "#F5F1EB" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionTitle
            title={title}
            subtitle={subtitle}
            textColor={textColor}
            centered
          />

          {allImages.length > 0 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {allImages.map((img, i) => (
                <div
                  key={i}
                  className="min-w-[260px] sm:min-w-[320px] aspect-[4/5] overflow-hidden rounded-lg flex-shrink-0"
                >
                  <img
                    src={img}
                    alt={`${title} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {content && (
            <p
              className="text-center mt-8"
              style={{ color: textColor || "#1a1a1a", opacity: 0.65 }}
            >
              {content}
            </p>
          )}
        </div>
      </section>
    );
  }

  if (type === "cta") {
    return (
      <section
        className="py-16 lg:py-20"
        style={{ backgroundColor: backgroundColor || "#B76E79" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2
            className="font-display text-3xl sm:text-4xl font-light mb-4"
            style={{ color: textColor || "#FFFFFF" }}
          >
            {title}
          </h2>

          {subtitle && (
            <p
              className="text-lg mb-3"
              style={{ color: textColor || "#FFFFFF", opacity: 0.85 }}
            >
              {subtitle}
            </p>
          )}

          {content && (
            <p
              className="mb-6 max-w-2xl mx-auto"
              style={{ color: textColor || "#FFFFFF", opacity: 0.75 }}
            >
              {content}
            </p>
          )}

          <SectionButton buttonText={buttonText} buttonLink={buttonLink} />
        </div>
      </section>
    );
  }

  if (type === "video") {
    return (
      <section
        className="py-16 lg:py-24"
        style={{ backgroundColor: backgroundColor || "#111111" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <SectionTitle
            title={title}
            subtitle={subtitle}
            textColor={textColor || "#FFFFFF"}
            centered
          />

          {image && (
            <div className="aspect-video overflow-hidden rounded-lg shadow-lg">
              <video
                src={image}
                controls
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {content && (
            <p
              className="text-center mt-6"
              style={{ color: textColor || "#FFFFFF", opacity: 0.72 }}
            >
              {content}
            </p>
          )}
        </div>
      </section>
    );
  }

  if (type === "cards" || type === "two_columns" || type === "three_columns") {
    const columns =
      type === "two_columns"
        ? "md:grid-cols-2"
        : type === "three_columns"
        ? "md:grid-cols-3"
        : "md:grid-cols-3";

    return (
      <section
        className="py-16 lg:py-24"
        style={{ backgroundColor: backgroundColor || "#FFFFFF" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionTitle
            title={title}
            subtitle={subtitle}
            textColor={textColor}
            centered
          />

          {allImages.length > 0 ? (
            <div className={`grid grid-cols-1 ${columns} gap-6`}>
              {allImages.map((img, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg overflow-hidden shadow-sm border border-black/5"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={img}
                      alt={`${title} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <h3
                      className="font-display text-xl mb-2"
                      style={{ color: textColor || "#1a1a1a" }}
                    >
                      {title}
                    </h3>

                    {content && (
                      <p
                        className="text-sm"
                        style={{ color: textColor || "#1a1a1a", opacity: 0.7 }}
                      >
                        {content}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`grid grid-cols-1 ${columns} gap-6`}>
              {[1, 2, 3].slice(0, type === "two_columns" ? 2 : 3).map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-lg p-6 shadow-sm border border-black/5"
                >
                  <h3
                    className="font-display text-xl mb-2"
                    style={{ color: textColor || "#1a1a1a" }}
                  >
                    {title}
                  </h3>

                  {content && (
                    <p
                      className="text-sm"
                      style={{ color: textColor || "#1a1a1a", opacity: 0.7 }}
                    >
                      {content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <SectionButton buttonText={buttonText} buttonLink={buttonLink} />
          </div>
        </div>
      </section>
    );
  }

  return null;
};