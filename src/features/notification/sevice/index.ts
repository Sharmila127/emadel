import Client from "../../../api/index"


export const GetAllNotification = async (params: any) => {
  const response = await Client.notification.get_all(params)
//   console.log("Getting all notification", response);
  if (response) {
    return response;
  }
};

export const GetAllInstitute = async (params?: any) => {
  const response = await Client.institute.all(params);
//   console.log("Getting all Institute", response.data);
  return response.data;
};



export const GetAllBranch = async (params: { institute: any }) => {
  const response = await Client.branch.get_all(params);
  console.log("Getting all Branch", response.data);
  return response.data;
};

export const creatNotification = async (params: any) => {
  const response = await Client.notification.create(params)
  console.log("creat notification", response);
  if (response) {
    return response.data;
  }
};

export const ResendNotification = async (querys: any) => {
  const response = await Client.notification.resend(querys);
  console.log("resend notification", response);
  if (response) {
    return response.data;
  }
};



