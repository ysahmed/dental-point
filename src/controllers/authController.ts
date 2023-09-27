import { Request, Response } from 'express';
import User, { IUser } from '../models/user';
import Joi, { ValidationError } from 'joi';
import bcrypt from 'bcrypt';

class CustomValidationError extends ValidationError {
  constructor(
    message: string,
    details: Joi.ValidationErrorItem[],
    original?: any
  ) {
    super(message, details, original);
  }
}

const regSchema = Joi.object({
  firstName: Joi.string().required().min(1).max(255),
  lastName: Joi.string().required().min(1).max(255),
  email: Joi.string().email().required().min(5).max(255),
  phone: Joi.string(),
  password: Joi.string().required(),
  passwordConfirm: Joi.string().required(),
});

async function validateReg(body: any) {
  try {
    await regSchema.validateAsync(body);
    if (body.password !== body.passwordConfirm) {
      throw new CustomValidationError('Password confirmation did not match', [
        {
          message: 'Password confirmation did not match',
          path: [1],
          type: 'Password confirmation error',
        },
      ]);
    }
  } catch (err) {
    return err;
  }
}

export async function register(req: Request, res: Response) {
  const err: ValidationError | any = await validateReg(req.body);
  if (err)
    return res.status(400).json({
      message: err.message,
    });

  //! required: existence of email check
  let user: IUser | number = await User.findOne({
    email: req.body.email,
  }).count();

  if (user)
    return res.status(409).json({
      message: 'Email already registered.',
    });

  user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  await user.save();

  // TODO set cookie
  // TODO redirect
  res.status(201).json({
    message: 'ok',
    _user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });
}

export async function login(req: Request, res: Response) {
  // check email
  const user: IUser | null = await User.findOne({
    email: req.body.email,
  });

  if (!user)
    return res.status(400).json({
      message: 'Invalid login.',
    });

  // check pass
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res.status(400).json({
      message: 'Invalid login.',
    });

  const token = user.getToken();
  // Set the JWT token as a cookie
  res.cookie('jwt', token, { httpOnly: true }); // HttpOnly for added security

  // redirect to prescription
  res.status(202).send('/next');
}
