"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useSettings } from "@/lib/settings-context";

interface HeaderProps {
  currentView: string;
  onViewChange: (view: "home" | "booking" | "dashboard") => void;
  showDashboard: boolean;
}

export default function Header({
  currentView,
  onViewChange,
  showDashboard,
}: HeaderProps) {
  // Only use session if showDashboard is true (protected routes)
  const { data: session } = showDashboard ? useSession() : { data: null };
  const { t } = useSettings();

  return (
    <header className="bg-bg-card border-b border-border-color sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-4">
          <div className="w-12 h-12 gradient-warm rounded-xl flex items-center justify-center">
            <i className="fas fa-heartbeat text-2xl text-white"></i>
          </div>
          <div>
            <h1 className="text-2xl font-serif">NurseHub</h1>
            <p className="text-sm text-text-muted font-medium">
              {t("professionalHomeCare")}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {!showDashboard ? (
            <>
              <div className="bg-bg-secondary rounded-xl p-2 flex gap-2">
                <button
                  onClick={() => onViewChange("home")}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    currentView === "home"
                      ? "bg-accent-primary text-white shadow-sm"
                      : "text-text-secondary hover:bg-bg-card"
                  }`}
                >
                  <i className="fas fa-home me-2"></i>
                  {t("home")}
                </button>
                <button
                  onClick={() => onViewChange("booking")}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    currentView === "booking"
                      ? "bg-accent-primary text-white shadow-sm"
                      : "text-text-secondary hover:bg-bg-card"
                  }`}
                >
                  <i className="fas fa-calendar-plus me-2"></i>
                  {t("book")}
                </button>
              </div>
              <Link
                href="/admin/login"
                className="px-6 py-3 bg-accent-primary text-white rounded-lg font-semibold hover:opacity-90 transition-all shadow-sm"
              >
                <i className="fas fa-user-shield me-2"></i>
                {t("dashboard") || "Dashboard"}
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-text-secondary">
                <i className="fas fa-user-circle me-2"></i>
                {session?.user?.username || t("admin")}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-6 py-3 bg-danger text-white rounded-lg font-semibold hover:opacity-90 transition-all"
              >
                <i className="fas fa-sign-out-alt me-2"></i>
                {t("logout")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
