import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import PostModel from "@/lib/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { errorResponse } from "@/lib/http/errorResponse";
import { cloudinary } from "../../image-upload/service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const id = (await params).id;
    const post = await PostModel.findById(id).populate({
      path: "comments",
      populate: {
        path: "author",
        select: "_id username image",
      },
    });

    if (!post) {
      return errorResponse("Post not found", 404);
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    return errorResponse("Failed to fetch post", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user._id) {
      return errorResponse("Unauthorized request", 401);
    }

    const id = (await params).id;

    if (!id) {
      return errorResponse("Post ID is required", 400);
    }
    await dbConnect();
    const post = await PostModel.findById(id);

    if (!post) {
      return errorResponse("Post not found", 404);
    }

    if (post.author.toString() !== session.user._id) {
      return errorResponse("Not authorized to delete this post", 403);
    }

    if (post.image.public_id) {
      try {
        await cloudinary.uploader.destroy(post.image.public_id);
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
      }
    }

    await PostModel.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return errorResponse("Failed to delete post", 500);
  }
}
