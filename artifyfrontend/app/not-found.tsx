"use client";

import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-teal-50 dark:from-gray-900 dark:to-teal-900/20 px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-48 h-48">
            <Image
              src="/globe.svg"
              alt="404 not found"
              fill
              className="object-contain opacity-30"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl font-bold text-teal-600 dark:text-teal-400">404</span>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          The page you&apos;re looking for seems to have drifted into the void. Let&apos;s get you back to solid ground.
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
          >
            Return Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:border-teal-600 hover:text-teal-600 dark:hover:border-teal-400 dark:hover:text-teal-400 transition-all duration-300 font-semibold"
          >
            Go Back
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Or explore our popular pages:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="#services"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/30 hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-sm"
            >
              Services
            </Link>
            <Link
              href="#contact"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/30 hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-sm"
            >
              Contact
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/30 hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-sm"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
