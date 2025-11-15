import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, getAppointmentConfirmationEmail } from "@/lib/email";
import { sendSMS, getAppointmentSMSMessage } from "@/lib/sms";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

// GET - Fetch single appointment
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointment" },
      { status: 500 }
    );
  }
}

// PATCH - Update appointment status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, cancellationReason } = body;

    if (!["PENDING", "APPROVED", "COMPLETED", "CANCELLED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updateData: any = { status };
    if (status === "CANCELLED" && cancellationReason) {
      updateData.cancellationReason = cancellationReason;
    }

    const appointment = await prisma.appointment.update({
      where: { id: params.id },
      data: updateData,
    });

    // Send status update email
    await sendEmail({
      to: appointment.email,
      subject: `Appointment ${status} - NurseHub`,
      html: getAppointmentConfirmationEmail(
        appointment.name,
        status,
        status === "CANCELLED" ? cancellationReason : undefined
      ),
    });

    // Send SMS notification for APPROVED and CANCELLED statuses
    if (status === "APPROVED" || status === "CANCELLED") {
      if (appointment.phone) {
        await sendSMS({
          to: appointment.phone,
          message: getAppointmentSMSMessage(
            appointment.name,
            status,
            status === "CANCELLED" ? cancellationReason : undefined
          ),
        });
      }
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

// DELETE - Delete appointment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.appointment.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Appointment deleted" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
