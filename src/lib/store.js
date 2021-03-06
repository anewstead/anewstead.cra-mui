import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import { detectColorTheme, toggleColorTheme } from "./themes";

const thumbHelper = (allThumbs, checkboxes) => {
  const showSites = checkboxes.find((cb) => {
    return cb.id === "site";
  }).checked;

  const showApps = checkboxes.find((cb) => {
    return cb.id === "app";
  }).checked;

  const showAds = checkboxes.find((cb) => {
    return cb.id === "banner";
  }).checked;

  return allThumbs
    .filter((obj) => {
      return (
        (showSites && obj.type === "site") ||
        (showApps && obj.type === "app") ||
        (showAds && obj.type === "banner")
      );
    })
    .sort((a, b) => {
      return Number(b.id) - Number(a.id);
    });
};

export const FETCH_MAIN_DATA = createAsyncThunk(
  "fetchJsonData",
  async (url) => {
    // session cache to avoid lots of calls to API during dev
    const ssData = sessionStorage.getItem("data");
    if (ssData) {
      return JSON.parse(ssData);
    }
    const response = await fetch(url);
    const data = await response.json();
    sessionStorage.setItem("data", JSON.stringify(data));
    return data;
  }
);

// ReduxToolKit createSlice() creates state, actions and reducers from one object
// remember to export reducer functions as slice.actions
const slice = createSlice({
  name: "app",
  initialState: {
    baseContentURL: "https://anewstead-content.netlify.app/",
    mainData: null,
    displayThumbs: null,
    theme: detectColorTheme(),
    nav: {
      brand: "Andrew Newstead",
      checkboxes: [
        {
          id: "site",
          label: "Websites",
          checked: true,
        },
        {
          id: "app",
          label: "Apps",
          checked: true,
        },
        {
          id: "banner",
          label: "Adverts",
          checked: true,
        },
      ],
    },
  },
  reducers: {
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    TOGGLE_THEME: (state, action) => {
      state.theme = toggleColorTheme();
    },
    NAV_CHECKBOX_CHANGE: (state, action) => {
      const checkbox = state.nav.checkboxes.find((obj) => {
        return obj.id === action.payload.id;
      });
      checkbox.checked = action.payload.checked;
      state.displayThumbs = thumbHelper(state.mainData, state.nav.checkboxes);
    },
  },
  extraReducers: {
    [FETCH_MAIN_DATA.fulfilled]: (state, action) => {
      state.mainData = action.payload;
      state.displayThumbs = thumbHelper(state.mainData, state.nav.checkboxes);
    },
    [FETCH_MAIN_DATA.rejected]: (state, action) => {
      state.mainData = "rejected";
    },
  },
});

const store = configureStore({
  reducer: {
    app: slice.reducer,
  },
});

export const { TOGGLE_THEME, NAV_CHECKBOX_CHANGE } = slice.actions;
export default store;
