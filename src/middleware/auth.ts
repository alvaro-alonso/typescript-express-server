import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "config";

import { User, UserDocument } from "../model/User";

export const signToken = (userId: keyof UserDocument) : string => {
    return jwt.sign({ userId }, config.get("jwtSecret"), { expiresIn: "1h" });
};

export const verifyToken = async (req: Request, res: Response, next: NextFunction) : void => {
  //Get the jwt token from the head
  const bearer = <string>req.headers["authorization"];
  if (!bearer) {
    res.status(403).send({ message: "Please log in" });
    return;
  }

  const token = bearer.split(' ')[1];
  let jwtPayload;
  try {
    jwtPayload = <any>jwt.verify(token, config.get("jwtSecret"));
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    res.sendStatus(401);
    return;
  }

  //The token is valid for 1 hour
  //We want to send a new token on every request
  const { userId } = jwtPayload;
  const userExists = await User.findById(userId);
  if (!userExists) {
    res.sendStatus(401);
    return;
  }

  const newToken = signToken(userId);
  res.setHeader("accessToken", newToken);
  req.body.userId = userId;

  //Call the next middleware or controller
  next();
  return;
};