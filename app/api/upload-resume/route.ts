
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { uploadFile } from "@/lib/s3";
import { parseDocxFile, parseDocFile, parsePdfFile } from "@/lib/document-parser";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Invalid file type. Please upload PDF, DOC, or DOCX files only." },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to S3
    const cloudStoragePath = await uploadFile(buffer, file.name);

    // Parse document content
    let originalContent = "";
    let fileType = "";

    try {
      if (file.type === 'application/pdf') {
        fileType = 'pdf';
        originalContent = await parsePdfFile(buffer);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        fileType = 'docx';
        originalContent = await parseDocxFile(buffer);
      } else if (file.type === 'application/msword') {
        fileType = 'doc';
        originalContent = await parseDocFile(buffer);
      }
    } catch (parseError: any) {
      console.error("Document parsing error:", parseError);
      return NextResponse.json(
        { 
          message: parseError?.message || "Failed to parse document content",
          error: "PARSE_ERROR"
        },
        { status: 400 }
      );
    }

    // Verify we have content
    if (!originalContent || originalContent.trim().length === 0) {
      return NextResponse.json(
        { 
          message: "No text content could be extracted from the file. Please ensure the file contains readable text.",
          error: "NO_CONTENT"
        },
        { status: 400 }
      );
    }

    // Save to database
    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        originalName: file.name,
        cloudStoragePath,
        fileType,
        originalContent,
        status: "uploaded",
      },
    });

    return NextResponse.json({
      message: "Resume uploaded successfully",
      resumeId: resume.id,
      resume: {
        id: resume.id,
        originalName: resume.originalName,
        status: resume.status,
        createdAt: resume.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { 
        message: error?.message || "Failed to upload resume",
        error: "UPLOAD_ERROR"
      },
      { status: 500 }
    );
  }
}
