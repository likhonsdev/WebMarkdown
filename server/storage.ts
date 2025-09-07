import { type User, type InsertUser, type Conversion, type InsertConversion, type ActivityLog, type InsertActivityLog, type ServerStats, type McpConnection } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Conversions
  getConversion(id: string): Promise<Conversion | undefined>;
  createConversion(conversion: InsertConversion): Promise<Conversion>;
  updateConversion(id: string, updates: Partial<Conversion>): Promise<Conversion | undefined>;
  getRecentConversions(limit?: number): Promise<Conversion[]>;

  // Activity Logs
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  getRecentActivityLogs(limit?: number): Promise<ActivityLog[]>;

  // Server Stats
  getServerStats(): Promise<ServerStats | undefined>;
  updateServerStats(stats: Partial<ServerStats>): Promise<ServerStats>;

  // MCP Connections
  createMcpConnection(connection: Omit<McpConnection, 'id' | 'connectedAt'>): Promise<McpConnection>;
  updateMcpConnection(id: string, updates: Partial<McpConnection>): Promise<McpConnection | undefined>;
  getActiveMcpConnections(): Promise<McpConnection[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private conversions: Map<string, Conversion>;
  private activityLogs: Map<string, ActivityLog>;
  private serverStats: ServerStats | null;
  private mcpConnections: Map<string, McpConnection>;

  constructor() {
    this.users = new Map();
    this.conversions = new Map();
    this.activityLogs = new Map();
    this.mcpConnections = new Map();
    this.serverStats = {
      id: randomUUID(),
      totalConversions: 0,
      activeConnections: 0,
      averageResponseTime: 245,
      successRate: 99,
      cpuUsage: 12,
      memoryUsage: 256,
      updatedAt: new Date(),
    };
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getConversion(id: string): Promise<Conversion | undefined> {
    return this.conversions.get(id);
  }

  async createConversion(conversion: InsertConversion): Promise<Conversion> {
    const id = randomUUID();
    const newConversion: Conversion = {
      ...conversion,
      id,
      status: "pending",
      markdown: null,
      title: null,
      errorMessage: null,
      createdAt: new Date(),
      completedAt: null,
      includeImages: conversion.includeImages ?? false,
      cleanHtml: conversion.cleanHtml ?? false,
    };
    this.conversions.set(id, newConversion);
    return newConversion;
  }

  async updateConversion(id: string, updates: Partial<Conversion>): Promise<Conversion | undefined> {
    const existing = this.conversions.get(id);
    if (!existing) return undefined;

    const updated: Conversion = { ...existing, ...updates };
    this.conversions.set(id, updated);
    return updated;
  }

  async getRecentConversions(limit = 10): Promise<Conversion[]> {
    return Array.from(this.conversions.values())
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, limit);
  }

  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const id = randomUUID();
    const newLog: ActivityLog = {
      ...log,
      id,
      createdAt: new Date(),
      metadata: log.metadata ?? null,
    };
    this.activityLogs.set(id, newLog);
    return newLog;
  }

  async getRecentActivityLogs(limit = 50): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values())
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, limit);
  }

  async getServerStats(): Promise<ServerStats | undefined> {
    return this.serverStats || undefined;
  }

  async updateServerStats(stats: Partial<ServerStats>): Promise<ServerStats> {
    if (!this.serverStats) {
      this.serverStats = {
        id: randomUUID(),
        totalConversions: 0,
        activeConnections: 0,
        averageResponseTime: 0,
        successRate: 0,
        cpuUsage: 0,
        memoryUsage: 0,
        updatedAt: new Date(),
      };
    }

    this.serverStats = {
      ...this.serverStats,
      ...stats,
      updatedAt: new Date(),
    };

    return this.serverStats;
  }

  async createMcpConnection(connection: Omit<McpConnection, 'id' | 'connectedAt'>): Promise<McpConnection> {
    const id = randomUUID();
    const newConnection: McpConnection = {
      ...connection,
      id,
      connectedAt: new Date(),
      disconnectedAt: null,
    };
    this.mcpConnections.set(id, newConnection);
    return newConnection;
  }

  async updateMcpConnection(id: string, updates: Partial<McpConnection>): Promise<McpConnection | undefined> {
    const existing = this.mcpConnections.get(id);
    if (!existing) return undefined;

    const updated: McpConnection = { ...existing, ...updates };
    this.mcpConnections.set(id, updated);
    return updated;
  }

  async getActiveMcpConnections(): Promise<McpConnection[]> {
    return Array.from(this.mcpConnections.values())
      .filter(conn => conn.status === 'connected');
  }
}

export const storage = new MemStorage();
