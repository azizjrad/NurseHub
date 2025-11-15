"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import DashboardView from "@/components/DashboardView";
import { SettingsProvider } from "@/lib/settings-context";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router, mounted]);

  if (status === "loading" || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-accent-primary mb-4"></i>
          <p className="text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <SettingsProvider>
      <div className="min-h-screen flex flex-col">
        <Header
          currentView="dashboard"
          onViewChange={() => {}}
          showDashboard={true}
        />
        <main className="flex-1 px-4 py-12 max-w-7xl mx-auto w-full">
          <DashboardView />
        </main>
        <AccessibilityToolbar />
      </div>
    </SettingsProvider>
  );
}
