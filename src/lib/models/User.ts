import { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  image?: string;
  authProvider?: "google" | "github";
  providerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please use a valid email address"],
    },
    password: {
      type: String,
      select: false,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    authProvider: {
      type: String,
      enum: ["google", "github"],
    },
    providerId: { type: String },
  },
  {
    timestamps: true,
  }
);

const UserModel = models.User || model<IUser>("User", UserSchema);

export default UserModel;
