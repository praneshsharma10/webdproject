import { uploadUserProfileImage } from "../helpers/user";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";
import Preloader from "./Preloader";

export default function Avatar({ size, url, editable, onChange }) {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [isUploading, setIsUploading] = useState(false);

  async function handleAvatarChange(ev) {
    const file = ev.target.files?.[0];
    if (!file) return; // Early return if no file selected

    setIsUploading(true);
    try {
      await uploadUserProfileImage(supabase, session.user.id, file);
      setIsUploading(false);
      if (onChange) onChange();
    } catch (error) {
      // Handle image upload error (e.g., display error message)
      console.error("Error uploading avatar:", error);
    }
  }

  const width = size === "lg" ? "w-24 md:w-36" : "w-12";

  return (
    <div className={`${width} relative`}>
      <div className="rounded-full overflow-hidden">
        <img src={url} alt="" className="w-full" />
      </div>
      {isUploading && (
        <div className="absolute inset-0 flex items-center bg-white bg-opacity-50 rounded-full">
          <div className="inline-block mx-auto">
            <Preloader />
          </div>
        </div>
      )}
      {editable && (
        <label
          className="absolute bottom-0 right-0 shadow-md shadow-gray-500 p-2 bg-white rounded-full cursor-pointer"
          title="Change avatar"
        >
          <input type="file" className="hidden" onChange={handleAvatarChange} />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            {/* SVG code omitted for brevity */}
          </svg>
        </label>
      )}
    </div>
  );
}
