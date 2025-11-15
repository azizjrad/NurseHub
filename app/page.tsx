"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HomeView from "@/components/HomeView";
import BookingView from "@/components/BookingView";
import Footer from "@/components/Footer";
import LoadingWrapper from "@/components/LoadingWrapper";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import { SettingsProvider } from "@/lib/settings-context";

export default function Home() {
  const [currentView, setCurrentView] = useState<"home" | "booking">("home");

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentView]);

  const handleViewChange = (view: "home" | "booking" | "dashboard") => {
    if (view !== "dashboard") {
      setCurrentView(view);
    }
  };

  return (
    <SettingsProvider>
      <LoadingWrapper>
        <div className="min-h-screen flex flex-col">
          <Header
            currentView={currentView}
            onViewChange={handleViewChange}
            showDashboard={false}
          />
          <main className="flex-1 px-4 py-12 max-w-7xl mx-auto w-full">
            {currentView === "home" ? (
              <HomeView onBookClick={() => setCurrentView("booking")} />
            ) : (
              <BookingView />
            )}
          </main>
          <Footer />
          <AccessibilityToolbar />
        </div>
      </LoadingWrapper>
    </SettingsProvider>
  );
}
