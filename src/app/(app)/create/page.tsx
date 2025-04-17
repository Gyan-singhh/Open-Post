"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createPost } from "@/lib/http/api";
import { Post } from "@/types";
import { PostCreateInput } from "@/lib/schema/post";
import { useRouter } from "next/navigation";

const CreatePostPage: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PostCreateInput>();

  const [errorMessage, setErrorMessage] = useState("");

  const { mutate, isPending } = useMutation<Post, Error, FormData>({
    mutationFn: createPost,
    onSuccess: () => {
      router.push("/");
      reset();
      setErrorMessage("");
    },
    onError: (error: Error) => {
      setErrorMessage(error.message || "Failed to create post");
    },
  });

  const onSubmit = async (data: PostCreateInput) => {
    if (!data.image || data.image.length === 0) {
      setErrorMessage("Image is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("image", data.image[0]);

    mutate(formData);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <div className="rounded-lg shadow-md p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-white">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          Create a New Post
        </h1>

        {errorMessage && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="text-red-700">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter title..."
              {...register("title", { required: "Title is required" })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              rows={8}
              placeholder="Write your post content here..."
              {...register("content", { required: "Content is required" })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">
                {errors.content.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Image <span className="text-red-500">*</span>
            </label>
            <Controller
              name="image"
              control={control}
              rules={{ required: "Image is required" }}
              render={({ field: { onChange, value, ...rest } }) => (
                <input
                  type="file"
                  accept="image/*"
                  id="image"
                  onChange={(e) => onChange(e.target.files)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  {...rest}
                />
              )}
            />

            {errors.image && (
              <span className="text-red-500 text-sm">
                {errors.image.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
