// src/config/passport/google.strategy.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// Stateless (sin sesiones)
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "https://api.tuapp.com/api/v1/auth/login/google/callback",
    },
    (_accessToken, _refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

export default passport;
