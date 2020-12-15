import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import userRoutes from './routes/user';
import logInRoute from './routes/logIn';
import filmRoutes from './routes/film';

// Connection URL & Database Name
const url = 'mongodb://localhost:27017';
const dbName = 'myproject';
 
mongoose.connect(`${url}/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then( () => console.log(`Connected to ${dbName}`))
  .catch(error => error);

const app = express();
app.use(express.json());
app.use(cors());

app.use("", logInRoute);
app.use("/user", userRoutes);
app.use("/films", filmRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});