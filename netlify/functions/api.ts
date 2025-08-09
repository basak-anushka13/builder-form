import { Handler } from "@netlify/functions";
import serverless from "serverless-http";
import { createServer } from "../../server/index";

let handler: Handler;

const getHandler = async (): Promise<Handler> => {
  if (!handler) {
    const app = await createServer();
    handler = serverless(app);
  }
  return handler;
};

export const handler: Handler = async (event, context) => {
  const serverlessHandler = await getHandler();
  return serverlessHandler(event, context);
};
