import express, { Request, Response } from 'express';

import { verifyToken } from '../middleware/auth';
import { Film } from '../model/Film';


const router = express.Router();

router.use(verifyToken);

router.post("/add", async (req: Request, res: Response) => {
    try {
        const film = new Film(req.body);
        await film.save();

        return res.sendStatus(200);
    } catch (err) {
        return res.status(409).send({ message: "Wrong input for a film" });
    }

});


export default router;