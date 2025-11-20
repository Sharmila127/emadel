/* eslint-disable @typescript-eslint/no-explicit-any */
import Client from "../../../api/index"
export const getCategoriesData = async (params: any) => {
  const response = await Client.faq_category.get(params)
  if (response) {
    return response;
  }
};
export const createCategoriesData = async (paramas: any) => {
  const response = await Client.faq_category.create(paramas)
  if (response) {
    return response;
  }
}
export const updateCategoriesData = async (params: any) => {
  try {
    const response = await Client.faq_category.update(params);
    console.log("Category updated:", response);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update category");
  }
};

export const deleteCategoriesData = async (data: any) => {
  try {
    const response = await Client.faq_category.delete(data);
    console.log("Deleted successfully:", response);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete category");
  }
};



