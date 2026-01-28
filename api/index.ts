import express, { type Request, type Response } from "express";
import { registerRoutes } from "../server/routes";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const initialized = registerRoutes(httpServer, app);

export default async function (req: Request, res: Response) {
  await initialized;
  app(req, res, () => {});
}
