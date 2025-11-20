import { FONTS } from "@/constants/ui constants";
import { getProfileThunks } from "@/features/Profile/reducers/thunks";
import { updatePassword } from "@/features/Profile/services";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxhooks";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const SecurityPage = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch: any = useAppDispatch()
  const profileData: any = useAppSelector((state) => state.ProfileSlice.data);



  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
  defaultValues: {
    newPassword: "",
    confirmPassword: ""
  }
});

  const onSubmit = (formValues: any) => {
    const payload = {
      email: profileData?.email,
      newPassword: formValues.newPassword,
      confirmPassword: formValues.confirmPassword
    };

    dispatch(updatePassword(payload));
    reset({ newPassword: "", confirmPassword: "" });
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  useEffect(() => {
    dispatch(getProfileThunks({}));
  }, [dispatch]);

  const newPassword = watch("newPassword");

  return (
    <div className="shadow-[0px_0px_15px_0px_#0000001A] p-4 rounded-lg">
      <h1 style={{ ...FONTS.profile_head }}>Change Password</h1>

      <div className="bg-[#E0ECDE80] p-4 rounded-lg my-5 grid gap-3">
        <h1 style={{ ...FONTS.pass_head }}>
          Ensure that these requirements are met
        </h1>
        <p style={{ ...FONTS.btn_txt }}>
          Minimum 8 characters long, uppercase & symbol
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4 w-full"
      >
        {/* New Password */}
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            {...register("newPassword", {
              required: "New password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value: /^(?=.*[A-Z])(?=.*[!@#$%^&*])/,
                message: "Must include at least 1 uppercase & 1 symbol",
              },
            })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#68B39F]"
          />
          <button
            type="button"
            className="absolute right-3 top-[33px] -translate-y-1/2 text-gray-500"
            onClick={() => setShowNewPassword((prev) => !prev)}
          >
            {showNewPassword ? <EyeOff size={25} /> : <Eye size={25} />}
          </button>
          {typeof errors.newPassword?.message === "string" && (
            <p className="text-red-500 text-sm mt-1">
              {errors.newPassword.message}
            </p>
          )}

        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) =>
                value === newPassword || "Passwords do not match",
            })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#68B39F]"
          />
          <button
            type="button"
            className="absolute right-3 top-[33px] -translate-y-1/2 text-gray-500"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? <EyeOff size={25} /> : <Eye size={25} />}
          </button>

          {typeof errors.confirmPassword?.message === "string" && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="col-span-2 mt-30 text-end">
          <button
            type="submit"
            className="bg-[#68B39F] border-transparent text-white p-2 px-5 rounded-tl-xl rounded-br-xl"
            style={{ ...FONTS.btn_txt_active }}
          >
            Confirm Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default SecurityPage;
