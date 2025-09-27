import { axiosInstance } from "./axios";

export const signup = async (signupData)=>{
       const response = await axiosInstance.post('/auth/signup',signupData);
       return response.data;
     }

export const login = async (loginData)=>{
       const response = await axiosInstance.post('/auth/login',loginData);
       return response.data;
     }

export const logout = async ()=>{
       const response = await axiosInstance.post('/auth/logout');
       return response.data;
     }

export const getAuthUser =   async ()=>{
      try {
        const res = await axiosInstance.get("/auth/me")
          return res.data;
      } catch (error) {
        console.log("error in getAuthuser",error);
        return null
      }
    }   

export const completeOnboarding = async (userData)=>{
  const response = await axiosInstance.post("/auth/onboarding",userData)
  return response.data
}

export const getUserFriends = async ()=>{
   const response = await axiosInstance.get("/users/friends");
   return response.data;
}

export const getRecommendedUsers =  async()=>{
  const response = await axiosInstance.get("/users");
   return response.data
}

export const getOngoingFriendsReqs =  async()=>{
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
   return response.data
}
export const sendFriendRequest = async (userId) => {
  try {
    const response = await axiosInstance.post(`/users/friend-request/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error sending friend request:", error.response?.data || error.message);
    throw error;
  }
};

export const getFriendRequests = async ()=>{
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
}
export const acceptFriendRequest = async (requestId)=>{
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}