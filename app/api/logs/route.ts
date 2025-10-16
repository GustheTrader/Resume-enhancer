
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const level = searchParams.get("level");
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "100");

    // Build the where clause
    const where: any = {
      OR: [
        { userId: session.user.id },
        { userId: null }, // System-wide logs
      ],
    };

    if (level) {
      where.level = level;
    }

    if (category) {
      where.category = category;
    }

    const logs = await prisma.systemLog.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return NextResponse.json({
      logs: logs.map(log => ({
        ...log,
        metadata: log.metadata ? JSON.parse(log.metadata) : null,
        createdAt: log.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { message: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}

// Clear logs endpoint
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only delete user's own logs, not system-wide logs
    await prisma.systemLog.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      message: "Logs cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing logs:", error);
    return NextResponse.json(
      { message: "Failed to clear logs" },
      { status: 500 }
    );
  }
}
