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

};
