import express from "express";

class App {
  app: express.Application;

  constructor() {
    this.app = express();
  }
}

const app = new App().app;

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(8080, () => {
  console.log("started server with 8080");
});
