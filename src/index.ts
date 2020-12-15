import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from 'config';

import logger from './utils/logger';

import userRoutes from './routes/user';
import logInRoute from './routes/logIn';
import filmRoutes from './routes/film';

// Connection URL & Database Name
 
mongoose.connect(config.get('MONGODB_URI'), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then( () => logger.info('Connected to Database'))
  .catch(error => error);

const app = express();
app.use(express.json());
app.use(cors());

app.use('', logInRoute);
app.use('/user', userRoutes);
app.use('/films', filmRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server is listening on port ${PORT}`);
});