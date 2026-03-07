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
    <div className="flex flex-col h-full bg-[#f0f2f5] animate-in fade-in duration-300">
      {/* Header */}
      <header className="h-[108px] bg-brand flex items-end px-8 pb-4 shrink-0 text-white shadow-md z-10">
        <button
          onClick={() => setView("CHATS")}
          className="mr-6 hover:bg-white/20 p-2 rounded-full transition-colors flex items-center gap-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium text-[16px]">Back</span>
        </button>
        <h1 className="text-[22px] font-semibold tracking-wide ml-4">Profile Overview</h1>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar py-10 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Top Section: Avatar & Quick Stats */}
          <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="shrink-0 flex flex-col items-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="relative group w-[180px] h-[180px] rounded-full overflow-hidden shadow-md ring-4 ring-[#f0f2f5]"
                title="Change Profile Photo"
              >
                <UserAvatar user={user} size="full" className="w-full h-full text-5xl object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer backdrop-blur-sm">
                  <svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.016 4.969c.516 0 .984.469.984.984v12.094c0 .516-.469 1.031-.984 1.031h-18.047c-.516 0-.984-.515-.984-1.031v-12.094c0-.515.468-.984.984-.984h18.047zm-18.047 12.094l5.016-6.047 3.984 4.969 5.016-6.516 4.031 7.594h-18.047z" />
                  </svg>
                  <span className="text-xs uppercase tracking-wider font-semibold text-center px-4">Change Photo</span>
                </div>
              </button>
              <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
            </div>

            <div className="flex-1 w-full pt-4">
              <h2 className="text-3xl font-bold text-[#111b21] mb-2">{identityForm.username}</h2>
              <p className="text-[#667781] text-lg mb-6">{identityForm.bio || "Available"}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#f0f2f5] rounded-xl p-4 flex items-center gap-4">
                  <div className="bg-brand/10 p-3 rounded-full text-brand">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#667781] uppercase font-semibold tracking-wider">Email Address</p>
                    <p className="text-[#111b21] font-medium">{user.email || "Not provided"}</p>
                  </div>
                </div>
                <div className="bg-[#f0f2f5] rounded-xl p-4 flex items-center gap-4">
                  <div className="bg-brand/10 p-3 rounded-full text-brand">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#667781] uppercase font-semibold tracking-wider">Member Since</p>
                    <p className="text-[#111b21] font-medium">Recently Joined</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Edit Identity */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-[#f0f2f5] bg-gray-50/50">
              <h3 className="text-lg font-semibold text-[#111b21]">Identity Information</h3>
              <p className="text-sm text-[#667781]">Update your visible name and what you are up to.</p>
            </div>

            <div className="p-8 space-y-8">
              {/* Name Edit */}
              <div>
                <label className="text-sm font-semibold text-brand tracking-wide uppercase mb-2 flex">Your Name</label>
                <div className="flex items-center group relative mt-2 bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-brand/30 transition-colors">
                  {isEditingName ? (
                    <div className="flex-1 flex flex-col">
                      <input autoFocus className="w-full text-[#111b21] text-lg outline-none bg-transparent font-medium" value={identityForm.username} onChange={(e) => setIdentityForm((prev) => ({ ...prev, username: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && handleSaveName()} />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-3">
                        <button onClick={handleSaveName} className="bg-brand text-white p-1.5 rounded-md hover:bg-brand/90 transition-colors shadow-sm">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-[#111b21] text-lg font-medium flex-1">{identityForm.username}</p>
                      <button onClick={() => setIsEditingName(true)} className="text-[#8696a0] hover:text-brand transition-colors p-2 rounded-md hover:bg-brand/10">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
                      </button>
                    </>
                  )}
                </div>
                <p className="text-sm text-[#667781] mt-2 ml-1">This name will be visible to your Himate contacts.</p>
              </div>

              {/* Bio Edit */}
              <div>
                <label className="text-sm font-semibold text-brand tracking-wide uppercase mb-2 flex">About</label>
                <div className="flex items-center group relative mt-2 bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-brand/30 transition-colors">
                  {isEditingBio ? (
                    <div className="flex-1 flex flex-col">
                      <input autoFocus className="w-full text-[#111b21] text-lg outline-none bg-transparent font-medium" value={identityForm.bio} onChange={(e) => setIdentityForm((prev) => ({ ...prev, bio: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && handleSaveBio()} />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-3">
                        <button onClick={handleSaveBio} className="bg-brand text-white p-1.5 rounded-md hover:bg-brand/90 transition-colors shadow-sm">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-[#111b21] text-lg font-medium flex-1 truncate">{identityForm.bio || "Available"}</p>
                      <button onClick={() => setIsEditingBio(true)} className="text-[#8696a0] hover:text-brand transition-colors p-2 rounded-md hover:bg-brand/10">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
