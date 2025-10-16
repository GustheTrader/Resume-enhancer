
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import jsPDF from 'jspdf';

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the enhancement
    const enhancement = await prisma.resumeEnhancement.findFirst({
      where: {
        id: params.id,
        resume: {
          userId: session.user.id,
        },
      },
      include: {
        resume: true,
      },
    });

    if (!enhancement || enhancement.status !== 'completed') {
      return NextResponse.json(
        { message: "Enhancement not found or not completed" },
        { status: 404 }
      );
    }

    // Create PDF
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;

    // Add title
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Enhanced Resume', margin, 20);

    // Add content
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    const lines = pdf.splitTextToSize(enhancement.enhancedContent, maxWidth);
    let yPosition = 35;
    const lineHeight = 5;

    for (const line of lines) {
      if (yPosition > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin, yPosition);
      yPosition += lineHeight;
    }

    // Generate PDF buffer
    const pdfBuffer = pdf.output('arraybuffer');

    // Return PDF as response
    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="enhanced-${enhancement.resume.originalName}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { message: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
