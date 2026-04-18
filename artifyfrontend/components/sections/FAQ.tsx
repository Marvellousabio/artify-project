"use client";

import { useState } from "react";

const faqs = [
  {
    id: 1,
    question: "What makes Artify different from other graphic design companies?",
    answer:
      "Artify is dedicated to changing the landscape of graphic design. We emphasize collaboration, cutting-edge techniques, and sustainable practices to create design solutions that not only look great but also make a positive impact. Our team stays ahead of trends and technologies to deliver innovative solutions.",
  },
  {
    id: 2,
    question: "How does your design process work?",
    answer:
      "Our process begins with a consultation to understand your vision and requirements. We then create wireframes and prototypes for approval before moving to full design implementation. Regular feedback loops ensure we capture your brand essence perfectly.",
  },
  {
    id: 3,
    question: "What file formats do you deliver?",
    answer:
      "We deliver designs in all standard formats including vector files (AI, EPS, SVG), raster files (PNG, JPG, PSD), and web-optimized versions. All source files are included for complete ownership.",
  },
  {
    id: 4,
    question: "How long does a typical project take?",
    answer:
      "Project timelines vary based on scope. Simple logo designs take 5-7 business days, while comprehensive brand identity projects take 2-3 weeks. We provide detailed timelines during the quote process.",
  },
  {
    id: 5,
    question: "Do you offer revisions?",
    answer:
      "Yes! Every project includes 2-3 rounds of revisions to ensure you're completely satisfied. Additional revisions are available at an hourly rate if needed.",
  },
  {
    id: 6,
    question: "What are your rates?",
    answer:
      "Our pricing is project-based and depends on scope and complexity. We offer transparent pricing with detailed breakdowns. Contact us for a customized quote tailored to your needs.",
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleAccordion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-purple-600 dark:text-purple-400 font-semibold tracking-wider uppercase text-sm mb-2 block">
            Common Questions
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about our services and process.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all"
            >
              <button
                onClick={() => toggleAccordion(faq.id)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                aria-expanded={openId === faq.id}
                aria-controls={`faq-answer-${faq.id}`}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                  {faq.question}
                </h3>
                <span
                  className={`transform transition-transform duration-300 flex-shrink-0 ${
                    openId === faq.id ? "rotate-180" : ""
                  }`}
                >
                  <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              <div
                id={`faq-answer-${faq.id}`}
                className={`overflow-hidden transition-all duration-300 ${
                  openId === faq.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
                aria-hidden={openId !== faq.id}
              >
                <div className="px-6 pb-5">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Still have questions? We&apos;re here to help.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
          >
            Contact Us
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
