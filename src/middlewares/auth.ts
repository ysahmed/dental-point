import { Jwt } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.jwt;
}
