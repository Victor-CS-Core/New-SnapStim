import { storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";

export interface UploadProgress {
    progress: number;
    uploading: boolean;
    error: string | null;
}

export function useImageUpload() {
    const [uploadState, setUploadState] = useState<UploadProgress>({
        progress: 0,
        uploading: false,
        error: null,
    });

    const uploadImage = async (
        file: File,
        userId: string,
        folder: string = "avatars"
    ): Promise<string> => {
        // Validate file type
        if (!file.type.startsWith("image/")) {
            const error = "Please select an image file";
            setUploadState({ progress: 0, uploading: false, error });
            throw new Error(error);
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            const error = "Image size must be less than 5MB";
            setUploadState({ progress: 0, uploading: false, error });
            throw new Error(error);
        }

        // Create storage reference with unique filename
        const timestamp = Date.now();
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const path = `${folder}/${userId}/${timestamp}_${sanitizedFileName}`;
        const storageRef = ref(storage, path);

        return new Promise((resolve, reject) => {
            setUploadState({ progress: 0, uploading: true, error: null });

            const uploadTask = uploadBytesResumable(storageRef, file, {
                contentType: file.type,
                customMetadata: {
                    uploadedBy: userId,
                    originalName: file.name,
                    uploadTime: new Date().toISOString(),
                },
            });

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadState({ progress, uploading: true, error: null });
                },
                (error) => {
                    const errorMessage =
                        error.code === "storage/unauthorized"
                            ? "You don't have permission to upload files"
                            : error.code === "storage/canceled"
                              ? "Upload was cancelled"
                              : error.code === "storage/quota-exceeded"
                                ? "Storage quota exceeded"
                                : "Upload failed. Please try again.";

                    setUploadState({
                        progress: 0,
                        uploading: false,
                        error: errorMessage,
                    });
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(
                            uploadTask.snapshot.ref
                        );
                        setUploadState({
                            progress: 100,
                            uploading: false,
                            error: null,
                        });
                        resolve(downloadURL);
                    } catch (error) {
                        const errorMessage = "Failed to get download URL";
                        setUploadState({
                            progress: 0,
                            uploading: false,
                            error: errorMessage,
                        });
                        reject(error);
                    }
                }
            );
        });
    };

    const resetUploadState = () => {
        setUploadState({ progress: 0, uploading: false, error: null });
    };

    return {
        uploadImage,
        uploadState,
        resetUploadState,
    };
}
