"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useSettings } from "@/lib/settings-context";
import { useState } from "react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: "home" | "booking" | "dashboard") => {
    onViewChange(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-bg-card border-b border-border-color sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-4">
          <div className="w-12 h-12 gradient-warm rounded-xl flex items-center justify-center">
            <i className="fas fa-heartbeat text-2xl text-white"></i>
          </div>
          <div>
            <h1 className="text-2xl font-serif">NurseHub</h1>
            <p className="text-sm text-text-muted font-medium hidden sm:block">
              {t("professionalHomeCare")}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
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

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center text-text-primary hover:bg-bg-secondary rounded-lg transition-all"
          aria-label="Toggle menu"
        >
          <i
            className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"} text-xl`}
          ></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-bg-secondary border-t border-border-color">
          <div className="px-4 py-4 space-y-2">
            {!showDashboard ? (
              <>
                <button
                  onClick={() => handleNavClick("home")}
                  className={`w-full px-6 py-3 rounded-lg font-semibold transition-all text-left ${
                    currentView === "home"
                      ? "bg-accent-primary text-white shadow-sm"
                      : "bg-bg-card text-text-secondary hover:bg-bg-card"
                  }`}
                >
                  <i className="fas fa-home me-2"></i>
                  {t("home")}
                </button>
                <button
                  onClick={() => handleNavClick("booking")}
                  className={`w-full px-6 py-3 rounded-lg font-semibold transition-all text-left ${
                    currentView === "booking"
                      ? "bg-accent-primary text-white shadow-sm"
                      : "bg-bg-card text-text-secondary hover:bg-bg-card"
                  }`}
                >
                  <i className="fas fa-calendar-plus me-2"></i>
                  {t("book")}
                </button>
                <Link
                  href="/admin/login"
                  className="block w-full px-6 py-3 bg-accent-primary text-white rounded-lg font-semibold hover:opacity-90 transition-all text-left"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fas fa-user-shield me-2"></i>
                  {t("dashboard") || "Dashboard"}
                </Link>
              </>
            ) : (
              <>
                <div className="px-6 py-3 bg-bg-card rounded-lg text-text-secondary">
                  <i className="fas fa-user-circle me-2"></i>
                  {session?.user?.username || t("admin")}
                </div>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-6 py-3 bg-danger text-white rounded-lg font-semibold hover:opacity-90 transition-all text-left"
                >
                  <i className="fas fa-sign-out-alt me-2"></i>
                  {t("logout")}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
