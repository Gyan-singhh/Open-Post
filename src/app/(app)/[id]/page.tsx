"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPost,
  deletePost,
  likePost,
  createComment,
  deleteComment,
} from "@/lib/http/api";
import { Post, Comment } from "@/types";
import { format } from "date-fns";
import Image from "next/image";
import { ErrorDisplay, Loading, NotFoundDisplay } from "@/components/UIStatus";
import { FaHeart, FaRegHeart, FaTrash, FaUser } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PostDetailsPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [commentContent, setCommentContent] = useState("");

  const {
    data: post,
    isLoading,
    error,
  } = useQuery<Post | undefined>({
    queryKey: ["post", id],
    queryFn: () => getPost(id as string),
    enabled: !!id,
  });

  const likeMutation = useMutation({
    mutationFn: () => likePost(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePost(id as string),
    onSuccess: () => {
      router.push("/");
    },
  });

  const commentMutation = useMutation({
    mutationFn: () => createComment(id as string, commentContent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      setCommentContent("");
    },
  });

  const commentDeleteMutation = useMutation({
    mutationFn: (commentId: string) => deleteComment(id as string, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", id] });
    },
  });

  const handleLike = () => {
    if (!session) return;
    likeMutation.mutate();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate();
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || !session) return;
    commentMutation.mutate();
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      commentDeleteMutation.mutate(commentId);
    }
  };

  if (isLoading) return <Loading />;
  if (!post) return <NotFoundDisplay />;
  if (error) return <ErrorDisplay error={error} />;

  const isOwner = session?.user?._id === post.author;
  const isLiked = post.likes?.includes(session?.user?._id || "");

  return (
    <div className="w-full max-w-6xl mx-auto mt-5 p-4 sm:p-8">
      <article className="grid grid-cols-1 md:grid-cols-2 md:gap-8 bg-white rounded-2xl shadow-lg">
        {post.image?.url && (
          <div className="relative w-full min-h-[20rem] sm:min-h-[25rem] h-full xl:h-auto rounded-t-2xl xl:rounded-l-2xl xl:rounded-tr-none overflow-hidden">
            <Image
              src={post.image.url}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <div className="flex flex-col justify-between h-full px-4 py-3 sm:px-8 sm:py-5">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
              {post.title}
            </h1>
            <div className="text-sm text-gray-500 mb-2">
              {post.createdAt && (
                <time dateTime={post.createdAt.toString()}>
                  {format(new Date(post.createdAt), "MMMM d, yyyy")}
                </time>
              )}
            </div>
            <div className="prose max-w-none text-gray-700 overflow-y-auto">
              {post.content.split("\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-200">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 font-medium hover:cursor-pointer ${
                isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
              } transition-colors`}
              disabled={likeMutation.isPending || !session}
            >
              {isLiked ? (
                <div className="flex text-lg items-center gap-2">
                  Like <FaHeart className="text-red-500 text-2xl" />
                </div>
              ) : (
                <div className="flex text-lg items-center gap-2">
                  Like <FaRegHeart className="text-2xl" />
                </div>
              )}
              <span>{post.likes?.length || 0}</span>
            </button>

            {isOwner && (
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex text-lg items-center gap-2 text-gray-600 hover:text-red-500 transition-colors font-medium hover:cursor-pointer"
              >
                <FaTrash />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>
      </article>

      {session && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Write a Comment</h2>
          <form onSubmit={handleCommentSubmit} className="relative max-w-full">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Write your comment here..."
              className="w-full p-4 pr-32 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 resize-none overflow-hidden"
              rows={4}
            />
            <button
              type="submit"
              disabled={!commentContent.trim() || commentMutation.isPending}
              className="absolute bottom-4 right-4 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition hover:cursor-pointer"
            >
              {commentMutation.isPending ? "Posting..." : "Post Comment"}
            </button>
          </form>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">
          Comments ({post.comments?.length || 0})
        </h2>

        {post.comments?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {post.comments.map((comment: Comment) => (
              <div
                key={comment._id}
                className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white"
              >
                <div className="flex items-center gap-3 mb-2">
                  {comment.author?.image ? (
                    <Image
                      src={comment.author.image}
                      alt={comment.author.username || "User"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <FaUser className="text-gray-500" />
                  )}
                  <span className="font-medium">
                    {comment.author?.username || "Anonymous"}
                  </span>
                  {(session?.user?._id === comment.author?._id || isOwner) && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      disabled={commentDeleteMutation.isPending}
                      className="text-gray-600 hover:text-red-500 ml-auto font-medium transition-colors hover:cursor-pointer"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-gray-700">{comment.content}</p>
                <div className="text-xs text-gray-500 mt-2">
                  {format(
                    new Date(comment.createdAt),
                    "MMMM d, yyyy 'at' h:mm a"
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </section>
    </div>
  );
}
