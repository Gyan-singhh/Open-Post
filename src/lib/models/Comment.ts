import { Schema, model, models, Types, Document } from "mongoose";

export interface IComment extends Document {
  content: string;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default models.Comment || model<IComment>("Comment", CommentSchema);
