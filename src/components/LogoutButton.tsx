"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:from-red-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-300 hover:cursor-pointer"
    >
      <LogOut size={18} />
      <span className="hidden sm:inline">Logout</span>
    </button>
  );
}
