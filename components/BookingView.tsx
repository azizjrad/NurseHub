"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema, type AppointmentFormData } from "@/lib/validations";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSettings } from "@/lib/settings-context";

export default function BookingView() {
  const { t } = useSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [phoneValue, setPhoneValue] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Remove all non-numeric characters except +
    value = value.replace(/[^\d+]/g, "");

    // If user tries to delete the +216, prevent it
    if (!value.startsWith("+216")) {
      value = "+216" + value.replace(/\+/g, "").replace(/^216/, "");
    }

    setPhoneValue(value);
    setValue("phone", value);
  };

  const onSubmit = async (data: AppointmentFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create appointment");
      }

      setShowSuccess(true);
      reset();
      setPhoneValue(""); // Reset phone value
      toast.success(t("appointmentSuccess"));

      // Hide success modal after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      toast.error(t("appointmentError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-serif mb-4">{t("scheduleVisit")}</h2>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          {t("bookingSubtitle")}
        </p>
      </div>

      <div className="max-w-3xl mx-auto bg-bg-card rounded-3xl p-10 shadow-lg border border-border-color">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <label className="block mb-3 font-semibold text-text-primary">
              <i className="fas fa-user text-accent-primary mr-2"></i>
              {t("fullName")}
              <span className="text-danger ml-1">{t("required")}</span>
            </label>
            <input
              {...register("name")}
              type="text"
              className={`w-full px-5 py-4 border-2 rounded-xl bg-bg-primary focus:outline-none transition-colors text-lg ${
                errors.name
                  ? "border-danger focus:border-danger"
                  : "border-border-color focus:border-accent-primary"
              }`}
              placeholder={t("namePlaceholder")}
            />
            {errors.name && (
              <p className="text-danger text-sm mt-2 flex items-center gap-1">
                <i className="fas fa-exclamation-circle"></i>
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-3 font-semibold text-text-primary">
              <i className="fas fa-envelope text-accent-primary mr-2"></i>
              {t("emailAddress")}
              <span className="text-danger ml-1">{t("required")}</span>
            </label>
            <input
              {...register("email")}
              type="email"
              className={`w-full px-5 py-4 border-2 rounded-xl bg-bg-primary focus:outline-none transition-colors text-lg ${
                errors.email
                  ? "border-danger focus:border-danger"
                  : "border-border-color focus:border-accent-primary"
              }`}
              placeholder={t("emailPlaceholder")}
            />
            {errors.email && (
              <p className="text-danger text-sm mt-2 flex items-center gap-1">
                <i className="fas fa-exclamation-circle"></i>
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-3 font-semibold text-text-primary">
              <i className="fas fa-phone text-accent-primary mr-2"></i>
              {t("phoneNumber")}
              <span className="text-danger ml-1">{t("required")}</span>
            </label>
            <input
              type="tel"
              value={phoneValue}
              onChange={handlePhoneChange}
              onFocus={(e) => {
                if (!phoneValue) {
                  setPhoneValue("+216");
                  setValue("phone", "+216");
                }
              }}
              className={`w-full px-5 py-4 border-2 rounded-xl bg-bg-primary focus:outline-none transition-colors text-lg ${
                errors.phone
                  ? "border-danger focus:border-danger"
                  : "border-border-color focus:border-accent-primary"
              }`}
              placeholder="+216 12 345 678"
            />
            {errors.phone && (
              <p className="text-danger text-sm mt-2 flex items-center gap-1">
                <i className="fas fa-exclamation-circle"></i>
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-3 font-semibold text-text-primary">
              <i className="fas fa-map-marker-alt text-accent-primary mr-2"></i>
              {t("homeAddress")}
              <span className="text-danger ml-1">{t("required")}</span>
            </label>
            <input
              {...register("address")}
              type="text"
              className={`w-full px-5 py-4 border-2 rounded-xl bg-bg-primary focus:outline-none transition-colors text-lg ${
                errors.address
                  ? "border-danger focus:border-danger"
                  : "border-border-color focus:border-accent-primary"
              }`}
              placeholder={t("addressPlaceholder")}
            />
            {errors.address && (
              <p className="text-danger text-sm mt-2 flex items-center gap-1">
                <i className="fas fa-exclamation-circle"></i>
                {errors.address.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-3 font-semibold text-text-primary">
              <i className="fas fa-stethoscope text-accent-primary mr-2"></i>
              {t("reasonForConsultation")}
              <span className="text-danger ml-1">{t("required")}</span>
            </label>
            <input
              {...register("reason")}
              type="text"
              className={`w-full px-5 py-4 border-2 rounded-xl bg-bg-primary focus:outline-none transition-colors text-lg ${
                errors.reason
                  ? "border-danger focus:border-danger"
                  : "border-border-color focus:border-accent-primary"
              }`}
              placeholder={t("reasonPlaceholder")}
            />
            {errors.reason && (
              <p className="text-danger text-sm mt-2 flex items-center gap-1">
                <i className="fas fa-exclamation-circle"></i>
                {errors.reason.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-3 font-semibold text-text-primary">
              <i className="fas fa-comment-medical text-accent-primary mr-2"></i>
              {t("additionalInfo")}
              <span className="text-text-muted ml-1 text-sm font-normal">
                {t("optional")}
              </span>
            </label>
            <textarea
              {...register("message")}
              rows={5}
              className="w-full px-5 py-4 border-2 border-border-color rounded-xl bg-bg-primary focus:outline-none focus:border-accent-primary transition-colors text-lg resize-vertical"
              placeholder={t("messagePlaceholder")}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 gradient-warm text-white rounded-xl font-bold text-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                {t("submitting")}
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane mr-2"></i>
                {t("requestAppointment")}
              </>
            )}
          </button>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-bg-card rounded-3xl p-12 max-w-md w-full mx-4 shadow-2xl border border-border-color text-center animate-slide-up">
            <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-check text-4xl text-success"></i>
            </div>
            <h3 className="text-3xl font-serif mb-4">
              {t("requestSubmitted")}
            </h3>
            <p className="text-text-secondary text-lg mb-8">
              {t("submittedMessage")}
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="px-10 py-4 gradient-warm text-white rounded-xl font-semibold hover:shadow-md transition-all"
            >
              {t("gotIt")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
