import { Schema, model, models, Types, Document } from "mongoose";
import Comment from "./Comment";

interface IPost extends Document {
  title: string;
  content: string;
  author: Types.ObjectId;
  likes: Types.ObjectId[];
  comments:Types.ObjectId[];
  likeCount: number;
  image: {
    url: string;
    public_id: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment", default: [] }],
    image: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

PostSchema.virtual("likeCount").get(function (this: IPost) {
  return this.likes.length;
});

PostSchema.post("findOneAndDelete", async (post) => {
  if (post) {
    await Comment.deleteMany({ _id: { $in: post.comments } });
  }
});


PostSchema.index({ author: 1 });
PostSchema.index({ likes: 1 });

const PostModel = models.Post || model<IPost>("Post", PostSchema);

export default PostModel;
