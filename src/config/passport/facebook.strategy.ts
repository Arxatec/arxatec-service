// src/config/passport/facebook.strategy.ts
import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import {
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  FACEBOOK_CALLBACK_URL,
} from "../../config";

if (FACEBOOK_CLIENT_ID && FACEBOOK_CLIENT_SECRET && FACEBOOK_CALLBACK_URL) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: FACEBOOK_CLIENT_ID,
        clientSecret: FACEBOOK_CLIENT_SECRET,
        callbackURL: FACEBOOK_CALLBACK_URL,
        profileFields: ["id", "emails", "name", "photos"],
      },
      (accessToken, _refreshToken, profile, done) => {
        (profile as any)._accessToken = accessToken;
        done(null, profile);
      }
    )
  );
} else {
  console.warn(
    "[Auth] Facebook OAuth no configurado. Falta app id/secret/callback."
  );
}

export default passport;
