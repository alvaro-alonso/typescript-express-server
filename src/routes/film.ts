import express, { Request, Response } from 'express';

import { verifyToken } from '../middleware/auth';
import { Film } from '../model/Film';
import { User } from '../model/User';
import logger from '../utils/logger';


const router = express.Router();

router.use(verifyToken);

router.get("", async (req: Request, res: Response) => {
    try{
        const { userId } = req.body
        const user = await User.findById(userId);

        if (!user) {
            return res.status(409).send({ message: "User Does not exists"});
        }

        const { favouriteFilms } = user;
        const userFilms = await Film.find({ _id: { $in : favouriteFilms } });
        return res.send({ films: userFilms });
        
    } catch (err) {
        logger.error(err);
        return res.status(500).send({ message: "Ops! something went wrong!" });
    }
});

router.post("/add", async (req: Request, res: Response) => {

    let film;
    const { userId, ...filmData } = req.body;

    try {

        const exists = await Film.exists({ name: filmData.name })
        if (exists) {
            return res.status(403).send({ message: "Film already exists"});
        }

        film = new Film(filmData);
        await film.save();
        logger.info(`new film created: ${film.name} (${film._id}) by ${userId}`);
    } catch (err) {
        logger.error(`film could not be created - ${err}`);
        if (err.name == 'ValidationError') {
            return res.status(409).send({ message: err });
        } else {
            return res.sendStatus(500);
        }
    }
        
    try {
        const user = await User.findById(userId);
        user?.favouriteFilms.push(film._id);
        await user?.save()
        return res.sendStatus(200);
 
    } catch (err) {
        logger.error(`film could not be added to user (${userId})- ${err}`);
        return res.sendStatus(500);
    }

});



export default router;