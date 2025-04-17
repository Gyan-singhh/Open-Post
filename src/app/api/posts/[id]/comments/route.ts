import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { errorResponse } from "../../route";
import dbConnect from "@/lib/db/connect";
import PostModel from "@/lib/models/Post";
import { NextRequest, NextResponse } from "next/server";
import Comment from "@/lib/models/Comment";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return errorResponse("Unauthorized request", 401);
    }

    const { content } = await request.json();
    const { id: postId } = params;
    const userId = session.user._id;

    if (!postId || !content) {
      return errorResponse("Post ID and content are required", 400);
    }

    await dbConnect();
    const post = await PostModel.findById(postId);

    if (!post) {
      return errorResponse("Post not found", 404);
    }

    const newComment = await Comment.create({
      content,
      author: userId,
    });
    post.comments.push(newComment._id);
    await post.save();

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating Comment:", error);
    return errorResponse("Failed to create post", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return errorResponse("Unauthorized request", 401);
    }

    const { id: postId } = params;
    const { commentId } = await request.json();

    if (!postId || !commentId) {
      return errorResponse("Post ID and comment ID are required", 400);
    }

    await dbConnect();

    const comment = await Comment.findById(commentId);

    if (!comment || comment.author.toString() !== session.user._id) {
      return errorResponse("Unauthorized to delete this comment", 403);
    }
    
    await PostModel.findByIdAndUpdate(postId, {
      $pull: { comments: commentId },
    });
    await Comment.findByIdAndDelete(commentId);

    return NextResponse.json({ message: "Comment deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting Comment:", error);
    return errorResponse("Failed to create post", 500);
  }
}
