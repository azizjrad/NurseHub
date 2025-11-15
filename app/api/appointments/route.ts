import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { appointmentSchema } from "@/lib/validations";
import { sendEmail, getAppointmentConfirmationEmail } from "@/lib/email";
import { sendSMS } from "@/lib/sms";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Fetch all appointments (protected)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const appointments = await prisma.appointment.findMany({
      where: status ? { status: status as any } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

// POST - Create new appointment (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = appointmentSchema.parse(body);

    const appointment = await prisma.appointment.create({
      data: {
        ...validatedData,
        status: "PENDING",
      },
    });

    // Send confirmation email
    await sendEmail({
      to: appointment.email,
      subject: "Appointment Request Received - NurseHub",
      html: getAppointmentConfirmationEmail(appointment.name, "PENDING"),
    });

    // Send SMS notification to admin
    const adminPhone = process.env.ADMIN_PHONE_NUMBER || "+21695650081";
    await sendSMS({
      to: adminPhone,
      message: `New appointment: ${appointment.name}, ${appointment.phone}. Reason: ${appointment.reason}`,
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error: any) {
    console.error("Error creating appointment:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}
