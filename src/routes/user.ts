import express, { Request, Response } from 'express';
import logger from '../utils/logger';
import { User } from '../model/User';
import { signToken } from "../middleware/auth";



const router = express.Router();

router.post("/create", async (req: Request, res: Response) => {
    try {
        const user = new User(req.body);
        const userExists = await User.findOne({ email: user.email })
        if (!userExists) {
            await user.save();
            console.log(`user saved: ${user}`);

            const { _id: userId } = user;
            logger.info(`new user created with id: ${userId}`);
            res.setHeader("accessToken", signToken(userId));
            res.send();
        } else {
            res.status(409).send({ message: "user already exists"});
            console.info("user already exists");
        }
    } catch (err) {
        logger.error(err);
        res.status(500).send({ message: "Ops! something went wrong"});
    }
});


export default router;