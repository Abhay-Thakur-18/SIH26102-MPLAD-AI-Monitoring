import swaggerJsdoc from "swagger-jsdoc";
import { env } from "../config/env";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "AEGIS-MPLADS AI — Backend API",
    version: "1.0.0",
    description:
      "AI Enabled Governance Intelligence System (AEGIS-MPLADS AI) — Problem Statement SIH26102.\n" +
      "Provides AI-powered anomaly, fraud & inefficiency detection, project tracking, and auditing for MPLADS funds.",
    contact: {
      name: "AEGIS Team (SIH26102)",
      email: "support@aegis-mplads.gov.in"
    }
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}${env.API_PREFIX}`,
      description: "Local Development Server"
    },
    {
      url: `${env.APP_URL}${env.API_PREFIX}`,
      description: "Production / Staging Server"
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT Access Token in the format: Bearer <token>"
      }
    },
    schemas: {
      StandardResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Operation successful" },
          data: { type: "object", nullable: true },
          meta: {
            type: "object",
            nullable: true,
            properties: {
              page: { type: "number", example: 1 },
              limit: { type: "number", example: 10 },
              total: { type: "number", example: 50 },
              totalPages: { type: "number", example: 5 },
              requestId: { type: "string", example: "b3b7c251-5122-4416-8fe1-9543bead5f23" }
            }
          },
          errors: { type: "object", nullable: true },
          timestamp: { type: "string", example: "2026-09-08T08:00:00.000Z" }
        }
      },
      StandardError: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Error message details" },
          data: { type: "null", example: null },
          meta: {
            type: "object",
            nullable: true,
            properties: {
              requestId: { type: "string", example: "b3b7c251-5122-4416-8fe1-9543bead5f23" }
            }
          },
          errors: { type: "object", nullable: true },
          timestamp: { type: "string", example: "2026-09-08T08:00:00.000Z" }
        }
      },
      UserRegisterDto: {
        type: "object",
        required: ["email", "password", "role", "profile"],
        properties: {
          email: { type: "string", format: "email", example: "officer@district.gov.in" },
          password: { type: "string", minLength: 8, example: "SecureP@ss2026" },
          role: {
            type: "string",
            enum: ["SUPER_ADMIN", "ADMIN", "MP", "DISTRICT_AUTHORITY", "AUDITOR", "CONTRACTOR", "CITIZEN"],
            example: "DISTRICT_AUTHORITY"
          },
          profile: {
            type: "object",
            required: ["fullName"],
            properties: {
              fullName: { type: "string", example: "Rajesh Kumar" },
              phone: { type: "string", example: "+919876543210" },
              state: { type: "string", example: "Maharashtra" },
              district: { type: "string", example: "Pune" },
              mpCode: { type: "string", example: "MH-PUNE-01" },
              designation: { type: "string", example: "District Collector" }
            }
          }
        }
      },
      UserLoginDto: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "officer@district.gov.in" },
          password: { type: "string", example: "SecureP@ss2026" }
        }
      },
      ProjectCreateDto: {
        type: "object",
        required: ["title", "description", "category", "budget", "timeline", "location"],
        properties: {
          title: { type: "string", example: "Construction of Solar Powered Community Center" },
          description: { type: "string", example: "High priority rural community infrastructure project" },
          category: { type: "string", example: "Community Infrastructure" },
          budget: {
            type: "object",
            required: ["sanctionedAmount"],
            properties: {
              sanctionedAmount: { type: "number", example: 5000000 },
              releasedAmount: { type: "number", example: 2500000 }
            }
          },
          timeline: {
            type: "object",
            required: ["startDate", "expectedEndDate"],
            properties: {
              startDate: { type: "string", format: "date-time" },
              expectedEndDate: { type: "string", format: "date-time" }
            }
          },
          location: {
            type: "object",
            required: ["state", "district", "coordinates"],
            properties: {
              state: { type: "string", example: "Maharashtra" },
              district: { type: "string", example: "Pune" },
              village: { type: "string", example: "Khed" },
              coordinates: {
                type: "object",
                required: ["latitude", "longitude"],
                properties: {
                  latitude: { type: "number", example: 18.5204 },
                  longitude: { type: "number", example: 73.8567 }
                }
              }
            }
          }
        }
      },
      PaymentCreateDto: {
        type: "object",
        required: ["projectId", "contractorId", "amount", "pfmsTransactionId", "stage"],
        properties: {
          projectId: { type: "string", example: "66db1e23f9a7123456789abc" },
          contractorId: { type: "string", example: "66db1e23f9a7123456789def" },
          amount: { type: "number", example: 1250000 },
          pfmsTransactionId: { type: "string", example: "PFMS2026-MH-998822" },
          stage: { type: "string", example: "Foundation Milestone 1" }
        }
      },
      AiPayloadDto: {
        type: "object",
        properties: {
          projectId: { type: "string", example: "66db1e23f9a7123456789abc" },
          contractorId: { type: "string", example: "66db1e23f9a7123456789def" },
          budget: { type: "number", example: 5000000 },
          disbursed: { type: "number", example: 2500000 },
          coordinates: {
            type: "object",
            properties: {
              latitude: { type: "number", example: 18.5204 },
              longitude: { type: "number", example: 73.8567 }
            }
          },
          imageUrl: { type: "string", example: "https://res.cloudinary.com/demo/image/upload/site.jpg" }
        }
      },
      ComplaintCreateDto: {
        type: "object",
        required: ["projectId", "title", "description", "location"],
        properties: {
          projectId: { type: "string", example: "66db1e23f9a7123456789abc" },
          title: { type: "string", example: "Substandard quality materials used" },
          description: { type: "string", example: "Cracks observed in the newly poured slab." },
          location: {
            type: "object",
            required: ["state", "district"],
            properties: {
              state: { type: "string", example: "Maharashtra" },
              district: { type: "string", example: "Pune" },
              village: { type: "string", example: "Khed" },
              coordinates: {
                type: "object",
                properties: {
                  latitude: { type: "number", example: 18.5204 },
                  longitude: { type: "number", example: 73.8567 }
                }
              }
            }
          }
        }
      }
    }
  },
  tags: [
    { name: "Auth", description: "Authentication & Token Management" },
    { name: "Users", description: "User management and RBAC profiles" },
    { name: "Projects", description: "MPLADS Project creation, tracking, milestones, and geo-data" },
    { name: "Contractors", description: "Contractor registry, risk scoring, and performance" },
    { name: "Payments", description: "PFMS financial transactions, invoices, and budget consumption" },
    { name: "AI Gateway", description: "AI anomaly, fraud, image verification, and audit prediction endpoints" },
    { name: "Audit Engine", description: "Auditor assignments, PDF reports, and investigation findings" },
    { name: "Complaints", description: "Citizen verification, complaint submissions, and status tracking" },
    { name: "Notifications", description: "Real-time alerts and user notification inbox" },
    { name: "Dashboard", description: "Aggregated risk heatmap, fraud summary, and district/MP analytics" }
  ]
};

const options: swaggerJsdoc.Options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts", "./src/docs/*.ts"]
};

export const swaggerSpec = swaggerJsdoc(options);
