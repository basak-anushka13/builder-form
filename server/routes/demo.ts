import { RequestHandler } from "express";
import { DemoResponse } from "@shared/api";

export const handleDemo: RequestHandler = (req, res) => {
  const response: DemoResponse = {
    message: "FormCraft API is working!",
    timestamp: new Date().toISOString(),
  };
  res.json(response);
};
