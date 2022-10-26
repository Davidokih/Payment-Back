import express, { Application, Response, Request } from "express";
import cors from "cors";
import db from "./utils/db";

import user from "./router/userRouter";
import follow from "./router/followRouter";
import wallet from "./router/walletRouter";
import history from "./router/historyRouter";

db;
const app: Application = express();
const port: number = 2245;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response): Response => {
  return res.status(200).json({ message: "Yappppppp" });
});

app.use("/api/user", user);
app.use("/api/follow", follow);
app.use("/api/wallet", wallet);
app.use("/api/history", history);

app.listen(port, (): void => {
  console.log("server is now up and Running...!");
});
