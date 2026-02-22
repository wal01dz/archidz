// lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Upload un fichier depuis un Buffer
export async function uploadFile(
  buffer: Buffer,
  filename: string,
  folder: string = "archidz"
): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          public_id: `${Date.now()}-${filename}`,
          resource_type: "auto", // auto-detect image, pdf, etc.
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result!.secure_url);
        }
      )
      .end(buffer);
  });
}

// ── Supprimer un fichier
export async function deleteFile(url: string) {
  const publicId = url.split("/").slice(-2).join("/").split(".")[0];
  await cloudinary.uploader.destroy(publicId);
}

// ── Générer une URL signée (pour fichiers privés)
export function getSignedUrl(publicId: string, expiresInSec = 3600) {
  return cloudinary.url(publicId, {
    sign_url: true,
    type: "authenticated",
    expires_at: Math.floor(Date.now() / 1000) + expiresInSec,
  });
}
