
// System logging utility for diagnostics

import { prisma } from "@/lib/db";

export type LogLevel = "error" | "warning" | "info" | "debug";
export type LogCategory = "api_key" | "resume_enhancement" | "auth" | "system" | "database" | "file_upload";

interface LogOptions {
  userId?: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  metadata?: Record<string, any>;
}

export async function createLog(options: LogOptions) {
  try {
    await prisma.systemLog.create({
      data: {
        userId: options.userId,
        level: options.level,
        category: options.category,
        message: options.message,
        metadata: options.metadata ? JSON.stringify(options.metadata) : null,
      },
    });
  } catch (error) {
    // Fallback to console if database logging fails
    console.error("[Logger] Failed to create log:", error);
    console.log("[Logger]", options);
  }
}

// Helper functions for different log levels
export const logger = {
  error: (category: LogCategory, message: string, metadata?: Record<string, any>, userId?: string) =>
    createLog({ level: "error", category, message, metadata, userId }),

  warning: (category: LogCategory, message: string, metadata?: Record<string, any>, userId?: string) =>
    createLog({ level: "warning", category, message, metadata, userId }),

  info: (category: LogCategory, message: string, metadata?: Record<string, any>, userId?: string) =>
    createLog({ level: "info", category, message, metadata, userId }),

  debug: (category: LogCategory, message: string, metadata?: Record<string, any>, userId?: string) =>
    createLog({ level: "debug", category, message, metadata, userId }),
};
