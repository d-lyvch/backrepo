import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import "./strategies/local-strategy.mjs"
// import "./strategies/discord-strategy.mjs"

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser("helloworld"));
  app.use(
    session({
      secret: "daniel the dev",
      saveUninitialized: true,
      resave: false,
      cookie: {
        maxAge: 60000 * 60,
      },
      store: MongoStore.create({
        client: mongoose.connection.getClient(),
      }),
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(routes);

  app.post("/api/auth", passport.authenticate("local"), (req, res) => {
    res.sendStatus(200);
  });

  app.get("/api/auth/status", (req, res) => {
    return req.user ? res.send(req.user) : res.sendStatus(401);
  });

  app.post("/api/auth/logout", (req, res) => {
    if (!req.user) return res.sendStatus(401);
    req.logout((err) => {
      if (err) return res.sendStatus(400);
      res.send(200);
    });
  });

  app.get("/api/auth/discord", passport.authenticate("discord"));
  app.get(
    "/api/auth/discord/redirect",
    passport.authenticate("discord"),
    (req, res) => {
      res.sendStatus(200);
    }
  );

  return app;
}
