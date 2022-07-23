import { createCookieSessionStorage } from "@remix-run/node";

let sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set");
  } else {
    sessionSecret = "---DEV SESSION SECRET---";
  }
}

export const storage = createCookieSessionStorage({
  cookie: {
    name: "ck.sid",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});
