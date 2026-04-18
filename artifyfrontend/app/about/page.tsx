import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Artify",
  description:
    "Learn about Artify, our mission to revolutionize graphic design, and meet our creative team of designers and developers.",
  keywords: ["about Artify", "design team", "creative agency", "graphic design company"],
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Artify</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            We&apos;re on a mission to revolutionize the graphic design landscape through
            collaboration, cutting-edge techniques, and sustainable practices.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Artify was founded with a simple yet powerful vision: to make
                professional-grade graphic design accessible to businesses of all sizes.
                We believe that great design shouldn&apos;t be a luxury—it should be a
                standard.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Based in Nigeria but serving clients globally, we combine
                world-class design expertise with a deep understanding of local
                markets to deliver solutions that truly resonate.
              </p>
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div>
                  <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                    50+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Projects Delivered
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                    10+

                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Happy Clients
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                    2+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Years Experience
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-purple-500 rounded-3xl transform rotate-3 opacity-20"></div>
              <img
                src="/team.jpg"
                alt="Artify team in creative session"
                className="relative rounded-3xl shadow-2xl w-full object-cover"
                width={600}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The principles that guide every project we undertake
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎨",
                title: "Creative Excellence",
                description:
                  "We push boundaries and explore new ideas to deliver designs that stand out.",
              },
              {
                icon: "🤝",
                title: "Collaboration",
                description:
                  "We work closely with our clients, treating their goals as our own.",
              },
              {
                icon: "🌍",
                title: "Sustainability",
                description:
                  "We design with the future in mind, using eco-friendly practices.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                <div className="text-5xl mb-6">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Creative Team
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The talented individuals behind Artify&apos;s success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { name: "Sarah Johnson", role: "Founder & CEO" },
              { name: "Michael Chen", role: "Creative Director" },
              { name: "Amaka Okafor", role: "Lead Designer" },
              { name: "David Adeyemi", role: "Senior Developer" },
            ].map((member, index) => (
              <div
                key={index}
                className="text-center group cursor-pointer"
              >
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-teal-400 to-purple-500 p-1 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-3xl font-bold text-gray-600 dark:text-gray-300">
                    {member.name.charAt(0)}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-sm text-teal-600 dark:text-teal-400">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
