import axios from "axios";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";

const nodeEnvironment = process.env.NEXT_PUBLIC_NODE_ENV;
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
const tokenName = process.env.NEXT_PUBLIC_TOKENNAME;

export function getServerUrl() {
  if (nodeEnvironment === "development") {
    return serverUrl;
  }

  if (nodeEnvironment === "machine_IP") {
    return serverUrl;
  }

  if (nodeEnvironment === "server") {
    return serverUrl;
  }

  return serverUrl;
}

// ---- Simple Global Loader using Axios interceptors (client-only) ----
let interceptorInitialized = false;
let activeAxiosRequests = 0;

function ensureLoaderElement() {
  if (typeof window === "undefined") return null;
  let el = document.getElementById("__global_api_loader");
  if (!el) {
    el = document.createElement("div");
    el.id = "__global_api_loader";
    el.style.position = "fixed";
    el.style.inset = "0";
    el.style.display = "none";
    el.style.alignItems = "center";
    el.style.justifyContent = "center";
    el.style.background = "rgba(0,0,0,0.3)";
    el.style.zIndex = "1000";

    const spinner = document.createElement("div");
    spinner.style.width = "40px";
    spinner.style.height = "40px";
    spinner.style.border = "4px solid rgba(255,255,255,0.4)";
    spinner.style.borderTopColor = "#fff";
    spinner.style.borderRadius = "9999px";
    spinner.style.animation = "spin 1s linear infinite";

    // basic keyframes
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`;
    document.head.appendChild(styleTag);

    el.appendChild(spinner);
    document.body.appendChild(el);
  }
  return el;
}

function showLoader() {
  const el = ensureLoaderElement();
  if (!el) return;
  el.style.display = "flex";
}

function hideLoader() {
  const el = ensureLoaderElement();
  if (!el) return;
  el.style.display = "none";
}

function initAxiosLoaderInterceptor() {
  if (interceptorInitialized || typeof window === "undefined") return;
  interceptorInitialized = true;

  axios.interceptors.request.use((config) => {
    activeAxiosRequests += 1;
    // small debounce via microtask timing handled implicitly by multiple requests
    showLoader();
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  axios.interceptors.response.use((response) => {
    activeAxiosRequests = Math.max(0, activeAxiosRequests - 1);
    if (activeAxiosRequests === 0) hideLoader();
    return response;
  }, (error) => {
    activeAxiosRequests = Math.max(0, activeAxiosRequests - 1);
    if (activeAxiosRequests === 0) hideLoader();
    return Promise.reject(error);
  });
}

// Initialize on module load in the browser
if (typeof window !== "undefined") {
  initAxiosLoaderInterceptor();
}

// Export communication object with APIs
export const communication = {
  // Get Video List
  getVideoListForAdmin: async (page = 1, searchString = "") => {
    try {
      const requestBody = { page, searchString };

      return await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/video/get-video-list-for-admin`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("auth")}`, // same as login
          },
        }
      );
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  },

  // Create User
  createUser: async (userData) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/create-user`,
        userData, 
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("auth")}`,
          },
        }
      );
      return response;
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      throw error;
    }
  },

  // Get User List
  getUserList: async ({ id = "", page, searchString = "" } = {}) => {
  try {
    const requestBody = { id, page, searchString };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/user/get-user-list-for-admin`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("auth")}`,
        },
      }
    );

    return response;
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
    throw error;
  }
},  

  // Get Query List
getQueryList: async (page = 1, searchString = "") => {
  try {
    const requestBody = { page, searchString };

    return await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/contact/get-query-list`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("auth")}`, 
        },
      }
    );
  } catch (error) {
    toast.error(error.message);
    throw error;
  }
},
 createCoinSlot: async (coins, amount) => {
    try {
      const requestBody = { coins: Number(coins), amount: Number(amount) };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/coin-slot/create-coin-slot`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("auth")}`,
          },
        }
      );

      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating coin package");
      throw error;
    }
  },
  getCoinSlotList: async ({ page, searchString }) => {
    try {
      const requestBody = { page, searchString };

      return await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/coin-slot/get-coin-slot-list`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("auth")}`,
          },
        }
      );
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  },
  updateCoinSlot: async (id, coins, amount) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/coin-slot/update-coin-slot`,
        {
          id,
          coins: Number(coins),
          amount: Number(amount),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("auth")}`,
          },
        }
      );

      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating coin package");
      throw error;
    }
  },
  deleteCoinSlot: async (slotIds) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/coin-slot/delete-coin-slot`,
        {
          slotIds, 
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("auth")}`,
          },
        }
      );

      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting coin package");
      throw error;
    }
  },

  deleteSelectedUser: async (userIds) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/delete-selected-user`,
        {
          userIds, 
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("auth")}`,
          },
        }
      );

      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting coin package");
      throw error;
    }
  },

  // Change user status (Enable/Disable)
changeUserStatus: async (userId, newStatus) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/user/change-user-status`,
      {
        userId,
        status: newStatus, // 'Active' or 'Inactive'
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("auth")}`,
        },
      }
    );

    return response;
  } catch (error) {
    toast.error(error.response?.data?.message || "Error changing user status");
    throw error;
  }
},

  // Update User
 updateUser: async (userId, updatedData) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/user/update-user/${userId}`,
      updatedData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("auth")}`,
        },
      }
    );
    return response;
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
    throw error;
  }
},


}

