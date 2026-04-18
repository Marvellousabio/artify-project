"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-teal-50 dark:from-gray-900 dark:to-teal-900/20 px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-48 h-48">
            <Image
              src="/window.svg"
              alt="Error illustration"
              fill
              className="object-contain opacity-50"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-bold text-teal-600 dark:text-teal-400">!</span>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Oops! Something went wrong
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          We apologize for the inconvenience. Our team has been notified and we&apos;re working to fix the issue.
        </p>

        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="block w-full px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:border-teal-600 hover:text-teal-600 dark:hover:border-teal-400 dark:hover:text-teal-400 transition-all duration-300 font-semibold"
          >
            Go Home
          </Link>
        </div>

        {error.digest && (
          <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
