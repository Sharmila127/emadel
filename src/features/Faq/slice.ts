import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  status: "Active" | "Inactive";
}

interface FAQState {
  data: FAQ[];
  selectedFAQ: FAQ | null;
}

const initialState: FAQState = {
  data: [],
  selectedFAQ: null,
};

const faqSlice = createSlice({
  name: "faq",
  initialState,
  reducers: {
    getFAQs: (state, action: PayloadAction<any[]>) => {
      state.data = action.payload;
    },
    addFAQ: (state, action: PayloadAction<FAQ>) => {
      state.data.push(action.payload);
    },
    deleteFAQ: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((faq) => faq.id !== action.payload);
    },
    editFAQ: (state, action: PayloadAction<FAQ>) => {
      const updatedItem = action.payload;
      const index = state.data.findIndex((item) => item.id === updatedItem.id);
      if (index !== -1) {
        state.data[index] = updatedItem;
      }
    },
    updateFAQStatus: (state, action: PayloadAction<{ id: string; status: "Active" | "Inactive" }>) => {
      const { id, status } = action.payload;
      const index = state.data.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.data[index].status = status;
      }
    },
    setSelectedFAQ: (state, action: PayloadAction<FAQ | null>) => {
      state.selectedFAQ = action.payload;
    },
  },
});

export const {
  getFAQs,
  addFAQ,
  deleteFAQ,
  editFAQ,
  updateFAQStatus,
  setSelectedFAQ,
} = faqSlice.actions;

export default faqSlice.reducer;
