import Client from '../../api/index'

export const SendOtps = async (params?: any) => {
  try {
    const response = await Client.auth.forget_password(params);
    console.log("Backend FAQ data:", response);
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const verifyOtpService = async (params: any) => {
  try {
    const response = await Client.auth.verify_otp(params);
    console.log("Verify OTP API Response:", response);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to verify OTP");
  }
};

export const resendOtpService = async (params: any) => {
  try {
    const response = await Client.auth.resend_otp(params);
    console.log("Verify OTP API Response:", response);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to verify OTP");
  }
};