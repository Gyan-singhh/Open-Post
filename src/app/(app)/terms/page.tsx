export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-4 py-12">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Terms & Conditions
        </h1>

        <section className="space-y-6 text-sm sm:text-base leading-relaxed">
          <p>
            Welcome to <strong>OpenPost</strong>! By accessing or using our
            platform, you agree to be bound by the following terms and
            conditions. Please read them carefully.
          </p>

          <h2 className="text-xl font-semibold mt-6">
            1. No Registration Required
          </h2>
          <p>
            You do not need to create a separate account to use our platform. We
            support sign-in via trusted providers like Google and GitHub. When
            you choose to log in using one of these methods, we securely collect
            basic profile information such as your name, email address, and
            avatar image.
          </p>

          <h2 className="text-xl font-semibold mt-6">2. Data Usage</h2>
          <p>
            The data we collect from your Google or GitHub login is used solely
            to personalize your experience on the platform, display your name
            and avatar on posts, and associate your content with your identity.
            We do not sell, rent, or share your personal information with third
            parties.
          </p>

          <h2 className="text-xl font-semibold mt-6">3. Content Ownership</h2>
          <p>
            Any posts, comments, or content you create on the platform remain
            your intellectual property. However, by submitting content, you
            grant us a non-exclusive license to display and distribute it within
            the platform.
          </p>

          <h2 className="text-xl font-semibold mt-6">4. Appropriate Use</h2>
          <p>
            You agree to use ThoughtFlow responsibly. Do not publish offensive,
            harmful, illegal, or spammy content. We reserve the right to
            moderate, remove, or restrict content and users who violate these
            guidelines.
          </p>

          <h2 className="text-xl font-semibold mt-6">5. Platform Updates</h2>
          <p>
            We may update these Terms occasionally to reflect changes in our
            services, policies, or legal requirements. We’ll try to notify users
            of major changes, but it is your responsibility to stay informed.
          </p>

          <h2 className="text-xl font-semibold mt-6">6. Contact Us</h2>
          <p>
            If you have any questions about these Terms and Conditions, please
            contact us at: <span className="font-bold">support@yourplatform.com</span>
          </p>
        </section>

        <div className="border-t border-gray-200 pt-4 mt-10">
          <p className="text-sm text-gray-500 pt-1">
            By using our platform, you acknowledge that you have read,
            understood, and agree to be bound by these Terms and Conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
