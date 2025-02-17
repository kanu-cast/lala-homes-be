import { Router } from "express";
import { register } from "../controllers/auth.controllers";
import passport from "passport";

const router = Router();

router.post("/register", register);

router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    (err: any, user: Express.User, info: { message: any }) => {
      if (err) return next(err);
      if (!user) return res.status(400).json({ message: info?.message });

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        } else {
          req.session.cookie.maxAge = req.body.rememberMe
            ? 1000 * 60 * 60 * 24 * 7 // 7 days
            : 1000 * 60 * 30 * 12; // Default 6 hours
          return res.json({ message: "Logged in successfully", user });
        }
      });
    }
  )(req, res, next);
});

// Initiate Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    scope: ["profile", "email"], // required scopes don't touch  nigga
    failureRedirect: `${process.env.FRONTEND_URL}/login`
  }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);
// auth me route
router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ user: req.user });
  }
  res.status(401).json({ message: "Not authenticated" });
});
//logutroute
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    req.session.destroy(() => {
      res
        .clearCookie("connect.sid")
        .json({ message: "Logged out successfully" }); // Clears session cookie
    });
  });
});

export default router;
