/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateInstituteDetails } from "@/features/institute/services";
import toast from "react-hot-toast";

interface EditInstituteFormProps {
  instituteData: any;
  onCancel: () => void;
}

interface InstituteFormValues {
  instituteName: string;
  registeredDate: string;
  state: string;
  city: string;
  pinCode: string;
  addressLine1: string;
  addressLine2: string;
  phoneNumber: string;
  altPhoneNumber: string;
  officialEmail: string;
  officialWebsite: string;
  description: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  twitter: string;
}

const validationSchema = Yup.object({
  instituteName: Yup.string().required("Institute Name is required"),
  registeredDate: Yup.date().required("Registered Date is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  pinCode: Yup.string()
    .matches(/^\d{6}$/, "Pin Code must be 6 digits")
    .required("Pin Code is required"),
  addressLine1: Yup.string().required("Address Line 1 is required"),
  addressLine2: Yup.string(), // optional
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, "Phone Number must be 10 digits")
    .required("Phone Number is required"),
  altPhoneNumber: Yup.string().matches(/^\d{10}$/, "Alt Phone Number must be 10 digits"),
  officialEmail: Yup.string()
    .email("Invalid email format")
    .required("Official Email is required"),
  officialWebsite: Yup.string().url("Invalid URL"),
  description: Yup.string().max(300, "Description can't be longer than 300 characters"),
  instagram: Yup.string().url("Invalid Instagram URL"),
  facebook: Yup.string().url("Invalid Facebook URL"),
  linkedin: Yup.string().url("Invalid LinkedIn URL"),
  twitter: Yup.string().url("Invalid Twitter URL"),
});

const EditInstituteForm: React.FC<EditInstituteFormProps> = ({
  instituteData,
  onCancel,
}) => {
  const formik = useFormik<InstituteFormValues>({
    initialValues: {
      instituteName: instituteData?.institute_name || "",
      registeredDate: instituteData?.registered_date
        ? new Date(instituteData.registered_date).toISOString().split("T")[0]
        : "",
      state: instituteData?.contact_info?.address?.state || "",
      city: instituteData?.contact_info?.address?.city || "",
      pinCode: instituteData?.contact_info?.address?.pincode || "",
      addressLine1: instituteData?.contact_info?.address?.address1 || "",
      addressLine2: instituteData?.contact_info?.address?.address2 || "",
      phoneNumber: instituteData?.contact_info?.phone_no || "",
      altPhoneNumber: instituteData?.contact_info?.alternate_no || "",
      officialEmail: instituteData?.email || "",
      officialWebsite: instituteData?.website || "",
      description: instituteData?.description || "",
      instagram: instituteData?.social_media?.instagram_id || "",
      facebook: instituteData?.social_media?.facebook_id || "",
      linkedin: instituteData?.social_media?.linkedin_id || "",
      twitter: instituteData?.social_media?.twitter_id || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = {
        institute_name: values.instituteName,
        email: values.officialEmail,
        website: values.officialWebsite,
        description: values.description,
        contact_info: {
          phone_no: values.phoneNumber,
          alternate_no: values.altPhoneNumber,
          address: {
            state: values.state,
            city: values.city,
            pincode: values.pinCode,
            address1: values.addressLine1,
            address2: values.addressLine2,
          },
        },
        social_media: {
          instagram_id: values.instagram,
          facebook_id: values.facebook,
          linkedin_id: values.linkedin,
          twitter_id: values.twitter,
        },
      };

      try {
        const response = await updateInstituteDetails({
          instituteId: instituteData?.uuid,
          payload,
        });

        if (response) {
          toast.success("Institute updated successfully 🎉");
          console.log("Institute updated:", response);
          onCancel();
        } else {
          throw new Error("No response received");
        }
      } catch (error) {
        console.error("Update failed:", error);
        toast.error("Failed to update institute ❌");
      }
    },
  });

  const inputClass =
    "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

  const textFields: Array<{
    name: keyof InstituteFormValues;
    placeholder: string;
    type?: string;
  }> = [
      { name: "instituteName", placeholder: "Institute Name" },
      { name: "registeredDate", placeholder: "Registered Date", type: "date" },
      { name: "state", placeholder: "State" },
      { name: "city", placeholder: "City" },
      { name: "pinCode", placeholder: "Pin Code" },
      { name: "addressLine1", placeholder: "Address Line 1" },
      { name: "addressLine2", placeholder: "Address Line 2" },
      { name: "phoneNumber", placeholder: "Phone Number" },
      { name: "altPhoneNumber", placeholder: "Alt Phone Number" },
      { name: "officialEmail", placeholder: "Official Email", type: "email" },
      { name: "officialWebsite", placeholder: "Official Website" },
    ];

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="max-w-5xl mx-auto bg-white p-6 shadow-lg rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto"
    >
      {textFields.map((field) => (
        <div key={field.name}>
          <input
            type={field.type || "text"}
            name={field.name}
            placeholder={field.placeholder}
            value={formik.values[field.name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputClass}
          />
          {formik.touched[field.name] && formik.errors[field.name] && (
            <p className="text-red-500 text-sm">{formik.errors[field.name]}</p>
          )}
        </div>
      ))}

      <div className="md:col-span-2">
        <textarea
          name="description"
          placeholder="Description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`${inputClass} h-24`}
        />
        {formik.touched.description && formik.errors.description && (
          <p className="text-red-500 text-sm">{formik.errors.description}</p>
        )}
      </div>

      {(["instagram", "facebook", "linkedin", "twitter"] as const).map((field) => (
        <div key={field}>
          <input
            type="text"
            name={field}
            placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)} URL`}
            value={formik.values[field]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputClass}
          />
          {formik.touched[field] && formik.errors[field] && (
            <p className="text-red-500 text-sm">{formik.errors[field]}</p>
          )}
        </div>
      ))}

      <div className="flex gap-4 md:col-span-2 mt-4">
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-blue-400"
        >
          {formik.isSubmitting ? "Submitting..." : "Submit"}
        </button>

        <button
          type="button"
          onClick={() => {
            formik.resetForm();
            onCancel();
          }}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditInstituteForm;
