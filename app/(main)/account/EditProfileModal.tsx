"use client"

import type React from "react"

import { Fragment, useState, useEffect, useRef } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { X } from "lucide-react"
import CommonInput from "@/app/components/input/CommonInput"
import CommonButton from "@/app/components/button/CommonButton"
import { useUpdateProfile, useUserProfile } from "@/hooks/use-auth"

type EditProfileModalProps = {
  open: boolean
  onClose: () => void
}

export default function EditProfileModal({ open, onClose }: EditProfileModalProps) {
  const { data: userProfile } = useUserProfile()
  const updateProfile = useUpdateProfile()
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })
  
  // Use ref to track if we should sync on next open
  const shouldSyncRef = useRef(true)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync form data when modal opens
  useEffect(() => {
    // Clear any existing timeout to prevent race conditions
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
    if (open && userProfile && shouldSyncRef.current) {
      // Schedule the update for next render cycle to avoid cascading
      timeoutRef.current = setTimeout(() => {
        // Split name more robustly
        const nameParts = (userProfile.name || "").trim().split(/\s+/)
        const firstName = nameParts[0] || ""
        const lastName = nameParts.slice(1).join(" ") || ""
        
        setFormData({
          firstName,
          lastName,
          email: userProfile.email || "",
        })
        timeoutRef.current = null
      }, 0)
      shouldSyncRef.current = false
    }
    
    // Reset sync flag when modal closes
    if (!open) {
      shouldSyncRef.current = true
    }
    
    // Cleanup only on unmount or when dependencies change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [open, userProfile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile.mutate({
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
    })
    // Close modal after submission
    onClose()
  }

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
              <Dialog.Panel className="w-full max-w-xl rounded-2xl bg-background p-6">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-lg font-medium">Edit profile</Dialog.Title>

                  <button onClick={onClose} className="p-2 rounded-full hover:bg-foreground/10">
                    <X size={18} />
                  </button>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="">
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
                  <div>
                    <CommonInput
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

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

                    <CommonButton type="submit" disabled={updateProfile.isPending} className="w-fit max-w-fit px-6">
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
  )
}
