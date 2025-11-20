import { getFAQsAll } from "./service";
import { getFAQs } from "./slice";

export const fetchFAQsThunk = (params?: any) => async (dispatch: any) => {
  try {
    const response = await getFAQsAll(params);
    dispatch(getFAQs(response.data.data.data));
    console.log("Fetched FAQs:", response.data.data.data);
  } catch (error) {
    console.error("Failed to fetch FAQs:", error);
  }
};
