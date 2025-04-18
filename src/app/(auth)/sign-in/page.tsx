"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaSpinner } from "react-icons/fa";
import { Loading } from "@/components/UIStatus";

import Link from "next/link";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleSignIn = async (provider: string) => {
    setLoadingProvider(provider);
    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch (error) {
      console.error("SignIn Error:", error);
      setLoadingProvider(null);
    }
  };

  if (status === "loading" || status === "authenticated") {
    return <Loading />;
  }

  return (
    <div className="min-h-[82vh] sm:min-h-[75vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-bold mt-10 mb-2 text-center text-gray-800">
          Welcome Back
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Sign in to access your account
        </p>

        <div className="space-y-4">
          <button
            onClick={() => handleSignIn("google")}
            disabled={!!loadingProvider}
            className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all ${
              loadingProvider && loadingProvider !== "google"
                ? "opacity-50"
                : ""
            }`}
          >
            {loadingProvider === "google" ? (
              <FaSpinner className="animate-spin h-5 w-5" />
            ) : (
              <>
                <FcGoogle className="h-5 w-5" />
                <span className="font-medium text-gray-700">
                  Continue with Google
                </span>
              </>
            )}
          </button>

          <button
            onClick={() => handleSignIn("github")}
            disabled={!!loadingProvider}
            className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-gray-800 hover:bg-gray-900 text-white transition-all ${
              loadingProvider && loadingProvider !== "github"
                ? "opacity-50"
                : ""
            }`}
          >
            {loadingProvider === "github" ? (
              <FaSpinner className="animate-spin h-5 w-5" />
            ) : (
              <>
                <FaGithub className="h-5 w-5" />
                <span className="font-medium">Continue with GitHub</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
