import { getAuthToken } from "@/utils/cookie";

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1";

export interface UploadResponse {
  success: boolean;
  message?: string;
  data?: {
    url: string;
  };
}

/**
 * Uploads a single image file or base64 data to Cloudinary / Backend Storage
 * Returns the short, clean HTTPS URL.
 */
export const uploadImageAPI = async (
  fileOrBase64: File | string,
  folder = "cleanix"
): Promise<{ success: boolean; url: string; message?: string }> => {
  try {
    const baseUrl = getBaseUrl();
    const token = getAuthToken();

    // 1. If it's already a standard HTTP / HTTPS remote URL, return as-is
    if (typeof fileOrBase64 === "string" && (fileOrBase64.startsWith("http://") || fileOrBase64.startsWith("https://"))) {
      return { success: true, url: fileOrBase64 };
    }

    // 2. If it's a File object, pre-compress to WebP in browser (10MB -> ~80KB) while keeping crystal clear HD quality
    if (typeof fileOrBase64 !== "string") {
      let fileToSend: File = fileOrBase64;
      try {
        const { compressFileToBlob } = await import("@/utils/imageCompressor");
        const compressedBlob = await compressFileToBlob(fileOrBase64, 1920, 1920, 0.84);
        const fileName = fileOrBase64.name.replace(/\.[^/.]+$/, "") + ".webp";
        fileToSend = new File([compressedBlob], fileName, { type: "image/webp" });
      } catch (compErr) {
        console.warn("Client pre-compression skipped, sending original:", compErr);
      }

      const formData = new FormData();
      formData.append("file", fileToSend);
      formData.append("folder", folder);

      const res = await fetch(`${baseUrl}/upload/image`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data: UploadResponse = await res.json();
      if (data?.success && data?.data?.url) {
        return { success: true, url: data.data.url };
      }
      return { success: false, url: "", message: data?.message || "Failed to upload image to server." };
    }

    // 3. If it's a base64 string, send as JSON body
    const res = await fetch(`${baseUrl}/upload/image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        image: fileOrBase64,
        folder,
      }),
    });

    const data: UploadResponse = await res.json();
    if (data?.success && data?.data?.url) {
      return { success: true, url: data.data.url };
    }
    return { success: false, url: "", message: data?.message || "Failed to upload image to server." };
  } catch (error: any) {
    console.error("Error in uploadImageAPI:", error);
    return { success: false, url: "", message: error?.message || "Network error uploading image." };
  }
};

/**
 * Uploads multiple image files to Cloudinary / Backend Storage
 */
export const uploadMultipleImagesAPI = async (
  files: (File | string)[],
  folder = "cleanix"
): Promise<string[]> => {
  try {
    const uploadPromises = files.map((f) => uploadImageAPI(f, folder));
    const results = await Promise.all(uploadPromises);
    return results.map((r) => r.url).filter(Boolean);
  } catch (err) {
    console.error("Error in uploadMultipleImagesAPI:", err);
    return [];
  }
};
