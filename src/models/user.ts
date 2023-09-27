import { Schema, model, Document, InferSchemaType } from 'mongoose';
import { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirm?: string;
  getToken: () => string;
}

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    minlength: 1,
    maxlength: 255,
    required: [true, 'First name is required.'],
  },
  lastName: {
    type: String,
    minlength: 1,
    maxlength: 255,
    required: [true, 'Last name is required.'],
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: [true, 'Email is required.'],
  },
  phone: {
    type: String,
    minlength: 5,
    maxlength: 25,
    default: null,
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    maxlength: 1024,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await hash(this.password, 12);
  next();
});

userSchema.methods.getToken = function (): string {
  return jwt.sign(
    { name: this.firstName, _id: this._id },
    process.env.DENTAL_POINT_PRIVATE_TOKEN as string
  );
};

export default model<IUser>('User', userSchema);
