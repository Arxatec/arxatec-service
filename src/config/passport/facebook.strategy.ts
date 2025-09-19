// src/config/passport/facebook.strategy.ts
import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: "https://api.tuapp.com/api/v1/auth/login/facebook/callback",
      profileFields: ["id", "emails", "name", "picture.type(large)"],
    },
    (_accessToken, _refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

export default passport;
