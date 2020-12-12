import express, { Request, Response } from 'express';
import { signToken } from '../middleware/auth';
import { User, UserDocument } from '../model/User';

const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send({ message: "Wrong email / password"});
    }

    const validPassword = await user.comparePassword(req.body.password)
    if (!validPassword) {
      return res.status(400).send({ message: "Wrong email / password"});
    }

    const { _id: userId } = user;
    res.setHeader("accessToken", signToken(userId));
    res.send();
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "Ops Something went Wrong" });
  }

});


export default router;