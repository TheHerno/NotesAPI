import express, { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";

import passportMiddleware from "./middlewares/passport";
import authRoutes from "./routes/auth.routes";
import notesRoutes from "./routes/notes.routes";

// initialize
const app: Express = express();

// settings
app.set("port", process.env.PORT || 3000);

// middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

passport.use(passportMiddleware);

// routes
app.use(authRoutes);
app.use(notesRoutes);

export default app;
