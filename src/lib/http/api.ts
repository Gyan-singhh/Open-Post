import axios from "axios";
import { Comment, Post } from "@/types";
const API_BASE_URL = "/api/posts";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getPosts = async (): Promise<Post[]> => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data?.error || "Failed to fetch posts"
        : "Failed to fetch posts"
    );
  }
};

export const getPost = async (id: string): Promise<Post> => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data?.error || "Failed to fetch post"
        : "Failed to fetch post"
    );
  }
};

export const createPost = async (formData: FormData): Promise<Post> => {
  try {
    const response = await axios.post("/api/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data?.error || "Failed to create post"
        : "Failed to create post"
    );
  }
};

export const deletePost = async (id: string): Promise<void> => {
  try {
    await api.delete(`/${id}`);
  } catch (error) {
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data?.error || "Failed to delete post"
        : "Failed to delete post"
    );
  }
};

export const likePost = async (id: string): Promise<Post> => {
  try {
    const response = await api.post(`/${id}/likes`);
    return response.data;
  } catch (error) {
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data?.error || "Failed to like post"
        : "Failed to like post"
    );
  }
};

export const createComment = async (
  id: string,
  content: string
): Promise<Comment> => {
  try {
    const response = await api.post(`/${id}/comments`, {
      content,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data?.error || "Failed to create comment"
        : "Failed to create comment"
    );
  }
};

export const deleteComment = async (
  id: string,
  commentId: string
): Promise<void> => {
  try {
    await api.delete(`/${id}/comments`, {
      data: { commentId },
    });
  } catch (error) {
    throw new Error(
      axios.isAxiosError(error)
        ? error.response?.data?.error || "Failed to delete comment"
        : "Failed to delete comment"
    );
  }
};
