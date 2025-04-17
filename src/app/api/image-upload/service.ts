import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface UploadResult {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
}

export const uploadImage = async (imageFile: File): Promise<UploadResult> => {
  if (!ALLOWED_FILE_TYPES.includes(imageFile.type)) {
    throw new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed");
  }

  if (imageFile.size > MAX_FILE_SIZE) {
    throw new Error(
      `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`
    );
  }

  const buffer = Buffer.from(await imageFile.arrayBuffer());

  const uploadResponse = await new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "openpost_images",
        public_id: `img_${Date.now()}`,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });

  return {
    url: uploadResponse.secure_url,
    publicId: uploadResponse.public_id,
    format: uploadResponse.format,
    bytes: uploadResponse.bytes,
  };
};
