import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

const viewsDir = path.join(__dirname, '..', '..', 'views');

router.get('/', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.sendFile(path.join(viewsDir, 'login.html'));
});

router.get('/next', (req:Request, res:Response) => {
  res.set('Content-Type', 'text/html');
  res.sendFile(path.join(viewsDir, 'next.html'));
});

router.post('/login', (req:Request, res:Response) => {
  console.log(`${req.body.username} ${req.body.password}`);
  console.log(req.body);
  res.status(200).redirect('/next');
});

export {router}

