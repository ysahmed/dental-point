import { Request, Response } from 'express';

//   // Set the JWT as an HTTP cookie with HttpOnly, Secure, and Path attributes
//   res.cookie('jwt', token, {
//     httpOnly: true,
//     secure: true, // Use this in a production environment with HTTPS
//     path: '/', // Adjust the path as needed
//   });

export function update(req: Request, res: Response) {}

export function getUser(req: Request, res: Response) {}
