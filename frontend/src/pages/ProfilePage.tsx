import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Edit, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [selectedImg, setSelectedImg] = useState(authUser?.profilePic || "");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return null;
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image as string);
    };

    const formData = new FormData();

    formData.append("profilePic", file);
    const userId = authUser?.id;
    await updateProfile(formData, userId);
  };

  const updateFullName = () => {
    setEditing((prev) => !prev);
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <div className="max-w-2xl mx-auto p-6 pt-20">
        <div className="bg-base-300 rounded-xl p-4 space-y-3 ">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser?.profilePic}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </div>
                <div className="px-4 py-2.5 bg-base-200 rounded-lg border flex justify-between items-center w-full">
                  {editing ? (
                    <div>hi</div>
                  ) : (
                    <>
                      <span>{authUser?.name}</span>
                      <button
                        className="cursor-pointer"
                        onClick={updateFullName}
                      >
                        <Edit size={20} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {authUser?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-0 bg-base-300 rounded-xl px-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>
                  {authUser?.createdAt &&
                    new Date(authUser.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
