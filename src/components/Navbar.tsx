"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { FaSignInAlt } from "react-icons/fa";
import Image from "next/image";


export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center text-xl font-bold">
              <Image
                src="/Logo.png"
                alt="OpenPost Logo"
                width={50}
                height={50}
                className="mr-2"
              />
              <span className="bg-gradient-to-t from-[#83ab16] to-[#39B54A] bg-clip-text text-transparent font-bold text-2xl">
                OpenPost
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <div className="md:flex items-center space-x-2">
                  <Image
                    width={50}
                    height={50}
                    src={
                      session?.user?.image ||
                      "https://cdn-icons-png.flaticon.com/512/2202/2202112.png"
                    }
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://cdn-icons-png.flaticon.com/512/2202/2202112.png";
                    }}
                    alt={session?.user?.name || "User Profile"}
                    className="w-8 h-8 rounded-full object-cover"
                  />

                  <span className="hidden md:block text-gray-700 dark:text-gray-300 font-medium">
                    {session.user?.name || session.user?.email}
                  </span>
                </div>
                <LogoutButton />
              </>
            ) : (
              <Link
                href="/sign-in"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full hover:from-green-600 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                <FaSignInAlt className="text-base" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
