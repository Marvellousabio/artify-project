import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers - Artify",
  description:
    "Join our creative team at Artify. Explore career opportunities for designers, developers, and creative professionals.",
  keywords: ["careers at Artify", "design jobs", "creative positions", "join our team"],
};

const positions = [
  {
    title: "Senior Brand Designer",
    type: "Full-time",
    location: "Remote / Lagos, NG",
    department: "Design",
    requirements: [
      "5+ years of brand identity experience",
      "Strong portfolio showcasing brand systems",
      "Experience with design systems",
      "Excellent communication skills",
    ],
  },
  {
    title: "UI/UX Designer",
    type: "Full-time",
    location: "Remote",
    department: "Design",
    requirements: [
      "3+ years of UI/UX design experience",
      "Proficiency in Figma and design tools",
      "Understanding of user research methods",
      "Experience with design systems",
    ],
  },
  {
    title: "Frontend Developer",
    type: "Full-time",
    location: "Remote",
    department: "Engineering",
    requirements: [
      "3+ years of React/Next.js experience",
      "Strong TypeScript and CSS skills",
      "Experience with modern web technologies",
      "Understanding of design implementation",
    ],
  },
  {
    title: "Project Manager",
    type: "Full-time",
    location: "Lagos, NG",
    department: "Operations",
    requirements: [
      "3+ years in project management",
      "Experience with Agile/Scrum methodologies",
      "Strong client communication skills",
      "Familiarity with design workflows",
    ],
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-600 to-teal-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Team</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            We&apos;re always looking for talented individuals who share our passion for
            design and innovation.
          </p>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Work With Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: "🌍",
                title: "Remote-First Culture",
                description:
                  "Work from anywhere with flexible hours and a results-driven environment.",
              },
              {
                icon: "📚",
                title: "Learning & Development",
                description:
                  "Continuous learning opportunities, conference budgets, and mentorship programs.",
              },
              {
                icon: "🎨",
                title: "Creative Freedom",
                description:
                  "Express your creativity and bring innovative ideas to life with real impact.",
              },
              {
                icon: "🏥",
                title: "Comprehensive Benefits",
                description:
                  "Health insurance, retirement plans, and generous PTO policy.",
              },
              {
                icon: "🚀",
                title: "Growth Opportunities",
                description:
                  "Clear career paths and regular promotions based on merit and performance.",
              },
              {
                icon: "💡",
                title: "Innovative Projects",
                description:
                  "Work on exciting projects for global brands across diverse industries.",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl text-center"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Open Positions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Find your next opportunity with Artify
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {positions.map((position, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {position.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
                        {position.type}
                      </span>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold">
                        {position.location}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">
                        {position.department}
                      </span>
                    </div>
                  </div>
                  <a
                    href="#contact"
                    className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all text-center font-semibold"
                  >
                    Apply Now
                  </a>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Requirements:
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {position.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <svg
                          className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0"
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
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Don&apos;t see a perfect fit? We&apos;re always interested in meeting talented
              people.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center px-6 py-3 border-2 border-teal-600 text-teal-600 dark:text-teal-400 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-all duration-300 font-semibold"
            >
              Send General Application
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
