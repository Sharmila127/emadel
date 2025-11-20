import Client from '../../api/index'

export const getFAQsAll = async (params?: any) => {
  try {
    const response = await Client.faq.get(params);
    console.log("Backend FAQ data:", response);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const createFAQ = async (params: any) => {
  console.log("update params",params)
   try {
    const response = await Client.faq.create(params);
    console.log("Backend FAQ data:", response);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export const updateFAQ = async (params: any) => {
   try {
    const response = await Client.faq.update(params);
    console.log("Backend FAQ data:", response);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
}


export const deleteFAQ = async (data: { id: string }) => {
  try {
    const response = await Client.faq.delete(data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete FAQ");
  }
};