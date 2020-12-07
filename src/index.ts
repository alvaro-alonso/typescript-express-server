import express from 'express';
import cors from 'cors';

import userRoutes from './routes/user';

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res, next) => {
    console.log("OK COOL");
    res.send({ message: "we did it !!" });
})

app.use("/user", userRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});