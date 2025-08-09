import { Handler } from "@netlify/functions";
import serverless from "serverless-http";
import { createServer } from "../../server/index";

let serverlessHandler: Handler;

const getHandler = async (): Promise<Handler> => {
  if (!serverlessHandler) {
    const app = await createServer();
    serverlessHandler = serverless(app);
  }
  return serverlessHandler;
};

export const handler: Handler = async (event, context) => {
  const handlerInstance = await getHandler();
  return handlerInstance(event, context);
};
