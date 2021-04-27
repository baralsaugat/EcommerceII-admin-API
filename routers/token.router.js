import express from "express";
import { createAccessJWT, verifyRefreshJwt } from "../helpers/jwt.helper.js";
import { getUserByEmailAndRefreshJWT } from "../models/user/User.model.js";

const router = express.Router();

router.all("*", (req, res, next) => {
  next();
});

// get refresh JWT abd return nre access JWT

router.get("/", async (req, res) => {
  try {
    const { authorization } = req.headers;

    if (authorization) {
      const { email } = await verifyRefreshJwt(authorization);

      if (email) {
        const user = await getUserByEmailAndRefreshJWT({
          email,
          refreshJWT: authorization,
        });

        console.log(email);
        console.log(user);

        if (user._id) {
          const tokenExp = user.refreshJWT.addedAt;

          tokenExp.setDate(
            tokenExp.getDate() + +process.env.JWT_REFRESH_SECRET_EXP_DAY
          );

          const today = Date.now();

          if (tokenExp > today) {
            const accessJWT = await createAccessJWT(email, user._id);
            return res.json({
              status: "success",
              message: "here is your new accessJWT",
              accessJWT,
            });
          }
        }
      }
    }

    // call the function to get the access JWT

    // 1. verify the storeRefresh JWT

    res.status(403).json({
      status: "error",
      message: "unauthorized!",
    });
  } catch (error) {
    res.status(403).json({
      status: "error",
      message: "unauthorized!",
    });
  }
});

export default router;
