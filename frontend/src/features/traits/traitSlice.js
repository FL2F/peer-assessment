import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import traitService from "./traitService";

const initialState = {
  selfTraitsArr: [],
  userTraitsFromOthers: [],
  traitsForOthers: [],
  currentTestTraits: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Create new trait for user
export const createTraits = createAsyncThunk(
  "traits/create",
  async (traitsData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await traitService.createTraits(traitsData, token);
    } catch (error) {
      const message = error.response.data.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new trait for user
export const createTraitsForOthers = createAsyncThunk(
  "traits/createOthers",
  async (traitsData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await traitService.createTraits(traitsData, token);
    } catch (error) {
      const message = error.response.data.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// GET All Traits for the group
export const getAllTraitsFromGroup = createAsyncThunk(
  "traits/getAllTraitsFromGroup",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      // should also pass in cookie informarion
      return await traitService.getAllTraitsFromGroup(token);
    } catch (error) {
      const message = error.response.data.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// GET All Traits for specific test
export const getAllTraitsForTest = createAsyncThunk(
  "traits/getAllTraitsForTest",
  async (test_id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      // should also pass in cookie informarion
      return await traitService.getAllTraitsForTest(test_id, token);
    } catch (error) {
      const message = error.response.data.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Get traits as inputed by self
export const getSelfTraits = createAsyncThunk(
  "traits/getSelfTraits",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await traitService.getSelfTraits(token);
    } catch (error) {
      const message =
        error.response.data.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// GET Admin user's self Test traits
export const getAdminSelf = createAsyncThunk(
  "tests/getAdmin",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await traitService.getAdminSelf(id, token);
    } catch (error) {
      const message = error.response.data.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ADMIN ONLY
//Get traits for other members
export const getTraitsForOthers = createAsyncThunk(
  "traits/getTraitsForOthers",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await traitService.getSelfTraits(token);
    } catch (error) {
      const message =
        error.response.data.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ADMIN ONLY
// GET All Traits for the group
export const getAdminTraitsFromGroup = createAsyncThunk(
  "traits/getAdminTraitsFromGroup",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      // should also pass in cookie informarion
      return await traitService.getAdminTraitsFromGroup(id, token);
    } catch (error) {
      const message = error.response.data.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update/Edit userTraits
export const editTraits = createAsyncThunk(
  "traits/edit",
  async (traitsData, thunkAPI) => {
    const { test_id } = traitsData;

    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await traitService.editTraits(
        test_id,
        traitsData,
        token
      );
      return response;
    } catch (error) {
      const message =
        error.response.data.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete all the traits for a test
export const deleteTraitsForTest = createAsyncThunk(
  "traits/delete",
  async (traitsData, thunkAPI) => {
    const { test_id } = traitsData;

    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await traitService.deleteTraitsForTest(test_id, token);
      return response;
    } catch (error) {
      const message =
        error.response.data.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const traitSlice = createSlice({
  name: "trait",
  initialState,
  // this will delete everything in the traits array
  reducers: {
    resetTraits: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // create Trait for user, this goes into the selfTratsArr
      .addCase(createTraits.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTraits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.selfTraitsArr.push(action.payload);
      })
      .addCase(createTraits.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // create Trait for others this should push the traits into the traitsForOthersArr
      .addCase(createTraitsForOthers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTraitsForOthers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.traitsForOthers.push(action.payload);
      })
      .addCase(createTraitsForOthers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      //Get All Traits tyhat others have said about the user
      .addCase(getAllTraitsFromGroup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllTraitsFromGroup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "";
        state.userTraitsFromOthers = action.payload;
      })
      .addCase(getAllTraitsFromGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        state.userTraitsFromOthers = [];
      })

      //Get All traits for a specific test. This is used for editing a test
      .addCase(getAllTraitsForTest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllTraitsForTest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "";
        state.currentTestTraits = action.payload;
      })
      .addCase(getAllTraitsForTest.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        state.currentTestTraits = [];
      })

      //Get Traits for the logged in user
      .addCase(getSelfTraits.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSelfTraits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.selfTraitsArr = action.payload;
      })
      .addCase(getSelfTraits.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.selfTraitsArr = [];
      })

      //Get admin traits as inputed by the admin
      .addCase(getAdminSelf.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAdminSelf.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "";
        state.selfTraitsArr = action.payload;
      })
      .addCase(getAdminSelf.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        state.selfTraitsArr = [];
      })

      // Update / Edit traits (NOT CURRENTLY BEING USED)
      .addCase(editTraits.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editTraits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (!action.payload?.trait_id) {
          console.log("action payload", action.payload);
          return console.log("could not update post");
        }
        const { trait_id } = action.payload;
        const traits = state.traitsForOthers.filter(
          (trait) => trait.subject_id !== trait_id
        );
        state.traitsForOthers = [...traits, action.payload];
      })
      .addCase(editTraits.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete all traits for test. Called before creating new traits
      .addCase(deleteTraitsForTest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTraitsForTest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.traitsForOthers = [];
        state.selfTraitsArr = [];
        state.currentTestTraits = [];
      })
      .addCase(deleteTraitsForTest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetTraits } = traitSlice.actions;

export default traitSlice.reducer;
