"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@nextui-org/react";
import { createClient } from "@/utils/supabase/client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/react";
import {Link} from '@nextui-org/react'
function MyInfo({ session }) {
  const supabase = createClient();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();
    setIsLoading(false);
    setProfile(data);
  };

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      console.log("1234");
      toast.error("The new password does not match.");
      return;
    }
    console.log("55555");
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrorMessage("");
      router.refresh();
    } catch (error) {
      toast.error("Error changing password: " + error.message);
    }
  };

  const changeInfo = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        name: profile.name,
        phone: profile.phone,
        email: profile.email,
        recommenderEmail: profile.recommenderEmail,
        recommenderPhone: profile.recommenderPhone,
        businessName: profile.businessName,
        businessRegistrationNumber: profile.businessRegistrationNumber,
        businessCertificate: profile.businessCertificate,
      })
      .eq("id", session.user.id);

    if (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating the profile.");
    } else {
      toast.success("Profile updated successfully.");
      router.refresh();
    }
  };

  const uploadBusinessCertificate = async (file) => {
    setIsUploading(true);
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("certificate")
      .upload(`public/${session.user.id}/${fileName}`, file);

    if (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file: " + error.message);
      setIsUploading(false);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("certificate")
      .getPublicUrl(`public/${session.user.id}/${fileName}`);

    setIsUploading(false);
    return publicUrl;
  };

  return (
    <div className="flex flex-col gap-y-5">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="w-full flex justify-start items-center">
        {isLoading ? (
          <div className="w-full flex justify-center items-center">
            <Spinner color="primary" />
          </div>
        ) : (
          <div className="w-full">
            <div class="space-y-6">
              <div class="md:flex items-center gap-10">
                <label class="md:w-32 text-right"> Name </label>
                <div class="flex-1 max-md:mt-4">
                  <input
                    type="text"
                    placeholder="Monroe"
                    class="w-full"
                    value={profile?.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div class="md:flex items-center gap-10">
                <label class="md:w-32 text-right"> Phone </label>
                <div class="flex-1 max-md:mt-4">
                  <input
                    type="text"
                    placeholder="info@mydomain.com"
                    class="w-full"
                    value={profile?.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                  />
                </div>
              </div>
              <div class="md:flex items-center gap-10">
                <label class="md:w-32 text-right"> Email </label>
                <div class="flex-1 max-md:mt-4">
                  <input
                    type="text"
                    placeholder="info@mydomain.com"
                    class="w-full"
                    value={profile?.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <div class="md:flex items-center gap-10">
                <label class="md:w-32 text-right"> Recommender Email </label>
                <div class="flex-1 max-md:mt-4">
                  <input
                    type="text"
                    placeholder="info@mydomain.com"
                    class="w-full"
                    value={profile?.recommenderEmail}
                    onChange={(e) =>
                      setProfile({ ...profile, recommenderEmail: e.target.value })
                    }
                  />
                </div>
              </div>
              <div class="md:flex items-center gap-10">
                <label class="md:w-32 text-right"> Recommender Phone </label>
                <div class="flex-1 max-md:mt-4">
                  <input
                    type="text"
                    placeholder="info@mydomain.com"
                    class="w-full"
                    value={profile?.recommenderPhone}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        recommenderPhone: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div class="md:flex items-center gap-10">
                <label class="md:w-32 text-right"> Business Name </label>
                <div class="flex-1 max-md:mt-4">
                  <input
                    type="text"
                    placeholder="info@mydomain.com"
                    class="w-full"
                    value={profile?.businessName}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        businessName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div class="md:flex items-center gap-10">
                <label class="md:w-32 text-right"> Business Registration Number </label>
                <div class="flex-1 max-md:mt-4">
                  <input
                    type="text"
                    placeholder="info@mydomain.com"
                    class="w-full"
                    value={profile?.businessRegistrationNumber}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        businessRegistrationNumber: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div class="md:flex items-center gap-10">
                <label class="md:w-32 text-right"> Business Certificate </label>
                <div class="flex-1 max-md:mt-4">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    class="w-full"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const publicUrl = await uploadBusinessCertificate(file);
                        if (publicUrl) {
                          setProfile({
                            ...profile,
                            businessCertificate: publicUrl,
                          });
                        }
                      }
                    }}
                  />
                  {isUploading && <p>Uploading...</p>}
                  {profile?.businessCertificate && (
                    <p class="mt-2 text-sm text-gray-600">
                      <Link target="_blank" href={profile.businessCertificate}>
                        View Business Certificate
                      </Link>
                    </p>
                  )}
                </div>
              </div>

              <div class="md:flex items-start gap-10 " hidden>
                <label class="md:w-32 text-right"> Avatar </label>
                <div class="flex-1 flex items-center gap-5 max-md:mt-4">
                  <img
                    src="assets/images/avatars/avatar-3.jpg"
                    alt=""
                    class="w-10 h-10 rounded-full"
                  />
                  <button
                    type="submit"
                    class="px-4 py-1 rounded-full bg-slate-100/60 border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  >
                    {" "}
                    Change
                  </button>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-4 mt-16 lg:pl-[10.5rem]">
              <button
                type="button"
                class="button lg:px-10 bg-primary text-white max-md:flex-1"
                onClick={changeInfo}
              >
                {" "}
                Save <span class="ripple-overlay"></span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyInfo;
