import axios from "axios";
import express from "express";
import { KAKAO_CLIENT_ID, KAKAO_REDIRECT_URL } from "../env/index";

const KAKAO_OAUTH_TOKEN_API_URL = "https://kauth.kakao.com/oauth/token";
const KAKAO_GRANT_TYPE = "authorization_code";

class App {
  app: express.Application;

  constructor() {
    this.app = express();
  }
}

const app = new App().app;

app.get("/oauth/kakao", (req, res) => {
  const code = req.query.code;
  try {
    axios
      .post(
        `${KAKAO_OAUTH_TOKEN_API_URL}?grant_type=${KAKAO_GRANT_TYPE}&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URL}&code=${code}}`,
        {
          headers: {
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }
      )
      .then((result) => {
        console.log(result);
        res.send("get token!");
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.listen(8080, () => {
  console.log("started server with 8080");
});
