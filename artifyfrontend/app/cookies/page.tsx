import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy - Artify",
  description:
    "Learn how Artify uses cookies and similar technologies to enhance your browsing experience and improve our services.",
  keywords: ["cookie policy", "cookies", "tracking", "privacy"],
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Cookie Policy
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              1. What Are Cookies?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Cookies are small text files stored on your device when you visit
              a website. They help websites remember your preferences, improve
              functionality, and provide analytics about site usage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              2. Types of Cookies We Use
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Essential Cookies
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Required for the website to function properly (security,
                  session management, accessibility). These cannot be disabled.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Analytics Cookies
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Help us understand how visitors interact with our website
                  (Google Analytics). These are optional and can be disabled.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Preference Cookies
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Remember your settings (language, dark mode, etc.) for a
                  better user experience.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              3. Third-Party Cookies
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We may allow third-party services (analytics, social media
              widgets) to place cookies on your device. These third parties
              have their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              4. Managing Cookies
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              You can control cookies through your browser settings:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Block all cookies (may affect website functionality)</li>
              <li>Delete existing cookies</li>
              <li>Set preferences for specific websites</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              Most browsers also offer a &quot;Do Not Track&quot; option, though this
              is not uniformly respected across websites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              5. Updates to This Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We may update this Cookie Policy periodically. The &quot;Last
              updated&quot; date at the bottom indicates the most recent revision.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. Contact Us
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              For questions about our cookie usage, please contact us at
              privacy@artifydesign.com.
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
