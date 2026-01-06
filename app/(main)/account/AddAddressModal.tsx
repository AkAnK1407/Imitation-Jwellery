"use client";

import type React from "react";
import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import CommonInput from "@/app/components/input/CommonInput";
import CommonButton from "@/app/components/button/CommonButton";
import type { Address } from "@/services/address-service";

export type AddAddressPayload = {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

type AddAddressModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  initialData?: Address | null;
  onSave?: (payload: AddAddressPayload) => void;
};

export default function AddAddressModal({
  open,
  onClose,
  isEdit = false,
  initialData,
  onSave,
}: AddAddressModalProps) {
  const [formData, setFormData] = useState<AddAddressPayload>({
    country: "India",
    fullName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Only reinitialize the form when modal is opened
  useEffect(() => {
    if (!open) return;

    if (isEdit && initialData) {
      setFormData({
        country: initialData.country || "India",
        fullName: initialData.fullName || "",
        line1: initialData.line1 || "",
        line2: initialData.line2 || "",
        city: initialData.city || "",
        state: initialData.state || "",
        pincode: initialData.pincode || "",
      });
    } else {
      setFormData({
        country: "India",
        fullName: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        pincode: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
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
              <Dialog.Panel className="w-full max-w-xl rounded-2xl bg-background p-6">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-lg font-medium">
                    {isEdit ? "Edit address" : "Add new address"}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    title="Close"
                    className="p-2 rounded-full hover:bg-foreground/10"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit}>
                  <CommonInput
                    label="Country/region"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                  <CommonInput
                    label="Full name"
                    name="fullName"
                    placeholder="Full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                  <CommonInput
                    label="Address line 1"
                    name="line1"
                    placeholder="Street, area, landmark"
                    value={formData.line1}
                    onChange={handleInputChange}
                    required
                  />
                  <CommonInput
                    label="Address line 2 (optional)"
                    name="line2"
                    placeholder="Apartment, suite, etc"
                    value={formData.line2}
                    onChange={handleInputChange}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <CommonInput
                      label="City"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                    <CommonInput
                      label="State"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                    <CommonInput
                      label="PIN code"
                      name="pincode"
                      type="number"
                      placeholder="PIN code"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <CommonButton
                      type="button"
                      variant="secondaryBtn"
                      onClick={onClose}
                      className="w-fit px-6"
                    >
                      Cancel
                    </CommonButton>
                    <CommonButton type="submit" className="w-fit px-6">
                      Save
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
