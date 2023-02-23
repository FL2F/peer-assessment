import axios from "axios";

const API_URL = "http://localhost:8080/api/tests/";
// const API_URL =
//   "https://peer-assessment-backend-3yvuhaorjq-uc.a.run.app/api/tests/";

// GET all Tests That the user has completed
const getAllTests = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.get(API_URL, config);
  return data;
};

// GET all tests that the admin user has completed for this specific group
const getAdminTestsForGroup = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.get(API_URL + id, config);
  return data;
};

const createTest = async (testData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.post(API_URL, testData, config);
  return data;
};

const testService = {
  getAllTests,
  createTest,
  getAdminTestsForGroup,
};

export default testService;
