import axios from "axios";

const API_URL = "http://localhost:8080/api/members/";
// const API_URL =
//   "https://peer-assessment-backend-3yvuhaorjq-uc.a.run.app/api/members/";

// GET all Members for user's group
const getAllMembersForGroup = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.get(API_URL, config);
  return data;
};
// GET all Members for a specific group
const getMembers = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.get(API_URL + id, config);
  return data;
};

// GET all Members for a specific group
const getAll = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.get(API_URL + "all", config);
  return data;
};

const memberService = { getAllMembersForGroup, getMembers, getAll };

export default memberService;
