import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const conversions = pgTable("conversions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  url: text("url").notNull(),
  markdown: text("markdown"),
  title: text("title"),
  includeImages: boolean("include_images").default(false),
  cleanHtml: boolean("clean_html").default(false),
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const serverStats = pgTable("server_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalConversions: integer("total_conversions").default(0),
  activeConnections: integer("active_connections").default(0),
  averageResponseTime: integer("average_response_time").default(0),
  successRate: integer("success_rate").default(0),
  cpuUsage: integer("cpu_usage").default(0),
  memoryUsage: integer("memory_usage").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const activityLogs = pgTable("activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // info, success, warning, error
  message: text("message").notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const mcpConnections = pgTable("mcp_connections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: text("client_id").notNull(),
  transport: text("transport").notNull(), // websocket, http
  status: text("status").notNull().default("connected"), // connected, disconnected
  connectedAt: timestamp("connected_at").defaultNow(),
  disconnectedAt: timestamp("disconnected_at"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertConversionSchema = createInsertSchema(conversions).pick({
  url: true,
  includeImages: true,
  cleanHtml: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).pick({
  type: true,
  message: true,
  metadata: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertConversion = z.infer<typeof insertConversionSchema>;
export type Conversion = typeof conversions.$inferSelect;

export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;

export type ServerStats = typeof serverStats.$inferSelect;
export type McpConnection = typeof mcpConnections.$inferSelect;

// API Response types
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type ConversionRequest = {
  url: string;
  includeImages?: boolean;
  cleanHtml?: boolean;
};

export type ServerStatus = {
  protocolStatus: 'active' | 'inactive';
  websocketStatus: 'connected' | 'disconnected';
  httpStatus: 'available' | 'unavailable';
  rateLimitingStatus: 'active' | 'inactive';
};
