"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { format } from "date-fns";

interface Appointment {
  id: string;
  name: string;
  email: string;
  address: string;
  reason: string;
  message?: string;
  status: "PENDING" | "APPROVED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
}

interface Stats {
  pending: number;
  approved: number;
  completed: number;
  cancelled: number;
}

export default function DashboardView() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<Stats>({
    pending: 0,
    approved: 0,
    completed: 0,
    cancelled: 0,
  });
  const [filter, setFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] =
    useState<string>("");
  const [cancellationReason, setCancellationReason] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string>("");

  useEffect(() => {
    fetchAppointments();
    fetchStats();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/appointments");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      toast.error("Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/appointments/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to load stats");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          cancellationReason:
            status === "CANCELLED" ? cancellationReason : undefined,
        }),
      });

      if (!response.ok) throw new Error("Failed to update");

      toast.success(`Appointment ${status.toLowerCase()}!`);
      fetchAppointments();
      fetchStats();
      setShowCancelModal(false);
      setCancellationReason("");
      setSelectedAppointmentId("");
    } catch (error) {
      toast.error("Failed to update appointment");
    }
  };

  const handleCancelClick = (id: string) => {
    setSelectedAppointmentId(id);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    if (!cancellationReason.trim()) {
      toast.error("Please provide a cancellation reason");
      return;
    }
    updateStatus(selectedAppointmentId, "CANCELLED");
  };

  const deleteAppointment = async (id: string) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Appointment deleted!");
      setShowDeleteModal(false);
      setAppointmentToDelete("");
      fetchAppointments();
      fetchStats();
    } catch (error) {
      toast.error("Failed to delete appointment");
    }
  };

  const handleDeleteClick = (id: string) => {
    setAppointmentToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (appointmentToDelete) {
      deleteAppointment(appointmentToDelete);
    }
  };

  const filteredAppointments =
    filter === "all"
      ? appointments
      : appointments.filter((apt) => apt.status === filter.toUpperCase());

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: "bg-warning/20 text-warning",
      APPROVED: "bg-success/20 text-success",
      COMPLETED: "bg-accent-secondary/20 text-accent-secondary",
      CANCELLED: "bg-danger/20 text-danger",
    };
    return colors[status as keyof typeof colors];
  };

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <i className="fas fa-spinner fa-spin text-4xl text-accent-primary mb-4"></i>
        <p className="text-text-secondary">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-4xl font-serif mb-2">Appointment Dashboard</h2>
        <p className="text-xl text-text-secondary">
          Manage your home visit schedule
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        {[
          {
            key: "pending",
            label: "Pending Requests",
            icon: "fa-clock",
            color: "warning",
          },
          {
            key: "approved",
            label: "Approved Visits",
            icon: "fa-check-circle",
            color: "success",
          },
          {
            key: "completed",
            label: "Completed Visits",
            icon: "fa-clipboard-check",
            color: "accent-secondary",
          },
          {
            key: "cancelled",
            label: "Cancelled",
            icon: "fa-times-circle",
            color: "danger",
          },
        ].map((stat) => (
          <div
            key={stat.key}
            className="bg-bg-card border border-border-color rounded-2xl p-6 hover:transform hover:-translate-y-1 transition-all shadow-sm"
          >
            <div
              className={`w-14 h-14 bg-${stat.color}/15 rounded-xl flex items-center justify-center mb-4`}
            >
              <i className={`fas ${stat.icon} text-2xl text-${stat.color}`}></i>
            </div>
            <div className="text-4xl font-serif font-bold mb-1">
              {stats[stat.key as keyof Stats]}
            </div>
            <div className="text-text-secondary font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Appointments List */}
      <div className="bg-bg-card border border-border-color rounded-3xl p-8 shadow-md">
        <div className="flex flex-wrap justify-between items-center mb-8 pb-6 border-b-2 border-border-color gap-4">
          <h3 className="text-2xl font-serif">All Appointments</h3>
          <div className="flex flex-wrap gap-3">
            {["all", "pending", "approved", "completed", "cancelled"].map(
              (f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                    filter === f
                      ? "bg-accent-primary text-white"
                      : "border-2 border-border-color text-text-secondary hover:border-accent-primary"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              )
            )}
          </div>
        </div>

        <div className="space-y-5">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-16">
              <i className="fas fa-calendar-times text-6xl text-text-muted mb-6"></i>
              <h3 className="text-2xl font-serif mb-2 text-text-secondary">
                No appointments found
              </h3>
              <p className="text-text-muted text-lg">
                There are no appointments matching your current filter.
              </p>
            </div>
          ) : (
            filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-bg-secondary border-2 border-border-color rounded-2xl p-6 hover:border-accent-tertiary transition-all"
              >
                <div className="flex flex-wrap justify-between items-start mb-5">
                  <div>
                    <h4 className="text-2xl font-serif font-bold mb-1">
                      {apt.name}
                    </h4>
                    <p className="text-text-muted flex items-center gap-2">
                      <i className="fas fa-envelope"></i>
                      {apt.email}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wide ${getStatusColor(
                      apt.status
                    )}`}
                  >
                    {apt.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-5 mb-5">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-bg-card rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-map-marker-alt text-accent-primary"></i>
                    </div>
                    <div>
                      <div className="text-xs text-text-muted uppercase tracking-wide font-semibold mb-1">
                        Address
                      </div>
                      <div className="font-medium">{apt.address}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-bg-card rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-stethoscope text-accent-primary"></i>
                    </div>
                    <div>
                      <div className="text-xs text-text-muted uppercase tracking-wide font-semibold mb-1">
                        Reason
                      </div>
                      <div className="font-medium">{apt.reason}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-bg-card rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-calendar text-accent-primary"></i>
                    </div>
                    <div>
                      <div className="text-xs text-text-muted uppercase tracking-wide font-semibold mb-1">
                        Submitted
                      </div>
                      <div className="font-medium">
                        {format(new Date(apt.createdAt), "MMM dd, yyyy")}
                      </div>
                      <div className="text-sm text-text-muted">
                        {format(new Date(apt.createdAt), "h:mm a")}
                      </div>
                    </div>
                  </div>
                </div>

                {apt.message && (
                  <div className="bg-bg-card p-4 rounded-xl mb-5 border-l-4 border-accent-primary">
                    <p className="text-text-secondary leading-relaxed">
                      <strong>Additional Information:</strong>
                      <br />
                      {apt.message}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  {apt.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => updateStatus(apt.id, "APPROVED")}
                        className="px-6 py-3 bg-success text-white rounded-xl font-semibold hover:opacity-90 transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
                      >
                        <i className="fas fa-check"></i> Approve
                      </button>
                      <button
                        onClick={() => handleCancelClick(apt.id)}
                        className="px-6 py-3 bg-danger text-white rounded-xl font-semibold hover:opacity-90 transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
                      >
                        <i className="fas fa-times"></i> Cancel
                      </button>
                    </>
                  )}
                  {apt.status === "APPROVED" && (
                    <>
                      <button
                        onClick={() => updateStatus(apt.id, "COMPLETED")}
                        className="px-6 py-3 bg-accent-secondary text-white rounded-xl font-semibold hover:opacity-90 transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
                      >
                        <i className="fas fa-clipboard-check"></i> Mark Complete
                      </button>
                      <button
                        onClick={() => handleCancelClick(apt.id)}
                        className="px-6 py-3 bg-danger text-white rounded-xl font-semibold hover:opacity-90 transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
                      >
                        <i className="fas fa-times"></i> Cancel
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDeleteClick(apt.id)}
                    className="px-6 py-3 bg-bg-primary text-text-secondary border-2 border-border-color rounded-xl font-semibold hover:bg-danger hover:text-white hover:border-danger transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-bg-card rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-border-color animate-slide-up">
            <div className="w-16 h-16 bg-danger/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-times-circle text-3xl text-danger"></i>
            </div>
            <h3 className="text-2xl font-serif mb-4 text-center">
              Cancel Appointment
            </h3>
            <p className="text-text-secondary text-center mb-6">
              Please provide a reason for cancelling this appointment. This will
              be sent to the client.
            </p>

            <div className="mb-6">
              <label className="block mb-3 font-semibold text-text-primary">
                <i className="fas fa-comment me-2 text-danger"></i>
                Cancellation Reason
                <span className="text-danger ml-1">*</span>
              </label>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-border-color rounded-xl bg-bg-primary focus:outline-none focus:border-danger transition-colors resize-vertical"
                placeholder="e.g., Schedule conflict, Emergency, Unable to provide service at this time..."
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancellationReason("");
                  setSelectedAppointmentId("");
                }}
                className="flex-1 px-6 py-3 bg-bg-secondary text-text-primary border-2 border-border-color rounded-xl font-semibold hover:bg-bg-primary transition-all"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={!cancellationReason.trim()}
                className="flex-1 px-6 py-3 bg-danger text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-check me-2"></i>
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-bg-card rounded-3xl p-10 max-w-md w-full mx-4 shadow-2xl border-2 border-danger/30 animate-slide-up">
            <div className="w-20 h-20 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <i className="fas fa-exclamation-triangle text-4xl text-danger"></i>
            </div>
            <h3 className="text-3xl font-serif mb-4 text-center text-text-primary">
              Delete Appointment?
            </h3>
            <p className="text-text-secondary text-center mb-8 text-lg leading-relaxed">
              This action cannot be undone. The appointment will be permanently
              removed from the system.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setAppointmentToDelete("");
                }}
                className="flex-1 px-6 py-4 bg-bg-secondary text-text-primary border-2 border-border-color rounded-xl font-semibold hover:bg-bg-primary transition-all"
              >
                <i className="fas fa-arrow-left me-2"></i>
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-6 py-4 bg-danger text-white rounded-xl font-bold hover:bg-danger/90 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
              >
                <i className="fas fa-trash me-2"></i>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
