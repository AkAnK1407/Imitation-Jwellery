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

export interface User {
  _id: string;
  fullName: string;
  email?: string;
  mobile: string;
}

export interface LoginCredentials {
  mobile: string;
  otp: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8018/api/v1";

// Utility: get device ID for request header consistency
const getDeviceId = (): string => {
  if (typeof window === "undefined") return "";
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = `device-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 15)}`;
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
};

// --- PROFILE: get current user ---
export const fetchUserProfile = async (): Promise<User | null> => {
  const url = `${API_BASE_URL}/customers/me`;
  const deviceId = getDeviceId();

  try {
    const response = await fetch(url, {
      credentials: "include",
      headers: { "X-Device-Id": deviceId },
    });

    if (response.status === 401 || response.status === 403) return null;
    if (!response.ok)
      throw new Error(`Failed to fetch user profile: ${response.status}`);

    const responseData = await response.json();
    // Handles both { data: { customer: { ... } } } or { data: { ... } }
    const customer: User | undefined =
      responseData?.data?.customer ?? responseData?.data ?? undefined;
    if (!customer || !customer._id) return null;

    // Ensure camelCase naming regardless of backend
    return {
      _id: customer._id,
      fullName: customer.fullName,
      email: customer.email,
      mobile: customer.mobile,
    };
  } catch (err) {
    // Optionally report error here
    return null;
  }
};

// --- ADDRESSES: get the current user's addresses ---
export const fetchUserAddresses = async (): Promise<Address[]> => {
  const user = await fetchUserProfile();
  if (!user?._id) throw new Error("No authenticated user");

  const url = `${API_BASE_URL}/customers/${user._id}/addresses`;
  const response = await fetch(url, { credentials: "include" });

  if (!response.ok)
    throw new Error(`Failed to fetch addresses: ${response.status}`);
  const responseData = await response.json();
  // Handles { data: { items: [...] } } or { items: [...] }
  const items: Address[] =
    responseData?.data?.items ?? responseData?.items ?? [];
  return items;
};

// --- LOGIN ---
export const loginUser = async (
  credentials: LoginCredentials
): Promise<{ user: User; token: string }> => {
  const url = `${API_BASE_URL}/customers/login`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`);
  }

  const user = await fetchUserProfile();
  if (!user) throw new Error("Login succeeded but user fetch failed");
  // TODO: backend should return token; here we return mock to satisfy type
  return { user, token: "mock-jwt-token" };
};

// --- PROFILE UPDATE ---
export const updateUserProfile = async (
  payload: Partial<{ fullName: string; email: string; mobile: string }>
): Promise<User> => {
  const url = `${API_BASE_URL}/customers/me`;

  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (response.status === 401)
    throw new Error("Please sign in to update your profile");
  if (!response.ok)
    throw new Error(`Failed to update profile: ${response.status}`);

  // Refresh full profile after update
  const user = await fetchUserProfile();
  if (!user)
    throw new Error("Profile updated, but failed to fetch new profile");
  return user;
};
