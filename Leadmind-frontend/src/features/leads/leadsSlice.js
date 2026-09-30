import { createSlice } from "@reduxjs/toolkit";

const leadsSlice = createSlice({
  name: "leads",
  initialState: {
    items: [],
    total: 0,
  },
  reducers: {
    setLeads: (state, action) => {
      state.items = action.payload.leads;
      state.total = action.payload.total;
    },
    removeLead: (state, action) => {
      state.items = state.items.filter((lead) => lead._id !== action.payload);
    },
  },
});

export const { setLeads, removeLead } = leadsSlice.actions;
export default leadsSlice.reducer;
