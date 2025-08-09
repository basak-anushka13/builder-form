import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./database";
import { handleDemo } from "./routes/demo";
import {
  getAllForms,
  getFormById,
  createForm,
  updateForm,
  deleteForm
} from "./routes/forms";
import {
  submitResponse,
  getResponsesByForm,
  getResponseById,
  getAllResponses,
  deleteResponse
} from "./routes/responses";

export function createServer() {
  const app = express();

  // Attempt to connect to MongoDB (non-blocking)
  connectDB().then((connected) => {
    if (connected) {
      console.log('🚀 Server ready with MongoDB');
    } else {
      console.log('🚀 Server ready with localStorage fallback');
    }
  });

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' })); // Increased limit for image uploads
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Form routes
  app.get("/api/forms", getAllForms);
  app.get("/api/forms/:id", getFormById);
  app.post("/api/forms", createForm);
  app.put("/api/forms/:id", updateForm);
  app.delete("/api/forms/:id", deleteForm);

  // Response routes
  app.post("/api/responses", submitResponse);
  app.get("/api/responses", getAllResponses);
  app.get("/api/responses/form/:formId", getResponsesByForm);
  app.get("/api/responses/:id", getResponseById);
  app.delete("/api/responses/:id", deleteResponse);

  // Legacy demo route
  app.get("/api/demo", handleDemo);

  return app;
}
