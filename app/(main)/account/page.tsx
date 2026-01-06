"use client";
import CommonButton from "@/app/components/button/CommonButton";
import CommonHeading from "@/app/components/CommonHeading";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Edit2Icon, Lock, Plus, Pencil, Trash2 } from "lucide-react";
import AddAddressModal, { type AddAddressPayload } from "./AddAddressModal";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import Link from "next/link";
import SignOutConfirmModal from "@/app/components/SignoutConfirm";
import DeleteAddressConfirmModal from "@/app/components/DeleteAddressConfirm";
import { useUserProfile, useLogout } from "@/hooks/use-auth";
import { useOrders } from "@/hooks/use-orders";
import {
  useAddresses,
  useAddAddress,
  useDeleteAddress,
  useSetDefaultAddress,
  useUpdateAddress,
} from "@/hooks/use-address";
import type { Address } from "@/services/address-service";

// UI mapping type for display only
type DisplayAddress = {
  id: string;
  name: string;
  address: string;
  cityZip: string;
  isDefault: boolean;
};

function backendToDisplayAddress(backend: Address): DisplayAddress {
  return {
    id: backend._id,
    name: backend.fullName,
    address: backend.line1 + (backend.line2 ? `, ${backend.line2}` : ""),
    cityZip: `${backend.city}, ${backend.state} ${backend.pincode}`.replace(
      /\s+/g,
      " "
    ),
    isDefault: backend.isDefault,
  };
}

export default function Account() {
  const [openAddAddress, setOpenAddAddress] = useState(false);
  const [isEditAddress, setIsEditAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null); // full backend type!
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openSignOutConfirm, setOpenSignOutConfirm] = useState(false);
  const [openDeleteAddress, setOpenDeleteAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );

  // Full backend data for profile and addresses
  const { data: userProfile } = useUserProfile();
  const { data: orders = [] } = useOrders();
  const { data: backendAddresses = [], isLoading: addressLoading } =
    useAddresses();
  const logout = useLogout();
  const addAddress = useAddAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();

  // UI mapping ONLY for display
  const addresses: DisplayAddress[] = backendAddresses.map(
    backendToDisplayAddress
  );

  const userName = userProfile?.fullName || "User";
  const userPhone = userProfile?.mobile || "+91 0000000000";
  const userEmail = userProfile?.email || "user@example.com";

  const handleSignOut = () => {
    logout.mutate();
    setOpenSignOutConfirm(false);
  };

  const handleAddressSave = (backendPayload: AddAddressPayload) => {
    const label = "Home";
    // Only set as default if it's the first address, or whatever your business logic is
    const isDefault =
      isEditAddress && editingAddress
        ? editingAddress.isDefault
        : backendAddresses.length === 0;

    const payloadWithRequired = {
      ...backendPayload,
      label,
      isDefault,
    };

    if (isEditAddress && editingAddress) {
      updateAddress.mutate({
        addressId: editingAddress._id,
        addressData: payloadWithRequired,
      });
    } else {
      addAddress.mutate(payloadWithRequired);
    }

    setOpenAddAddress(false);
    setIsEditAddress(false);
    setEditingAddress(null);
  };

  const handleDeleteAddress = () => {
    if (selectedAddressId) {
      deleteAddress.mutate(selectedAddressId);
      setOpenDeleteAddress(false);
      setSelectedAddressId(null);
    }
  };

  const handleSetDefaultAddress = (addressId: string) => {
    setDefaultAddress.mutate(addressId);
  };

  // Pass backend address for editing, not display mapping
  const handleEditAddress = (addressId: string) => {
    const found = backendAddresses.find((a) => a._id === addressId) || null;
    setEditingAddress(found);
    setIsEditAddress(true);
    setOpenAddAddress(true);
  };

  return (
    <>
      <div className="accountPage gradientBg">
        <section className="max-w-full px-4 md:px-6 lg:px-10 md:py-12 lg:py-12">
          <CommonHeading
            level={1}
            title="Account"
            description="Proudly Supporting Ethical Sourcing - Every Gemstone Has a Story."
          />

          {/* PRODUCT GRID */}
          <div className="accountSecWrap grid grid-cols-1 gap-5 max-w-5xl mx-auto">
            <div className="accountUserCard p-4 md:p-6 rounded-2xl bg-brand flex items-center gap-4">
              <div className="flex-1">
                <h6 className="text-background text-2xl font-medium font-times mb-0.5">
                  {userName}
                </h6>
                <p className="text-background/80 text-sm mb-0.5">{userPhone}</p>
                <p className="text-background/80 text-sm mb-0">{userEmail}</p>
              </div>
              <button
                onClick={() => setOpenEditProfile(true)}
                className="flex items-center gap-3 max-w-fit bg-background px-6 py-3 rounded-[30px] uppercase font-medium cursor-pointer"
              >
                <Edit2Icon className="w-4 h-4 text-brand" /> Edit Profile
              </button>
            </div>
            <div className="bg-background/50 border border-foreground/10 rounded-2xl p-3 md:p-6">
              <TabGroup className="accountTabsWrap">
                <TabList className="flex items-center rounded-2xl bg-foreground/10 p-1 w-fit">
                  <Tab className="accountTabsLink px-3 md:px-4 py-2 rounded-xl text-foreground font-medium text-sm focus:not-data-focus:outline-none data-focus:outline data-focus:outline-background data-hover:bg-background/50 data-selected:bg-background data-selected:data-hover:bg-background transition-all transition-400">
                    My Orders
                  </Tab>
                  <Tab className="accountTabsLink px-3 md:px-4 py-2 rounded-xl text-foreground font-medium text-sm focus:not-data-focus:outline-none data-focus:outline data-focus:outline-background data-hover:bg-background/50 data-selected:bg-background data-selected:data-hover:bg-background transition-all transition-400">
                    My Addresses
                  </Tab>
                  <Tab className="accountTabsLink px-3 md:px-4 py-2 rounded-xl text-foreground font-medium text-sm focus:not-data-focus:outline-none data-focus:outline data-focus:outline-background data-hover:bg-background/50 data-selected:bg-background data-selected:data-hover:bg-background transition-all transition-400">
                    Settings
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <div className="pt-5">
                      <CommonHeading level={2} title="My Orders" />

                      <div className="space-y-4">
                        {Array.isArray(orders) && orders.length > 0 ? (
                          orders.map((order) => (
                            <Link
                              key={order.id}
                              href={`/orders/${order.id}`}
                              className="block border border-foreground/20 rounded-xl p-5 hover:bg-foreground/5 transition"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                {/* LEFT */}
                                <div>
                                  <p className="font-medium">
                                    Order #{order.id}
                                  </p>
                                  <p className="text-sm text-foreground/70">
                                    Placed on {order.date} • {order.items}{" "}
                                    item(s)
                                  </p>
                                </div>

                                {/* RIGHT */}
                                <div className="flex items-center gap-6">
                                  <p className="text-sm font-medium">
                                    {order.total}
                                  </p>

                                  <span
                                    className={`px-3 py-1 text-xs rounded-full ${
                                      order.status === "Delivered"
                                        ? "bg-green-100 text-green-700"
                                        : order.status === "Shipped"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-yellow-100 text-yellow-700"
                                    }`}
                                  >
                                    {order.status}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <p className="text-foreground/60 text-sm">
                            No orders yet
                          </p>
                        )}
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div className="pt-5">
                      <CommonHeading level={2} title="My Addresses" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <button
                          onClick={() => {
                            setOpenAddAddress(true);
                            setIsEditAddress(false);
                            setEditingAddress(null);
                          }}
                          className="border-2 border-dashed border-foreground/20 rounded-xl p-6 flex flex-col items-center justify-center text-foreground hover:bg-primary/5 transition min-h-55"
                        >
                          <Plus size={28} />
                          <span className="mt-2 font-medium tracking-wide">
                            ADD NEW ADDRESS
                          </span>
                        </button>

                        {addressLoading ? (
                          <p>Loading...</p>
                        ) : addresses.length === 0 ? (
                          <p className="text-foreground/60 text-sm col-span-2">
                            No addresses yet
                          </p>
                        ) : (
                          addresses.map((address) => (
                            <div
                              key={address.id}
                              className="border border-foreground/20 rounded-xl p-5 flex flex-col justify-between"
                            >
                              {/* HEADER: NAME + EDIT */}
                              <div className="flex items-start justify-between gap-3">
                                <p className="font-medium text-sm leading-tight">
                                  {address.name}
                                </p>
                                <CommonButton
                                  variant="iconBtn"
                                  onClick={() => handleEditAddress(address.id)}
                                >
                                  <Pencil size={14} />
                                </CommonButton>
                              </div>
                              {/* ADDRESS DETAILS */}
                              <div className="mt-2 text-sm text-foreground/80 leading-relaxed space-y-0.5">
                                <p className="break-all">{address.address}</p>
                                <p>{address.cityZip}</p>
                                <p>India</p>
                              </div>
                              {/* ACTIONS */}
                              <div className="flex items-center justify-between mt-5">
                                {address.isDefault ? (
                                  <span className="px-4 py-1 text-xs rounded-full bg-brand/80 text-background">
                                    Default
                                  </span>
                                ) : (
                                  <button
                                    onClick={() =>
                                      handleSetDefaultAddress(address.id)
                                    }
                                    className="px-4 py-1 text-xs rounded-full border border-brand hover:bg-brand/80 hover:text-background transition"
                                    disabled={setDefaultAddress.isPending}
                                  >
                                    {setDefaultAddress.isPending
                                      ? "Setting..."
                                      : "Set Default"}
                                  </button>
                                )}
                                <CommonButton
                                  variant="iconBtn"
                                  className="border-red-600 hover:bg-red-600 text-red-600 outline-0 ring-0"
                                  onClick={() => {
                                    setSelectedAddressId(address.id);
                                    setOpenDeleteAddress(true);
                                  }}
                                >
                                  <Trash2 size={16} />
                                </CommonButton>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div className="pt-5">
                      {/* SECTION HEADING */}
                      <CommonHeading level={2} title="Settings" />

                      {/* CARD */}
                      <div className="flex flex-col gap-5">
                        {/* LEFT CONTENT */}
                        <div className="flex items-start gap-4 max-w-xl">
                          <div className="h-10 w-10 min-w-10 rounded-full border border-foreground/20 flex items-center justify-center">
                            <Lock size={18} />
                          </div>

                          <div>
                            <p className="font-medium text-2xl font-times mb-1">
                              Sign out everywhere
                            </p>
                            <p className="text-sm text-foreground/70 leading-relaxed">
                              If you&apos;ve lost a device or have security
                              concerns, signing out everywhere will log you out
                              from all devices to keep your account secure.
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-center gap-3">
                          <CommonButton
                            variant="secondaryBtn"
                            className="w-fit max-w-fit"
                            onClick={() => setOpenSignOutConfirm(true)}
                          >
                            Sign out everywhere
                          </CommonButton>

                          <p className="text-xs text-foreground/60 hidden md:block">
                            You&apos;ll also be signed out on this device.
                          </p>
                        </div>
                      </div>

                      {/* MOBILE HELPER TEXT */}
                      <p className="text-xs text-foreground/60 mt-3 md:hidden">
                        You&apos;ll also be signed out on this device.
                      </p>
                    </div>
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </div>
          </div>
        </section>
      </div>
      <AddAddressModal
        open={openAddAddress}
        onClose={() => {
          setOpenAddAddress(false);
          setIsEditAddress(false);
          setEditingAddress(null);
        }}
        onSave={handleAddressSave}
        isEdit={isEditAddress}
        initialData={editingAddress}
      />
      <EditProfileModal
        open={openEditProfile}
        onClose={() => setOpenEditProfile(false)}
      />
      <SignOutConfirmModal
        open={openSignOutConfirm}
        onClose={() => setOpenSignOutConfirm(false)}
        onConfirm={handleSignOut}
      />
      <DeleteAddressConfirmModal
        open={openDeleteAddress}
        onClose={() => setOpenDeleteAddress(false)}
        onConfirm={handleDeleteAddress}
      />
    </>
  );
}
