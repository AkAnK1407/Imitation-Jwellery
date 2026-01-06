// services/address-service.ts

// Types matching your backend
export interface Address {
  _id: string;
  customerId: string;
  label: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  _id: string;
  fullName: string;
  email?: string;
  mobile: string;
  // ...add others as needed
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8018/api/v1";

// Matches backend model (without non-creatable fields)
interface AddressPayload {
  label?: string;
  fullName?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  isDefault?: boolean;
}

// How you get current customer profile—must return `Customer` (with `_id`)
const fetchUserProfile = async (): Promise<Customer> => {
  const res = await fetch(`${API_BASE_URL}/customers/me`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch user profile");
  const data = await res.json();
  return data.customer as Customer;
};

const getCurrentCustomerId = async (): Promise<string> => {
  const me = await fetchUserProfile();
  if (!me?._id || me._id === "guest")
    throw new Error("Please sign in to manage addresses");
  return me._id;
};

// Show detailed errors for UI
const getApiError = async (
  response: Response,
  fallback = "Request failed"
): Promise<never> => {
  try {
    const d = await response.json();
    throw new Error(d?.message || d?.error || fallback);
  } catch {
    throw new Error(fallback);
  }
};

// ===== READ (List all addresses) =====
export const fetchAddresses = async (): Promise<Address[]> => {
  const customerId = await getCurrentCustomerId();
  const url = `${API_BASE_URL}/customers/${customerId}/addresses`;
  const response = await fetch(url, { method: "GET", credentials: "include" });
  if (!response.ok) return getApiError(response, "Failed to fetch addresses");
  const data: { items: Address[] } = await response.json();
  return data.items || [];
};

// ===== CREATE =====
export const addAddress = async (
  addressData: Omit<Address, "_id" | "customerId" | "createdAt" | "updatedAt">
): Promise<Address> => {
  const customerId = await getCurrentCustomerId();
  const {
    label,
    fullName,
    line1,
    line2,
    city,
    state,
    pincode,
    country,
    isDefault,
  } = addressData;
  const body: AddressPayload = {
    label,
    fullName,
    line1,
    line2,
    city,
    state,
    pincode,
    country,
    isDefault,
  };

  const url = `${API_BASE_URL}/customers/${customerId}/addresses`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!response.ok) return getApiError(response, "Failed to add address");

  const data: { address: Address } = await response.json();
  return data.address;
};

// ===== UPDATE =====
export const updateAddress = async (
  addressId: string,
  addressData: Partial<
    Omit<Address, "_id" | "customerId" | "createdAt" | "updatedAt">
  >
): Promise<Address> => {
  const customerId = await getCurrentCustomerId();
  const url = `${API_BASE_URL}/customers/${customerId}/addresses/${addressId}`;
  const body: AddressPayload = { ...addressData };

  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!response.ok) return getApiError(response, "Failed to update address");
  const data: { address: Address } = await response.json();
  return data.address;
};

// ===== DELETE =====
export const deleteAddress = async (
  addressId: string
): Promise<{ success: boolean }> => {
  const customerId = await getCurrentCustomerId();
  const url = `${API_BASE_URL}/customers/${customerId}/addresses/${addressId}`;
  const response = await fetch(url, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) return getApiError(response, "Failed to delete address");
  return { success: true };
};

// ===== SET DEFAULT =====
export const setDefaultAddress = async (
  addressId: string
): Promise<Address> => {
  return updateAddress(addressId, { isDefault: true });
};
