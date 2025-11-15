import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await prisma.appointment.groupBy({
      by: ["status"],
      _count: true,
    });

    const formattedStats = {
      pending: 0,
      approved: 0,
      completed: 0,
      cancelled: 0,
    };

    stats.forEach((stat) => {
      const key = stat.status.toLowerCase() as keyof typeof formattedStats;
      formattedStats[key] = stat._count;
    });

    return NextResponse.json(formattedStats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
