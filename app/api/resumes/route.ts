
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

    const resumes = await prisma.resume.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        enhancements: {
          select: {
            id: true,
            enhancementType: true,
            status: true,
            llmProvider: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      resumes: resumes.map(resume => ({
        ...resume,
        createdAt: resume.createdAt.toISOString(),
        updatedAt: resume.updatedAt.toISOString(),
        enhancements: resume.enhancements.map(enhancement => ({
          ...enhancement,
          createdAt: enhancement.createdAt.toISOString(),
        })),
      })),
    });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return NextResponse.json(
      { message: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}
