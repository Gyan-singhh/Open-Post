"use client";
import { useSession } from "next-auth/react";
import { Loading } from "./UIStatus.tsx";

export default function SessionCheck({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();

  if (status === "loading") {
    return <Loading />;
  }

  return <>{children}</>;
}
