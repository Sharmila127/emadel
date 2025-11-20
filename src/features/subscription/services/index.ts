import Client from "../../../api/index"


export const GetAllSubscription = async () => {
  const response = await Client.subscription.get_all();
  if (response) {
    return response;
  }
};

export const CreatSubscription = async (params?: any) => {
  const response = await Client.subscription.create(params);
  console.log("Creat subscription Successfully", response);
  if (response) {
    return response;
  }
};

export const EditSubscription = async (params?: any) => {
  const response = await Client.subscription.update(params);
  console.log("Eidted subscription Successfully", response);
  if (response) {
    return response;
  }
};

