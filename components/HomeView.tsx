"use client";

import { useEffect, useRef } from "react";
import { useSettings } from "@/lib/settings-context";

interface HomeViewProps {
  onBookClick: () => void;
}

export default function HomeView({ onBookClick }: HomeViewProps) {
  const { t } = useSettings();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Create intersection observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    // Observe all scroll-reveal elements
    const elements = document.querySelectorAll(
      ".scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale"
    );
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const scrollToAbout = () => {
    document
      .getElementById("aboutSection")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="text-center py-20 gradient-warm rounded-3xl mb-16 text-white relative overflow-hidden scroll-reveal-scale">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='rgba(255,255,255,0.1)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)'/%3E%3C/svg%3E")`,
          }}
        ></div>
        <div className="relative z-10">
          <h2 className="text-5xl md:text-6xl font-serif mb-6 leading-tight">
            {t("heroTitle")}
          </h2>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 opacity-95">
            {t("heroSubtitle")}
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <button
              onClick={onBookClick}
              className="px-10 py-5 bg-white text-accent-primary rounded-xl font-bold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all"
            >
              <i className="fas fa-calendar-check mr-3"></i>
              {t("bookAppointment")}
            </button>
            <button
              onClick={scrollToAbout}
              className="px-10 py-5 bg-white/15 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/25 transform hover:-translate-y-1 transition-all backdrop-blur-sm"
            >
              <i className="fas fa-info-circle mr-3"></i>
              {t("learnMore")}
            </button>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="mb-16 scroll-reveal">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-serif mb-4">{t("ourServices")}</h3>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            {t("servicesSubtitle")}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: "fa-user-nurse",
              title: t("postSurgery"),
              description: t("postSurgeryDesc"),
            },
            {
              icon: "fa-syringe",
              title: t("medication"),
              description: t("medicationDesc"),
            },
            {
              icon: "fa-band-aid",
              title: t("woundCare"),
              description: t("woundCareDesc"),
            },
            {
              icon: "fa-heartbeat",
              title: t("chronicCare"),
              description: t("chronicCareDesc"),
            },
            {
              icon: "fa-hand-holding-medical",
              title: t("elderCare"),
              description: t("elderCareDesc"),
            },
            {
              icon: "fa-notes-medical",
              title: t("healthAssessments"),
              description: t("healthAssessmentsDesc"),
            },
          ].map((service, index) => (
            <div
              key={index}
              className="bg-bg-card border border-border-color rounded-2xl p-8 text-center hover:transform hover:-translate-y-2 hover:shadow-lg transition-all scroll-reveal"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-20 h-20 gradient-warm rounded-2xl flex items-center justify-center mx-auto mb-6">
                <i className={`fas ${service.icon} text-3xl text-white`}></i>
              </div>
              <h4 className="text-2xl font-serif mb-4">{service.title}</h4>
              <p className="text-text-secondary leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div
        id="aboutSection"
        className="bg-bg-card border border-border-color rounded-3xl p-12 mb-16 shadow-md scroll-reveal"
      >
        <div className="max-w-4xl mx-auto">
          <h3 className="text-4xl font-serif mb-8 text-center scroll-reveal-scale">
            {t("aboutTitle")}
          </h3>
          <div className="space-y-6 text-lg text-text-secondary leading-relaxed">
            <p className="scroll-reveal-left">{t("aboutPara1")}</p>
            <p
              className="scroll-reveal-right"
              style={{ transitionDelay: "100ms" }}
            >
              {t("aboutPara2")}
            </p>
            <p
              className="scroll-reveal-left"
              style={{ transitionDelay: "200ms" }}
            >
              {t("aboutPara3")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: "fa-certificate",
                title: t("licensedRN"),
                subtitle: t("stateCertified"),
              },
              {
                icon: "fa-award",
                title: t("yearsExperience"),
                subtitle: t("professionalExperience"),
              },
              {
                icon: "fa-check-double",
                title: t("cprCertified"),
                subtitle: t("advancedLifeSupport"),
              },
            ].map((credential, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-6 bg-bg-secondary rounded-xl scroll-reveal-scale"
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <div className="w-14 h-14 bg-accent-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <i
                    className={`fas ${credential.icon} text-2xl text-white`}
                  ></i>
                </div>
                <div>
                  <strong className="block font-semibold">
                    {credential.title}
                  </strong>
                  <span className="text-text-muted text-sm">
                    {credential.subtitle}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
