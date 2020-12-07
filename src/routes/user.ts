import express from 'express';
import User from '../model/User';

const router = express.Router();

router.post("/create", async (req, res) => {
    try {
        const user = req.data;
        const userExist = await User.find();
    } catch (e) {
        console.log(e);
        res.send(500);
    }
});


export default router;