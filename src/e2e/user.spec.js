import request from "supertest";
import { createApp } from "../createApp.mjs";
import mongoose from "mongoose";

describe("create user and login", () => {
  let app;
  beforeAll(async () => {
    await mongoose
      .connect(
        "mongodb+srv://admin:admin@cluster0.dulv4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0_test"
      )
      .then(() => console.log("Connect to test Database"))
      .catch((err) => console.log(`Error: ${err}`));

    app = createApp();
  });

  it("should create the user", async () => {
    const response = await request(app).post("/api/users").send({
        username: "daniel123",
        password: "password",
        displayName: "Daniel Dev",
    });
    expect(response.statusCode).toBe(201);
});

  it("should log the user in and visit /api/auth/status and return auth user", async () => {
    const response = await request(app)
        .post("/api/auth")
        .send({ username: "daniel123", password: "password" })
        .then((res) => {
            return request(app)
                .get("/api/auth/status")
                .set("Cookie", res.headers["set-cookie"]);
        });
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe("daniel123");
    expect(response.body.displayName).toBe("Daniel Dev");
});

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
