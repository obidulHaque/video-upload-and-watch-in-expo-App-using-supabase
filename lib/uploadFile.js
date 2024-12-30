import { supabase } from "./superbase"; // Ensure this points to your Supabase client setup
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";

export const uploadFile = async (fileUri) => {
  try {
    const fileExt = fileUri.split(".").pop(); // Get the file extension
    const fileName = `${Date.now()}.${fileExt}`; // Generate a unique file name
    console.log(fileName);
    const fileContent = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Upload the file to the specified bucket
    const { data, error } = await supabase.storage
      .from("only for upload") // Replace with your bucket name
      .upload(fileName, Buffer.from(fileContent, "base64"), {
        contentType: `image/${fileExt}`, // Set appropriate content type
      });

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    // Get the public URL of the uploaded file
    const publicUrl = supabase.storage
      .from("only for upload")
      .getPublicUrl(fileName);

    return publicUrl.data.publicUrl; // Return the public URL
  } catch (err) {
    console.error("Error uploading file:", err);
    return null;
  }
};
