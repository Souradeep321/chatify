import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Calendar, CheckCircle } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);

      // Create FormData to send file properly
      const formData = new FormData();
      formData.append("avatar", file);

      await updateProfile(formData);
    };
  };

  // Format date: "2025-07-19T15:58:17.784Z" -> "July 19, 2025"
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-base-200 pt-20 pb-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-base-100 rounded-xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-center">
            <h1 className="text-3xl font-bold text-white">Your Profile</h1>
            <p className="text-primary-content opacity-80 mt-2">
              Manage your account information
            </p>
          </div>

          {/* Avatar Section */}
          <div className="p-6 flex flex-col items-center -mt-12">
            <div className="relative mb-4">
              <div className="avatar">
                <div className="w-32 h-32 rounded-full ring-4 ring-base-100 bg-base-200">
                  <img
                    src={selectedImg || authUser?.avatar?.url || "/avatar.png"}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-2 right-2 
                  bg-accent hover:bg-accent-focus 
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-300 shadow-md
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-white" />
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

            <div className="text-center">
              <h2 className="text-2xl font-semibold">
                {authUser?.username || "Not provided"}
              </h2>
              <p className="text-sm mt-2 text-gray-500 flex items-center justify-center">
                {isUpdatingProfile ? (
                  <>
                    <span className="loading loading-spinner loading-xs mr-2"></span>
                    Uploading avatar...
                  </>
                ) : (
                  "Click camera icon to update your photo"
                )}
              </p>
            </div>
          </div>

          {/* User Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{authUser?.username || "Not provided"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium">{authUser?.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">{formatDate(authUser?.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Status</p>
                  <p className="font-medium text-success">Active</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-base-300 p-6 rounded-lg mx-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <User className="mr-2" size={18} />
              Account Details
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-base-content/10">
                <span>Username</span>
                <span className="font-medium">@{authUser?.username}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Last Updated</span>
                <span className="font-medium">
                  {formatDate(authUser?.updatedAt) || "Never"}
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