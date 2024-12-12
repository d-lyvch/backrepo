import mongoose from "mongoose";
import { createApp } from "./createApp.mjs";

mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.dulv4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connect to Database"))
  .catch((err) => console.log(`Error: ${err}`));

const app = createApp();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
