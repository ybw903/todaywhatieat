import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

export const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
export const KAKAO_REDIRECT_URL = process.env.KAKAO_REDIRECT_URL;
