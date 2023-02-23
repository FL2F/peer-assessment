import axios from "axios";

const API_URL = "http://localhost:8080/api/traits/";
// const API_URL =
//   "https://peer-assessment-backend-3yvuhaorjq-uc.a.run.app/api/traits/";

const createTraits = async (traitsData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.post(API_URL, traitsData, config);
  return data;
};

// GET all Traits for the group
const getAllTraitsFromGroup = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.get(API_URL, config);
  return data;
};

// GET all Traits for specific test
const getAllTraitsForTest = async (test_id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.get(`${API_URL}${test_id}`, config);
  return data;
};

// GET user traits where the inputer and subject id are the same
const getSelfTraits = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.get(API_URL + "user", config);
  return data;
};

// GET admin's self test
const getAdminSelf = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.get(`${API_URL}admin/${id}`, config);
  return data;
};

// GET all Traits for the admin from a specific group
const getAdminTraitsFromGroup = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.get(`${API_URL}admin/others/${id}`, config);
  return data;
};

// GET traits for other member
const getTraitsForOthers = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.get(API_URL + "others", config);
  return data;
};

//Edit Trait test
const editTraits = async (test_id, traitsData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.put(API_URL + test_id, traitsData, config);
  return data;
};

//Delete All Traits for a specific test
const deleteTraitsForTest = async (test_id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.delete(API_URL + test_id, config);
  return data;
};

const calendarService = {
  createTraits,
  getAllTraitsFromGroup,
  getAllTraitsForTest,
  getSelfTraits,
  getAdminSelf,
  getAdminTraitsFromGroup,
  editTraits,
  deleteTraitsForTest,
};

export default calendarService;
