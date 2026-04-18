import Link from "next/link";
import Image from "next/image";

const services = [
  {
    id: 1,
    icon: "/service.png",
    title: "Brand Identity",
    description: "Complete brand identity design including logo, color palette, typography, and comprehensive brand guidelines.",
    features: ["Logo Design", "Brand Guidelines", "Visual Identity", "Brand Strategy"],
    href: "/services/brand-identity",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 2,
    icon: "/work.png",
    title: "UI/UX Design",
    description: "User interface and experience design for web and mobile applications that delight users and drive engagement.",
    features: ["Wireframing", "Prototyping", "User Research", "Interaction Design"],
    href: "/services/ui-ux",
    color: "from-purple-500 to-purple-600",
  },
  {
    id: 3,
    icon: "/faq.png",
    title: "Marketing Materials",
    description: "Eye-catching marketing collateral that communicates your message and converts prospects into customers.",
    features: ["Social Media Graphics", "Print Collateral", "Digital Ads", "Campaign Assets"],
    href: "/services/marketing",
    color: "from-teal-500 to-teal-600",
  },
  {
    id: 4,
    icon: "/contact.png",
    title: "Custom Projects",
    description: "Tailored design solutions for unique challenges. We work closely with you to bring your vision to life.",
    features: ["Consultation", "Custom Design", "Iterative Process", "Ongoing Support"],
    href: "/contact",
    color: "from-pink-500 to-pink-600",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-teal-600 dark:text-teal-400 font-semibold tracking-wider uppercase text-sm mb-2 block">
            What We Offer
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            We will make your designing experience <span className="font-semibold text-teal-600 dark:text-teal-400">easier</span>, <span className="font-semibold text-purple-600 dark:text-purple-400">better</span>, and{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">affordable</span>.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

              <div className="p-8 relative z-10">
                <div className="relative w-16 h-16 mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Image
                    src={service.icon}
                    alt={`${service.title} icon`}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {service.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-2 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={service.href}
                  className="inline-flex items-center text-teal-600 dark:text-teal-400 font-semibold hover:text-teal-700 dark:hover:text-teal-300 transition-colors group/link"
                >
                  Learn More
                  <svg
                    className="w-5 h-5 ml-2 transform group-hover/link:translate-x-2 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
