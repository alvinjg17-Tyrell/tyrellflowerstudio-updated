import { Link } from "react-router-dom";

const fixImageUrl = (url) => {
  if (!url) return url;
  if (url.includes(".preview.emergentagent.com/api/uploads/")) {
    const match = url.match(/\/api\/uploads\/.*/);
    return match ? match[0] : url;
  }
  return url;
};

const slugify = (text = "") =>
  text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const ProductCard = ({ product }) => {
  const slug = product.slug || slugify(product.name || "");

  return (
    <Link to={`/products/${slug}`} className="text-left group block">
      <div className="aspect-[4/5] overflow-hidden bg-[#f7f4ef]">
        <img
          src={fixImageUrl(product.image)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>

      <h3 className="mt-3 text-[28px] font-serif leading-none text-[#111]">
        {product.name}
      </h3>
    </Link>
  );
};

const CategorySection = ({ category }) => {
  const activeProducts = (category.products || []).filter(
    (p) => p.active !== false
  );

  if (!activeProducts.length) return null;

  return (
    <section className="mb-16">
      <div className="mb-8">
        <h2 className="text-4xl md:text-5xl font-serif text-[#111]">
          {category.name}
        </h2>
        {category.description && (
          <p className="mt-3 text-[#5b5b5b] max-w-2xl">
            {category.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
        {activeProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

const ServicesSection = ({ categories = [] }) => {
  const activeCategories = (categories || []).filter(
    (c) => c.active !== false
  );

  if (!activeCategories.length) {
    return null;
  }

  return (
    <section id="services" className="px-4 md:px-8 lg:px-10 py-14 bg-white">
      <div id="catalogo" className="max-w-[1600px] mx-auto">
        {activeCategories.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
