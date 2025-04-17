"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "@/lib/http/api";
import { Post } from "@/types";
import Link from "next/link";
import Image from "next/image";
import {
  ErrorDisplay,
  Loading,
  NotFoundDisplay,
} from "@/components/UIStatus.tsx";

const PostsPage = () => {
  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  if (isLoading) return <Loading />;
  if (isError) return <ErrorDisplay error={error} />;
  if (!posts) return <NotFoundDisplay />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-5">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Posts</h1>
        <Link
          href="/create"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
        >
          Create New Post
        </Link>
      </div>

      {posts?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No posts found.</p>
          <Link
            href="/create"
            className="inline-block mt-4 text-green-600 hover:underline"
          >
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts?.map((post) => (
            <div
              key={post._id}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white"
            >
              {post.image?.url && (
                <div className="relative h-48 w-full">
                  <Image
                    src={post.image.url}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.content}
                </p>
                <div className="flex justify-between items-center">
                  <Link
                    href={`/${post._id}`}
                    className="text-green-600 hover:underline font-medium"
                  >
                    Read More
                  </Link>
                  <span className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostsPage;
