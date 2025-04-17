export default function Footer() {
    return (
      <footer className="bg-gray-100 border-t border-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p className="text-md font-medium">
            &copy; {new Date().getFullYear()} My Blog. All rights reserved.
          </p>
          <p className="mt-2 text-md font-medium">
            Built with ❤️ using Next.js & TailwindCSS.
          </p>
        </div>
      </footer>
    );
  }
  

  