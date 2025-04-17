import { FaSpinner } from "react-icons/fa";

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <FaSpinner className="animate-spin h-8 w-8 text-green-600 dark:text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Loading...</h1>
        <p className="text-gray-600 dark:text-gray-300">Please wait while we prepare your content</p>
      </div>
    </div>
  );
  
}

function ErrorDisplay({ error }: { error: Error }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading post
            </h3>
            <div className="mt-2 text-sm text-red-700">
              {error instanceof Error
                ? error.message
                : "An unknown error occurred"}
            </div>
            <div className="mt-4">
              <button
                onClick={() => window.location.reload()}
                className="text-sm font-medium text-red-800 hover:text-red-700 hover:cursor-pointer"
              >
                Try again <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotFoundDisplay() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center py-16">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
          Not found
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          The page you're looking for doesn't exist or may have been removed.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go back home
          </a>
        </div>
      </div>
    </div>
  );
}

export { Loading, ErrorDisplay, NotFoundDisplay };
