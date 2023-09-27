import express, { Request, Response, NextFunction } from 'express';
import { register, login } from './controllers/authController';
require('express-async-errors');
const app = express();

app.use(express.json());

// app.use('/', auth, redirect);
app.post('/register', register); //! auth
app.post('/login', login); //! auth
// app.use('/prescription', auth, prescription);
// app.use('/dash', auth, dash);
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.log(err);
  res.status(500).send('Internal Server Error!!');
});
export { app };
