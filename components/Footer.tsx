"use client";

import { useSettings } from "@/lib/settings-context";

export default function Footer() {
  const { t } = useSettings();

  return (
    <footer className="bg-bg-card border-t border-border-color mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 gradient-warm rounded-lg flex items-center justify-center">
                <i className="fas fa-heartbeat text-xl text-white"></i>
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold">NurseHub</h3>
                <p className="text-xs text-text-muted">
                  {t("professionalHomeCare")}
                </p>
              </div>
            </div>
            <p className="text-text-secondary text-sm">
              {t("providingQuality")}
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <i className="fas fa-phone text-accent-primary"></i>
              {t("contactUs")}
            </h4>
            <div className="space-y-3">
              <a
                href="tel:+216XXXXXXX"
                className="flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors"
              >
                <i className="fas fa-mobile-alt w-5"></i>
                <span>+216 XX XXX XXX</span>
              </a>
            </div>
          </div>

          {/* Address Section */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <i className="fas fa-map-marker-alt text-accent-primary"></i>
              {t("ourLocation")}
            </h4>
            <address className="not-italic text-text-secondary text-sm">
              <p className="flex items-start gap-2">
                <i className="fas fa-home w-5 mt-1"></i>
                <span>
                  {t("darChaaben")}
                  <br />
                  {t("nabeul")}
                </span>
              </p>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border-color mt-8 pt-6 text-center text-text-muted text-sm">
          <p>
            © {new Date().getFullYear()} NurseHub. {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}
