"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { createPost } from "@/lib/http/api";
import { PostCreateInput } from "@/lib/schema/post";
import { Post } from "@/types";
import Image from "next/image";

const CreatePostPage: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PostCreateInput>();

  const { mutate, isPending } = useMutation<Post, Error, FormData>({
    mutationFn: createPost,
    onSuccess: () => {
      router.push("/");
      setErrorMessage("");
      setPreview(null);
    },
    onError: (error: Error) => {
      setErrorMessage(error.message || "Failed to create post");
    },
  });

  const onSubmit = async (data: PostCreateInput) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("image", data.image);

    mutate(formData);
  };

  const handleRemoveImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);

    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

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
              render={({ field: { onChange, onBlur, name, ref } }) => (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    id="image"
                    name={name}
                    ref={ref}
                    onBlur={onBlur}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (preview) URL.revokeObjectURL(preview);
                        const url = URL.createObjectURL(file);
                        setPreview(url);
                        onChange(file);
                      } else {
                        handleRemoveImage();
                        onChange(null);
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />

                  {preview && (
                    <div className="mt-4 relative inline-block">
                      <Image
                        src={preview}
                        width={300}
                        height={240}
                        alt="Preview"
                        className="max-h-60 rounded-md object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          handleRemoveImage();
                          onChange(null);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        title="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </>
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
