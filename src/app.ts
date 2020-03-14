import express from "express";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";

import passportMiddleware from "./middlewares/passport";
import authRoutes from "./routes/auth.routes";
import notesRoutes from "./routes/notes.routes";

// initialize
const app = express();

// settings
app.set("port", process.env.PORT || 3000);

// middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());

passport.use(passportMiddleware);

// routes
app.use(authRoutes);
app.use(notesRoutes);

export default app;
