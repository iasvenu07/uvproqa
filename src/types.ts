export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  timestamp: string;
  status: "new" | "reviewed" | "archived";
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  role: "Guest" | "Lead" | "Admin";
  user: string;
  ip: string;
  status: "Success" | "Failed" | "Warning";
  details: string;
}

export interface SystemMetrics {
  cpu: string;
  memory: string;
  latency: string;
  activeConnections: number;
  databaseStatus: string;
  apiGateway: string;
  securityCompliance: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
