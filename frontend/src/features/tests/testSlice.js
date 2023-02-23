import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import testService from "./testService";

const initialState = {
  testsArr: [],
  adminTest: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Create new trait
export const createTest = createAsyncThunk(
  "test/create",
  async (testData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      // should also pass in cookie informarion
      return await testService.createTest(testData, token);
    } catch (error) {
      const message = error.response.data.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// GET All Tests submitted by the user
export const getAllTests = createAsyncThunk(
  "tests/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await testService.getAllTests(token);
    } catch (error) {
      const message = error.response.data.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// GET Tests submitted by the admin user for a specific group
export const getAdminTestsForGroup = createAsyncThunk(
  "tests/GetAdminTests",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await testService.getAdminTestsForGroup(id, token);
    } catch (error) {
      const message = error.response.data.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update/Edit tests
export const editTest = createAsyncThunk(
  "traits/edit",
  async (testData, thunkAPI) => {
    const { test_id } = testData;

    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await testService.editTest(test_id, testData, token);
      return response;
    } catch (error) {
      const message =
        error.response.data.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const testSlice = createSlice({
  name: "test",
  initialState,
  // this will delete everything in the tests array
  reducers: {
    testsReset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder

      // create Schedule
      .addCase(createTest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.testsArr.push(action.payload);
      })
      .addCase(createTest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      //Get completed tests from user (non admin users)
      .addCase(getAllTests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllTests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "";
        state.testsArr = action.payload;
      })
      .addCase(getAllTests.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        state.testsArr = [];
      })

      //Get completed tests from admin for specific group
      .addCase(getAdminTestsForGroup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAdminTestsForGroup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "";
        state.testsArr = action.payload;
      })
      .addCase(getAdminTestsForGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        state.adminTest = [];
      })
      // Update / Edit
      .addCase(editTest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editTest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (!action.payload?.id) {
          console.log("action payload", action.payload);
          return console.log("could not update post");
        }
        const { id } = action.payload;
        const tests = state.testsArr.filter((test) => test.test_id !== id);
        state.testsArr = [...tests, action.payload];
      })
      .addCase(editTest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { testsReset } = testSlice.actions;

export default testSlice.reducer;
