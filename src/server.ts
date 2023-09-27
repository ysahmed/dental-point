import mongoose from 'mongoose';
import { config } from 'dotenv';
import { app } from './app';

config();

mongoose
  .connect(
    `${process.env.DENTAL_POINT_DB_SERVER}:${process.env.DENTAL_POINT_DB_PORT}/${process.env.DENTAL_POINT_DB_NAME}`
  )
  .then(() => console.log('DB connected...'))
  .catch((e) => {
    throw e;
  });

const port = process.env.DENTAL_POINT_PORT || 3000;
app.listen(port, () => console.log('running......'));
