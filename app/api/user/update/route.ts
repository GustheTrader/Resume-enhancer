
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { firstName, lastName, companyName } = await req.json();

    if (!firstName || !lastName) {
      return NextResponse.json(
        { message: "First name and last name are required" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        companyName: companyName || null,
      },
    });

    return NextResponse.json({
      message: "Settings updated successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        name: updatedUser.name,
        companyName: updatedUser.companyName,
      },
    });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { message: "Failed to update settings" },
      { status: 500 }
    );
  }
}
