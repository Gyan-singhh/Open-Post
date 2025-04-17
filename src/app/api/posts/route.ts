import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/db/connect";
import Postmodel from "@/lib/models/Post";
import { uploadImage } from "../image-upload/service";

const errorResponse = (message: string, status: number) => {
  return NextResponse.json({ error: message }, { status });
};

export { errorResponse };

export async function GET() {
  try {
    await dbConnect();
    const posts = await Postmodel.find().sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return errorResponse("Failed to fetch posts", 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return errorResponse("Unauthorized request", 401);
    }

    const formData = await request.formData();
    const title = formData.get("title")?.toString() || "";
    const content = formData.get("content")?.toString() || "";
    const imageFile = formData.get("image") as File;

    if (!title || !content || !imageFile) {
      return errorResponse("Title, content, and image are required", 400);
    }

    const { url: imageUrl, publicId } = await uploadImage(imageFile);

    await dbConnect();
    const newPost = new Postmodel({
      title,
      content,
      author: session.user._id,
      image: {
        url: imageUrl,
        public_id: publicId,
      },
      likes: [],
      comments:[],
    });
    await newPost.save();
    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    console.error("Error creating post:", error);
    return errorResponse(error.message || "Failed to create post", 500);
  }
}

