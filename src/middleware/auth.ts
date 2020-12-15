import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "config";

import { UserDocument } from "../model/User";

export const signToken = (userId: keyof UserDocument) : string => {
    return jwt.sign({ userId }, config.get("jwtSecret"), { expiresIn: "1h" });
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) : void => {
  //Get the jwt token from the head
  const bearer = <string>req.headers["authorization"];
  const token = bearer.split(' ')[1];
  
  if (!token) {
    res.status(403).send({ message: "No token provided!" });
    return;
  }

  //Try to validate the token and get data
  let jwtPayload;
  try {
    jwtPayload = <any>jwt.verify(token, config.get("jwtSecret"));
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    res.status(401).send();
    return;
  }

  //The token is valid for 1 hour
  //We want to send a new token on every request
  const { userId } = jwtPayload;
  const newToken = signToken(userId);
  res.setHeader("accessToken", newToken);
  req.body.userId = userId;

  //Call the next middleware or controller
  next();
  return;
};