/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { CiCircleInfo } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

import { SendOtps } from "@/features/Auth/service";
import flow from '../../assets/eflowdot-high-resolution-logo-transparent_.png';

const SendOtp = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



  const handleSendOtp = async () => {

    setError("");
    setLoading(true);

    try {
      const response = await SendOtps({ email });
      console.log("OTP API response:", response);


      if (!response) {
        console.log("no response")
      } else {
        navigate("/otp-verification", {
          state: {
            email,
            otp: response.data.data.otp,
            token: response.data?.data.token
          }
        });

      }
    } catch (err: any) {
      console.log(err)
      setError("Enter a valid email");
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
            Forgot Password ?
          </p>
          <p className="text-lg mt-2 text-[#999999]">
            Enter your registered email to receive the OTP
          </p>

          <div className="mt-6">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Enter your email"
              className={`w-full h-14 border ${error ? "border-red-500" : "border-[#68B39F]"
                } rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 ${error ? "focus:ring-red-500" : "focus:ring-[#68B39F]"
                }`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <button
            onClick={handleSendOtp}
            disabled={loading}
            className="mt-6 w-full h-14 bg-[#68B39F] text-white py-2 rounded-md text-xl font-medium hover:bg-[#5aa18d] transition-colors disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>

          <div className="text-center mr-3 mt-5">
            <button
              className="text-[#999999] text-sm hover:text-[#68B39F] transition-colors"
              onClick={() => navigate("/sign-in")}
            >
              <span className="flex items-center justify-center">
                <CiCircleInfo className="mt-0.5 mr-2" />
                Back to Login
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:block bg-[#68B39F]"></div>
    </div>
  );
};

export default SendOtp;
