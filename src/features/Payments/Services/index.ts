import Client from "../../../api/index"

export  const getPaymentService = async (params:any)=>{
   
    try {
         const response = await Client.payments.get_all(params)
         if(response){
            return response;
         }
    } catch (error) {
        console.log("error in get all payments:",getPaymentService)
    }
      
};


export  const getWithIdPaymentService = async (params:any)=>{
   
    try {
         const response = await Client.payments.getWidId(params)
         if(response){
            return response;
         }
    } catch (error) {
        console.log("error in getwithid payments:",getPaymentService)
    }
      
};

export const createPayments = async (data:any) =>{
    try {
        const response = await Client.payments.create(data)
        if(response){
            return response;
        }
    } catch (error) {
        console.log("error in create payment:",createPayments)
    }
}







