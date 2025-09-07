import { storage } from "../storage";
import type { InsertActivityLog } from "@shared/schema";

export class Logger {
  async log(type: 'info' | 'success' | 'warning' | 'error', message: string, metadata?: any) {
    const logEntry: InsertActivityLog = {
      type,
      message,
      metadata: metadata || null,
    };

    try {
      await storage.createActivityLog(logEntry);
      console.log(`[${type.toUpperCase()}] ${message}`, metadata || '');
    } catch (error) {
      console.error('Failed to write log entry:', error);
    }
  }

  async info(message: string, metadata?: any) {
    return this.log('info', message, metadata);
  }

  async success(message: string, metadata?: any) {
    return this.log('success', message, metadata);
  }

  async warning(message: string, metadata?: any) {
    return this.log('warning', message, metadata);
  }

  async error(message: string, metadata?: any) {
    return this.log('error', message, metadata);
  }
}

export const logger = new Logger();
