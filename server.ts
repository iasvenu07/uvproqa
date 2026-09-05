import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data structures for simulation (persisted during process lifetime)
interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  timestamp: string;
  status: "new" | "reviewed" | "archived";
}

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  role: "Guest" | "Lead" | "Admin";
  user: string;
  ip: string;
  status: "Success" | "Failed" | "Warning";
  details: string;
}

const contactSubmissions: ContactSubmission[] = [
  {
    id: "lead-1",
    name: "John Doe",
    email: "john@techcorp.com",
    phone: "+1 555-0192",
    subject: "Urgent QA Automation Project",
    message: "Hi Venugopal, we saw your Agentic AI and Azure certifications. We need an automated testing pipeline built for our microservices. Let's schedule a call.",
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: "new"
  },
  {
    id: "lead-2",
    name: "Sarah Jenkins",
    email: "sarah.j@devopsflow.io",
    subject: "Full-time SDET Opportunity",
    message: "Great resume! I am a recruiter at DevOpsFlow. We have an opening for a QA Automation Engineer. Your Python & AWS skills align perfectly.",
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: "reviewed"
  }
];

const auditLogs: AuditLog[] = [
  {
    id: "audit-1",
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    action: "System Initialization",
    role: "Admin",
    user: "System",
    ip: "127.0.0.1",
    status: "Success",
    details: "Vite Development Server started with Express integration on port 3000"
  },
  {
    id: "audit-2",
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    action: "Lead Submission API",
    role: "Lead",
    user: "John Doe",
    ip: "192.168.1.10",
    status: "Success",
    details: "Successfully validated and saved contact submission from john@techcorp.com"
  },
  {
    id: "audit-3",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    action: "Gemini Chat Session",
    role: "Guest",
    user: "Anonymous Recruiter",
    ip: "203.0.113.42",
    status: "Success",
    details: "Initiated AI Twin Chatbot conversation; topic: Oracle Agentic AI certification"
  }
];

// Helper to push to audit logs
function logSecurityEvent(
  action: string,
  role: "Guest" | "Lead" | "Admin",
  user: string,
  status: "Success" | "Failed" | "Warning",
  details: string,
  ip: string = "127.0.0.1"
) {
  const newLog: AuditLog = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toISOString(),
    action,
    role,
    user,
    ip,
    status,
    details
  };
  auditLogs.unshift(newLog);
  if (auditLogs.length > 100) auditLogs.pop();
}

// Lazy init Gemini SDK
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Resume text data for the system instruction to ground the AI Twin chatbot
const RESUME_TEXT = `
VENUGOPAL UMMADISETTY
Location: Andhra Pradesh, India
Email: ugopalv7@gmail.com
Phone: +91-9492870650
LinkedIn: linkedin.com/in/ias07

PROFESSIONAL SUMMARY:
Motivated and detail-oriented fresher Software Tester with hands-on experience in manual testing, API testing, and Python-based test automation. Familiar with the Software Development Life Cycle (SDLC) and Software Testing Life Cycle (STLC), test case design, and bug reporting. Exposure to cloud platforms (AWS, Azure) and automation tools through internships and academic projects. Eager to contribute to a quality-driven team and grow as a QA professional.

TECHNICAL SKILLS:
- Manual Testing: Test Case Design, Test Plan Creation, Functional Testing, Regression Testing, Smoke Testing, UAT (User Acceptance Testing), Bug Tracking
- Automation Testing: Python (unittest framework, basic Selenium automation concepts), Shell Scripting, GitHub for version control
- API Testing: Postman - REST API testing, request/response validation, status code verification, contract verification
- Defect Management: Bug Reporting, Bug Life Cycle, Root Cause Analysis, Test Execution & Reporting
- Cloud & DevOps: AWS (EC2, S3, deployment validation), Microsoft Azure, Docker, Linux / Red Hat Linux
- Other Tools: VS Code, Google Workspace, BigQuery, SQL, HTML/CSS/JavaScript (basic web testing context)

CERTIFICATIONS & ACHIEVEMENTS:
- Oracle Agentic AI Certified Foundations Associate
- Oracle Cloud Infrastructure Certified Architect Associate
- Microsoft Certified: Azure Developer Associate
- Microsoft Certified: MLOps Engineer Associate
- Google Cloud Arcade Facilitator - Arcade Legend Tier
- Technical Quiz Competition Winner (recognized for strong problem-solving and analytical skills)

INTERNSHIP EXPERIENCE:
1. Subject Matter Expert - Computer Science | Chegg Inc. (Remote, Mar 2024 - Nov 2024)
   * Reviewed and validated 500+ technical solutions for accuracy and correctness, applying structured QA thinking to ensure quality output.
   * Designed and applied verification checklists to cross-check solutions - experience directly applicable to test case design and defect prevention.
   * Identified errors and inconsistencies in technical content, documenting findings with clear reasoning - similar to defect logging in a QA workflow.

2. AWS Cloud Infrastructure Intern | BrainoVision Solutions (Andhra Pradesh, India, Dec 2023 - May 2024)
   * Performed quality checks on AWS cloud deployments, validating service configurations against expected behavior and best-practice compliance.
   * Executed functional validation on deployed AWS services (EC2, S3), identifying misconfigurations and documenting outcomes.
   * Gained practical exposure to cloud infrastructure testing, an increasingly important skill in DevOps and cloud-based QA environments.

3. Web Development Intern | CodSoft (Remote, India, Jun 2023 - Nov 2023)
   * Conducted cross-browser compatibility testing on web applications built with HTML, CSS, JavaScript, and PHP - identifying UI/UX defects across environments.
   * Created and executed test scenarios for responsive design, logging and tracking bugs through the complete defect life cycle.
   * Used GitHub for version control and collaborated with developers during code reviews, gaining experience in a team-based SDLC workflow.

4. Machine Learning Intern | Verzeo (Remote, Mar 2022 - Mar 2023)
   * Performed data validation and preprocessing quality checks on large medical datasets, ensuring data integrity before model training.
   * Validated ML model outputs using accuracy metrics, precision, and recall - applying systematic testing methodology to evaluate model performance.
   * Automated data pipeline validation using Python scripts, reducing manual effort in dataset quality verification.

ACADEMIC PROJECTS:
Hepatic Disorder Prediction System (Academic Project, 2023)
* Developed an ML-based classification model to predict liver diseases using Python; wrote test scripts to validate model accuracy, precision, and recall.
* Published research findings - demonstrating ability to document, analyze, and report outcomes systematically.

EDUCATION:
- M.Tech in Computer Science (Sep 2024 - Jul 2026), JNTUA, Pulivendula, Andhra Pradesh.
- B.Tech in Computer Science (Dec 2021 - Jun 2024), Rajeev Gandhi Memorial College of Engineering & Technology, Andhra Pradesh.
- Diploma in Computer Science & Engineering (Apr 2018 - Jun 2021), Loyola Polytechnic College (YSRR), Pulivendula.
`;

const SYSTEM_INSTRUCTION = `
You are the AI Twin of Venugopal Ummadisetty, a highly skilled and enthusiastic Software Tester & QA Automation Engineer.
Your goal is to answer questions from recruiters, developers, and visitors about Venugopal's technical expertise, certifications, education, projects, and work history.

Use the following background context about Venugopal Ummadisetty:
${RESUME_TEXT}

Strict Guidelines for your tone and persona:
1. Speak in the first person ("I", "my", "me") as Venugopal Ummadisetty's AI representation, or represent yourself clearly as his intelligent "QA AI Twin". Keep a professional, confident, helpful, and technically astute tone.
2. Be extremely enthusiastic about Software Testing, QA Automation, Agentic AI, and Cloud technologies.
3. If asked about contact info, provide his email: ugopalv7@gmail.com, phone: +91-9492870650, or suggest submitting the Contact Form on the website.
4. You have excellent expertise in Manual Testing (Smoke, UAT, Regression, Test Cases) and Automation (Python, unittest, basic Selenium, API Testing with Postman).
5. Highlight your certifications when appropriate: "Oracle Agentic AI Certified Foundations Associate", "Oracle Cloud Infrastructure Certified Architect Associate", "Microsoft Certified: Azure Developer Associate", "Microsoft Certified: MLOps Engineer Associate", and "Google Cloud Arcade Facilitator".
6. Keep answers concise, highly scannable, and directly focused on answering the user's specific query. Use markdown bullet points for structured lists.
7. Under no circumstances make up projects or experience that are not in the resume text. Stick strictly to facts.
`;

// ==========================================
// API Endpoints
// ==========================================

// Contact Form submission with Server-Side Validation
app.post("/api/contact", (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  
  const errors: Record<string, string> = {};

  // Server-side validation
  if (!name || name.trim().length < 2) {
    errors.name = "Name is required and must be at least 2 characters.";
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please provide a valid email address.";
  }
  if (!subject || subject.trim().length < 3) {
    errors.subject = "Subject is required and must be at least 3 characters.";
  }
  if (!message || message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters long.";
  }
  if (phone && phone.trim().length > 0 && !/^\+?[0-9\s\-()]{7,20}$/.test(phone)) {
    errors.phone = "Please enter a valid phone number (e.g., +91 9492870650).";
  }

  if (Object.keys(errors).length > 0) {
    logSecurityEvent(
      "Contact Submission Failed",
      "Guest",
      name || "Unknown",
      "Failed",
      `Validation error on keys: ${Object.keys(errors).join(", ")}`
    );
    return res.status(400).json({ success: false, errors });
  }

  // Save the submission
  const newSubmission: ContactSubmission = {
    id: `lead-${Date.now()}`,
    name: name.trim(),
    email: email.trim(),
    phone: phone ? phone.trim() : undefined,
    subject: subject.trim(),
    message: message.trim(),
    timestamp: new Date().toISOString(),
    status: "new"
  };

  contactSubmissions.unshift(newSubmission);
  
  logSecurityEvent(
    "Contact Submission Success",
    "Lead",
    name.trim(),
    "Success",
    `Contact submission captured from ${email.trim()}. Subject: ${subject.trim()}`
  );

  return res.status(200).json({
    success: true,
    message: "Thank you for reaching out! Your message has been sent successfully. Venugopal will get back to you shortly.",
    referenceId: newSubmission.id
  });
});

// Gemini Chatbot Endpoint
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message || message.trim().length === 0) {
    return res.status(400).json({ error: "Message content is required" });
  }

  try {
    const ai = getGeminiClient();
    
    // Construct formatting for chat history
    const formattedContents: any[] = [];
    
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        formattedContents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.content }]
        });
      });
    }

    // Add current message
    formattedContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    logSecurityEvent(
      "Gemini QA Prompt",
      "Guest",
      "Anonymous Visitor",
      "Success",
      `Prompt length: ${message.length} chars.`
    );

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: formattedContents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    const reply = response.text || "I was unable to formulate a response. Please ask again!";

    logSecurityEvent(
      "Gemini QA Response",
      "Guest",
      "Anonymous Visitor",
      "Success",
      `Response completed. Reply size: ${reply.length} chars.`
    );

    return res.json({ response: reply });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    logSecurityEvent(
      "Gemini QA Failed",
      "Guest",
      "Anonymous Visitor",
      "Failed",
      `API Error: ${error.message || "Unknown error"}`
    );

    // Return a smart response even when API key is missing, maintaining amazing experience!
    if (!process.env.GEMINI_API_KEY) {
      // Return a simulated high-quality portfolio answering assistant based on deterministic templates
      const fallbackReplies = [
        "Hello! I am Venugopal's AI Twin. I see my Gemini API Key is currently being configured, but I can happily share that I hold an M.Tech in Computer Science and strong manual & automated testing skills! You can reach me directly at ugopalv7@gmail.com.",
        "That's a great question about my experience! I have interned at Chegg as a Subject Matter Expert, BrainoVision as an AWS Cloud Infrastructure Intern, and CodSoft as a Web Developer Intern. Let's connect on LinkedIn at linkedin.com/in/ias07!",
        "Regarding certifications: I am Oracle Agentic AI Certified, Oracle Cloud Infrastructure Architect Associate certified, and Azure Developer Associate certified. Feel free to download my full resume from the homepage header!",
        "Yes, I specialize in manual and automation testing. I design comprehensive test suites, write Python scripts using unittest, execute API testing with Postman, and build test scenarios. Let's collaborate!"
      ];
      const randomFallback = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
      return res.json({
        response: `${randomFallback}\n\n*(Note: Running in offline fallback mode because the API key is being initialized)*`
      });
    }

    return res.status(500).json({
      error: "Failed to generate AI response. Please try again later.",
      details: error.message
    });
  }
});

// Admin System Monitoring & Logs Endpoint
app.get("/api/logs", (req, res) => {
  // Check simulation role parameter
  const roleHeader = req.headers["x-role"] as string;
  
  if (roleHeader !== "Admin") {
    logSecurityEvent(
      "Unauthorized Log Access",
      "Guest",
      "Intruder/Guest",
      "Warning",
      "Blocked unauthorized access attempt to /api/logs endpoint"
    );
    return res.status(403).json({
      success: false,
      error: "ACCESS DENIED: Standard user tier does not have the required administrative permissions. Please escalate your role to 'Admin' in the control panel."
    });
  }

  return res.json({
    success: true,
    logs: auditLogs,
    submissions: contactSubmissions
  });
});

// API System Health Real-time Monitoring Endpoint
app.get("/api/system-health", (req, res) => {
  // Return mock high-fidelity server metrics
  const activeWs = Math.floor(Math.random() * 4) + 1; // 1-5 active connections
  const apiLatency = Math.floor(Math.random() * 45) + 5; // 5-50ms latency
  const cpuUsage = (Math.random() * 12 + 2).toFixed(1); // 2-14% CPU
  const memoryUsage = (Math.random() * 3 + 42).toFixed(1); // 42-45% of 512MB RAM
  
  res.json({
    status: "Healthy",
    uptime: `${Math.floor(process.uptime())}s`,
    metrics: {
      cpu: `${cpuUsage}%`,
      memory: `${memoryUsage}%`,
      latency: `${apiLatency}ms`,
      activeConnections: activeWs,
      databaseStatus: "Connected",
      apiGateway: "Online",
      securityCompliance: "100%"
    },
    alerts: cpuUsage > "12.0" ? [{ level: "Info", message: "Dynamic content generation spiked CPU temporarily" }] : []
  });
});

// ==========================================
// Serve Frontend & Vite Configuration
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite middleware for Development...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static files in Production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Running at http://localhost:${PORT}`);
    console.log(`[ENV] GEMINI_API_KEY is ${process.env.GEMINI_API_KEY ? "CONFIGURED" : "NOT CONFIGURED"}`);
  });
}

startServer();
