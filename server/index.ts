import express from "express";
import cors from "cors";
import path from "path";
import connectDB from "./database";
import {
  setDatabaseStatus as setFormsDatabaseStatus,
  getAllForms,
  getFormById,
  createForm,
  updateForm,
  deleteForm,
} from "./routes/forms";
import {
  setDatabaseStatus as setResponsesDatabaseStatus,
  getAllResponses,
  createResponse,
} from "./routes/responses";
import { handleDemo } from "./routes/demo";

const createServer = async () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Connect to database
  const dbConnected = await connectDB();
  setFormsDatabaseStatus(dbConnected);
  setResponsesDatabaseStatus(dbConnected);

  // API Routes
  app.get("/api/demo", handleDemo);

  // Forms routes
  app.get("/api/forms", getAllForms);
  app.get("/api/forms/:id", getFormById);
  app.post("/api/forms", createForm);
  app.put("/api/forms/:id", updateForm);
  app.delete("/api/forms/:id", deleteForm);

  // Responses routes
  app.get("/api/responses", getAllResponses);
  app.post("/api/responses", createResponse);

  // Serve static files in production
  if (process.env.NODE_ENV === "production") {
    const spaPath = path.join(process.cwd(), "dist/spa");
    app.use(express.static(spaPath));

    // Handle SPA routing
    app.get("*", (req, res) => {
      if (!req.path.startsWith("/api/")) {
        res.sendFile(path.join(spaPath, "index.html"));
      } else {
        res.status(404).json({ error: "API endpoint not found" });
      }
    });
  }

  return app;
};

// Start server in development
if (process.env.NODE_ENV !== "production") {
  createServer().then((app) => {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

export { createServer };
