import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { errorResponse } from "../../route";
import dbConnect from "@/lib/db/connect";
import PostModel from "@/lib/models/Post";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return errorResponse("Unauthorized request", 401);
    }

    const { id } = await params;
    const userId = session.user._id;

    if (!id || !userId) {
      return errorResponse("Post ID is required", 400);
    }

    await dbConnect();

    const post = await PostModel.findById(id);
    if (!post) {
      return errorResponse("Post not found", 404);
    }

    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    const updatedPost = await post.save();

    return NextResponse.json({
      success: true,
      likes: updatedPost.likes,
      likeCount: updatedPost.likes.length,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    return errorResponse("Internal server error", 500);
  }
}
