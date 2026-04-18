import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Artify",
  description:
    "Terms and conditions for using Artify's services. Please read these terms carefully before using our website or engaging our design services.",
  keywords: ["terms of service", "legal terms", "service agreement"],
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Terms of Service
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              By accessing or using Artify&apos;s website and services, you agree to
              be bound by these Terms of Service. If you do not agree to these
              terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              2. Services
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Artify provides graphic design services including but not limited
              to brand identity design, UI/UX design, marketing materials, and
              custom design projects. Service specifics are outlined in
              individual project agreements or proposals.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              3. Intellectual Property
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Upon full payment, you receive full ownership and rights to the
              final design deliverables. However, Artify retains the right to
              display your project in our portfolio and marketing materials
              unless otherwise agreed in writing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              4. Payment Terms
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Payment terms are specified in project proposals. Typically:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>50% deposit required to begin work</li>
              <li>Remaining 50% due upon project completion</li>
              <li>Late payments may incur additional fees</li>
              <li>All prices are in USD unless otherwise specified</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              5. Revisions
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Each project includes 2-3 rounds of revisions as specified in the
              agreement. Additional revisions are available at an hourly rate or
              as a separate add-on.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. Limitation of Liability
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Artify is not liable for any indirect, incidental, special, or
              consequential damages arising from your use of our services. Our
              total liability is limited to the amount paid for the specific
              project.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              7. Governing Law
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              These terms are governed by the laws of Nigeria. Any disputes
              shall be resolved in the courts of Lagos State, Nigeria.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              8. Changes to Terms
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We reserve the right to update these terms at any time. Continued
              use of our services after changes constitutes acceptance of the
              new terms.
            </p>
          </section>

          <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
