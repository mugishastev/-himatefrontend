import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../../store/auth.store";
import { UserAvatar } from "./UserAvatar";
import { usersApi } from "../../../api/users.api";
import { useUIStore } from "../../../store/ui.store";

export const ProfileView: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const { setView } = useUIStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);

  const [identityForm, setIdentityForm] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
  });

  // Original states for revert on cancel
  const [originalForm, setOriginalForm] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user?.id) return;
    setIdentityForm({
      username: user.username || "",
      bio: user.bio || "",
    });
    setOriginalForm({
      username: user.username || "",
      bio: user.bio || "",
    });
  }, [user?.bio, user?.id, user?.username]);

  const handleSaveName = async () => {
    if (!user?.id) return;
    if (!identityForm.username.trim()) {
      setIdentityForm((prev) => ({ ...prev, username: originalForm.username }));
      setIsEditingName(false);
      return;
    }

    try {
      const updated = await usersApi.update(Number(user.id), {
        username: identityForm.username,
      });
      updateUser({ username: updated.username });
      setOriginalForm((prev) => ({ ...prev, username: updated.username }));
      setIsEditingName(false);
    } catch (error) {
      console.error("Failed to update name", error);
      setIdentityForm((prev) => ({ ...prev, username: originalForm.username }));
      setIsEditingName(false);
    }
  };

  const handleSaveBio = async () => {
    if (!user?.id) return;
    try {
      const updated = await usersApi.update(Number(user.id), {
        bio: identityForm.bio,
      });
      updateUser({ bio: updated.bio });
      setOriginalForm((prev) => ({ ...prev, bio: updated.bio }));
      setIsEditingBio(false);
    } catch (error) {
      console.error("Failed to update bio", error);
      setIdentityForm((prev) => ({ ...prev, bio: originalForm.bio }));
      setIsEditingBio(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    try {
      const result = await usersApi.uploadProfileImage(Number(user.id), file);
      updateUser({
        profileImage: result.profileImage,
        avatarUrl: result.profileImage,
      });
    } catch (error) {
      console.error("Failed to upload profile image", error);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-full bg-[#f0f2f5] animate-in slide-in-from-left duration-300">
      {/* WhatsApp Header */}
      <header className="h-[108px] bg-[#008069] flex items-end px-6 pb-4 shrink-0 text-white">
        <button
          onClick={() => setView("CHATS")}
          className="mr-6 hover:bg-white/10 p-1 rounded-full transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <h1 className="text-[19px] font-medium tracking-wide">Profile</h1>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        {/* Avatar Section */}
        <div className="bg-[#f0f2f5] py-7 flex justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="relative group w-[200px] h-[200px] rounded-full overflow-hidden shadow-sm"
            title="Change Profile Photo"
          >
            <UserAvatar
              user={user}
              size="xl"
              className="w-full h-full text-5xl object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer">
              <svg
                className="w-8 h-8 mb-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21.016 4.969c.516 0 .984.469.984.984v12.094c0 .516-.469 1.031-.984 1.031h-18.047c-.516 0-.984-.515-.984-1.031v-12.094c0-.515.468-.984.984-.984h18.047zm-18.047 12.094l5.016-6.047 3.984 4.969 5.016-6.516 4.031 7.594h-18.047z" />
              </svg>
              <span className="text-xs uppercase tracking-wide font-medium text-center px-4">
                Change
                <br />
                Profile Photo
              </span>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleAvatarUpload}
          />
        </div>

        {/* Name Section */}
        <div className="bg-white px-7 py-3 shadow-sm mb-3">
          <h2 className="text-[14px] text-[#008069] mb-4">Your name</h2>
          <div className="flex items-center group relative pb-2">
            {isEditingName ? (
              <div className="flex-1 flex flex-col">
                <input
                  autoFocus
                  className="w-full text-[#111b21] text-[17px] outline-none border-b-2 border-[#008069] pb-1 bg-transparent"
                  value={identityForm.username}
                  onChange={(e) =>
                    setIdentityForm((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                />
                <div className="absolute right-0 top-0 flex gap-2">
                  <button onClick={handleSaveName} className="text-[#008069]">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8.03 18.03l-4.54-4.54-1.41 1.41 5.95 5.95 12.02-12.02-1.41-1.41z" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-[#111b21] text-[17px] flex-1 pb-1">
                  {identityForm.username}
                </p>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-[#8696a0] hover:text-[#54656f]"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="px-7 py-3">
          <p className="text-[13.5px] text-[#667781] leading-relaxed">
            This is not your username or pin. This name will be visible to your
            WhatsApp contacts.
          </p>
        </div>

        {/* About Section */}
        <div className="bg-white px-7 py-3 shadow-sm mt-3">
          <h2 className="text-[14px] text-[#008069] mb-4">About</h2>
          <div className="flex items-center group relative pb-2">
            {isEditingBio ? (
              <div className="flex-1 flex flex-col">
                <input
                  autoFocus
                  className="w-full text-[#111b21] text-[17px] outline-none border-b-2 border-[#008069] pb-1 bg-transparent"
                  value={identityForm.bio}
                  onChange={(e) =>
                    setIdentityForm((prev) => ({
                      ...prev,
                      bio: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleSaveBio()}
                />
                <div className="absolute right-0 top-0 flex gap-2">
                  <button onClick={handleSaveBio} className="text-[#008069]">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8.03 18.03l-4.54-4.54-1.41 1.41 5.95 5.95 12.02-12.02-1.41-1.41z" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-[#111b21] text-[17px] flex-1 pb-1 truncate">
                  {identityForm.bio || "Available"}
                </p>
                <button
                  onClick={() => setIsEditingBio(true)}
                  className="text-[#8696a0] hover:text-[#54656f]"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
