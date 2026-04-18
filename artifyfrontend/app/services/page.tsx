import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services - Artify",
  description:
    "Explore our comprehensive range of graphic design services including brand identity, UI/UX design, marketing materials, and custom projects.",
  keywords: ["graphic design services", "brand identity", "UI/UX design", "marketing materials"],
};

const services = [
  {
    id: "brand-identity",
    title: "Brand Identity Design",
    shortDescription:
      "Complete brand identity design including logo, color palette, typography, and comprehensive brand guidelines.",
    fullDescription:
      "Your brand is more than a logo—it&apos;s the entire experience your customers have with your company. We create cohesive visual identities that communicate your values, resonate with your audience, and stand the test of time. From logo design to complete brand systems, we ensure every touchpoint reflects your brand&apos;s essence.",
    features: [
      "Logo design (primary, secondary, sub-mark)",
      "Color palette & typography systems",
      "Brand guidelines documentation",
      "Business card & letterhead design",
      "Brand voice & messaging",
      "Template library for social media",
    ],
    process: [
      "Discovery & brand strategy workshop",
      "Logo sketching & concept development",
      "Digital refinement & iterations",
      "Brand guidelines compilation",
      "Final delivery & implementation support",
    ],
    icon: "/service.png",
  },
  {
    id: "ui-ux",
    title: "UI/UX Design",
    shortDescription:
      "User interface and experience design for web and mobile applications that delight users and drive engagement.",
    fullDescription:
      "Great products start with great user experiences. Our UI/UX design team combines user research, prototyping, and visual design to create intuitive, engaging digital products. We design for both desktops and mobile devices, ensuring your application looks and works beautifully everywhere.",
    features: [
      "User research & persona development",
      "Wireframing & prototyping",
      "UI design systems",
      "Interaction design",
      "Usability testing",
      "Design handoff to development",
    ],
    process: [
      "User research & requirement gathering",
      "User journey mapping & wireframes",
      "Interactive prototyping",
      "Visual design & branding alignment",
      "Usability testing & iteration",
      "Developer handoff & support",
    ],
    icon: "/work.png",
  },
  {
    id: "marketing",
    title: "Marketing Materials",
    shortDescription:
      "Eye-catching marketing collateral that communicates your message and converts prospects into customers.",
    fullDescription:
      "From social media graphics to print collateral, we create marketing materials that capture attention and drive results. Whether you need a one-time campaign asset or an ongoing partnership, we produce designs that align with your brand and speak to your target audience.",
    features: [
      "Social media graphics (posts, stories, covers)",
      "Print collateral (brochures, flyers, posters)",
      "Digital advertisements (banners, emails)",
      "Infographics & data visualization",
      "Event materials & signage",
      "Campaign asset packages",
    ],
    process: [
      "Campaign briefing & asset planning",
      "Design concepts & templates",
      "Content integration & refinement",
      "Multi-format production",
      "Quality assurance & delivery",
    ],
    icon: "/faq.png",
  },
  {
    id: "print",
    title: "Print Design",
    shortDescription:
      "High-quality print design for materials that make a lasting impression in the physical world.",
    fullDescription:
      "In an increasingly digital world, well-designed print materials can make a powerful impact. From business cards to large-format prints, we ensure your physical collateral maintains the same quality and brand consistency as your digital presence.",
    features: [
      "Business cards & stationery",
      "Brochures & catalogs",
      "Packaging design",
      "Posters & banners",
      "Annual reports",
      "Merchandise & apparel",
    ],
    process: [
      "Print specification & formatting",
      "Design creation & Bleed setup",
      "Proof review & revisions",
      "Print-ready file delivery",
      "Print vendor coordination (optional)",
    ],
    icon: "/contact.png",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <section className="bg-gradient-to-r from-teal-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Comprehensive design solutions tailored to your unique needs
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Image */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-purple-500 rounded-3xl transform rotate-3 opacity-20"></div>
                <img
                  src={service.icon}
                  alt={service.title}
                  className="relative rounded-3xl shadow-2xl w-full h-80 object-cover"
                />
              </div>

              {/* Content */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {service.title}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  {service.fullDescription}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    What&apos;s Included
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <svg
                          className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-600 dark:text-gray-300 text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Process */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Our Process
                  </h3>
                  <ol className="space-y-2">
                    {service.process.map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-600 text-white text-sm flex items-center justify-center font-bold">
                          {i + 1}
                        </span>
                        <span className="text-gray-600 dark:text-gray-300 text-sm">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

                <a
                  href="#contact"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                >
                  Get Started
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
