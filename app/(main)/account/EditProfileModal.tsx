"use client";

import type React from "react";
import { Fragment, useState, useEffect, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import CommonInput from "@/app/components/input/CommonInput";
import CommonButton from "@/app/components/button/CommonButton";
import { useUpdateProfile, useUserProfile } from "@/hooks/use-auth";

type EditProfileModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function EditProfileModal({
  open,
  onClose,
}: EditProfileModalProps) {
  const { data: userProfile } = useUserProfile();
  const updateProfile = useUpdateProfile();

  // Compute the default form data when userProfile changes
  const defaultFormData = useMemo(() => {
    if (!userProfile) {
      return { firstName: "", lastName: "", email: "", mobile: "" };
    }
    const nameParts = (userProfile.fullName || "").trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    return {
      firstName,
      lastName,
      email: userProfile.email || "",
      mobile: userProfile.mobile || "",
    };
  }, [userProfile]);

  // Keep form state in sync ONLY when opening, or when userProfile changes
  const [formData, setFormData] = useState(defaultFormData);
  useEffect(() => {
    if (open) {
      setFormData(defaultFormData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultFormData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({
      fullName: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      mobile: formData.mobile,
    });
    onClose();
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* BACKDROP */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        {/* MODAL */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center px-4 py-10">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                // The key here will remount form if userProfile or modal intent changes
                key={`${open}-${userProfile?.fullName ?? ""}-${
                  userProfile?.email ?? ""
                }-${userProfile?.mobile ?? ""}`}
                className="w-full max-w-xl rounded-2xl bg-background p-6"
              >
                {/* HEADER */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-lg font-medium">
                    Edit profile
                  </Dialog.Title>

                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-foreground/10"
                    aria-label="Close modal"
                    title="Close"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit}>
                  {/* FIRST & LAST NAME */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CommonInput
                      label="First name"
                      name="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                    <CommonInput
                      label="Last name"
                      name="lastName"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* EMAIL */}
                  <CommonInput
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />

                  {/* MOBILE */}
                  <CommonInput
                    label="Mobile"
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleInputChange}
                  />

                  {/* FOOTER ACTIONS */}
                  <div className="pt-4 flex items-center justify-end gap-3">
                    <CommonButton
                      type="button"
                      variant="secondaryBtn"
                      onClick={onClose}
                      className="w-fit max-w-fit px-6"
                    >
                      Cancel
                    </CommonButton>

                    <CommonButton
                      type="submit"
                      disabled={updateProfile.isPending}
                      className="w-fit max-w-fit px-6"
                    >
                      {updateProfile.isPending ? "Saving..." : "Save"}
                    </CommonButton>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
