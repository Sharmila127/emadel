import {
  verifyOtpService,
  resendOtpService,
} from "@/features/Auth/service";
import React, { useState } from "react";
import { CiCircleInfo } from "react-icons/ci";
import { useLocation, useNavigate } from "react-router-dom";
import flow from '../../assets/eflowdot-high-resolution-logo-transparent_.png';

interface LocationState {
  email: string;
  token: string;
  otp: string;
}

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [token, setToken] = useState(state.token);
  const [email] = useState(state.email);
  const [serverOtp, setServerOtp] = useState(state.otp);
  const [loading, setLoading] = useState(false);

  console.log("Received OTP from backend:", serverOtp);

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }

      if (!value && index > 0) {
        document.getElementById(`otp-${index - 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (serverOtp && otpCode !== serverOtp) {
      alert("Entered OTP wrong");
      return;
    }

    const params = { email, otp: otpCode, token };

    try {
      const response = await verifyOtpService(params);

      if (response.data?.success) {
        navigate("/");
      } else {
        
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const params = { email, token };
      const response = await resendOtpService(params);
      setToken(response.data.token);
      setServerOtp(response.data.otp);
    } catch (error: any) {
     
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-2">
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-full p-5">
          <div className="flex justify-center">
            <img src={flow} alt="E-Flow" className="max-w-md h-auto" />
          </div>

          <p className="text-2xl mt-10 font-bold text-[#68B39F]">
            OTP Verification
          </p>
          <p className="text-lg mt-2 text-[#999999]">
            Enter the 6 digit OTP sent to your Mobile Number
          </p>

          <p>OTP : {serverOtp}</p>

          <div className="flex justify-center ml-10 gap-4 mt-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-14 mr-12 h-14 border border-[#68B39F] rounded-md  text-[#68B39F] text-center text-lg focus:outline-none focus:ring-2 focus:ring-[#68B39F]"
                autoFocus={index === 0}
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            className="mt-6 w-full h-14 bg-[#68B39F] text-white py-2 rounded-md text-xl font-medium"
          >
            Verify
          </button>

          <div
            onClick={handleResendOtp}
            className={`text-center mt-5 text-[#999999] hover:text-[#68B39F] cursor-pointer ${
              loading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {loading ? "Resending..." : "Resend OTP"}
          </div>

          <button
            className="text-[#999999] text-sm hover:text-[#68B39F] text-center ml-80 mt-3 transition-colors"
            onClick={() => navigate("/sign-in")}
          >
            <span className="flex items-center justify-center">
              <CiCircleInfo className="mt-0.5 mr-2" />
              Back to Login
            </span>
          </button>
        </div>
      </div>
      <div className="hidden md:block bg-[#68B39F]"></div>
    </div>
  );
};

export default OtpVerification;
