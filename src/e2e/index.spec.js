import request from "supertest";
import { createApp } from "../createApp.mjs";
import mongoose from "mongoose";

describe("/api/auth", () => {
  let app;
  beforeAll(() => {
    mongoose
      .connect(
        "mongodb+srv://admin:admin@cluster0.dulv4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0_test"
      )
      .then(() => console.log("Connect to test Database"))
      .catch((err) => console.log(`Error: ${err}`));

    app = createApp();
  });
  it("shoud return 401 when not logged in", async () => {
    const response = await request(app).get("/api/auth/status");
    expect(response.statusCode).toBe(401);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
