import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import traitReducer from "../features/traits/traitSlice";
import memberReducer from "../features/members/memberSlice";
import testReducer from "../features/tests/testSlice";
import groupReducer from "../features/groups/groupSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    traits: traitReducer,
    members: memberReducer,
    tests: testReducer,
    groups: groupReducer,
  },
});
