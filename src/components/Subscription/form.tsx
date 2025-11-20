import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User } from 'lucide-react';
import { FONTS } from '@/constants/ui constants';

// Validation schema using Yup
const validationSchema = Yup.object({
  plan: Yup.string().required('Plan name is required'),
  planPrice: Yup.string().required('Plan price is required'),
  supportLevel: Yup.string().required('Support level is required'),
  planDescription: Yup.string()
    .min(10, 'Plan description must be at least 10 characters')
    .required('Plan description is required'),
  duration: Yup.string().required('Duration is required'),
  durationType: Yup.string().required('Duration type is required'),
  numberOfStudents: Yup.string().when('unlimitedStudents', {
    is: false,
    then: (schema) => schema.required('Number of students is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  numberOfAdmins: Yup.string().when('unlimitedAdmins', {
    is: false,
    then: (schema) => schema.required('Number of admins is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  numberOfTeachers: Yup.string().when('unlimitedTeachers', {
    is: false,
    then: (schema) => schema.required('Number of teachers is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  numberOfBatches: Yup.string().when('unlimitedBatches', {
    is: false,
    then: (schema) => schema.required('Number of batches is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  numberOfCourses: Yup.string().when('unlimitedCourses', {
    is: false,
    then: (schema) => schema.required('Number of courses is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  numberOfClasses: Yup.string().when('unlimitedClasses', {
    is: false,
    then: (schema) => schema.required('Number of classes is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

interface SubscriptionPlanFormProps {
  onClose: () => void;
}

const SubscriptionPlanForm: React.FC<SubscriptionPlanFormProps> = ({ onClose }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      profilePicture: '',
      plan: '',
      planPrice: '',
      supportLevel: '',
      planDescription: '',
      duration: '',
      durationType: '',
      numberOfStudents: '',
      unlimitedStudents: false,
      numberOfAdmins: '',
      unlimitedAdmins: false,
      numberOfTeachers: '',
      unlimitedTeachers: false,
      numberOfBatches: '',
      unlimitedBatches: false,
      numberOfCourses: '',
      unlimitedCourses: false,
      numberOfClasses: '',
      unlimitedClasses: false,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Form submitted:', values);
      // Handle form submission here
      onClose();
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
        formik.setFieldValue('profilePicture', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    formik.resetForm();
    setProfileImage(null);
    onClose();
  };

  const getFieldError = (fieldName: keyof typeof formik.values) => {
    return formik.touched[fieldName] && formik.errors[fieldName]
      ? formik.errors[fieldName]
      : null;
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <DialogHeader className="border-b pb-4 mb-6">
        <DialogTitle style={{ ...FONTS.bold_heading }}>
          Subscription Plan
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Header Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className=" !text-[#2D6974] mb-4" style={{ ...FONTS.tableheader }}>
            Enter your Address Information Here
          </h3>

          {/* Profile Picture Upload */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-orange-600" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <div>
              <p className=" !text-[#242731]" style={{ ...FONTS.tableheader }}>Upload Profile Picture</p>
              <p className="!text-[#242731] opacity-40" style={{ ...FONTS.text3 }}>PNG or JPEG (Max 800K)</p>
            </div>
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Plan */}
          <div className="space-y-2">
            <label className=" !text-[#242731]" style={{ ...FONTS.text5 }}>Plan</label>
            <Input
              name="plan"
              placeholder=""
              value={formik.values.plan}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border-gray-300"
            />
            {getFieldError('plan') && (
              <p className="text-sm text-red-500">{getFieldError('plan')}</p>
            )}
          </div>

          {/* Plan Price */}
          <div className="space-y-2">
            <label className=" !text-[#242731]" style={{ ...FONTS.text5 }}>Plan Price</label>
            <Input
              name="planPrice"
              placeholder=""
              value={formik.values.planPrice}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border-gray-300"
            />
            {getFieldError('planPrice') && (
              <p className="text-sm text-red-500">{getFieldError('planPrice')}</p>
            )}
          </div>

          {/* Support Level */}
          <div className="space-y-2">
            <label className="!text-[#242731]" style={{ ...FONTS.text5 }}>Support Level</label>
            <Select
              value={formik.values.supportLevel}
              onValueChange={(value) => formik.setFieldValue('supportLevel', value)}
            >
              <SelectTrigger className="border-gray-300 rounded-md">
                <SelectValue placeholder="Select support level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="basic"
                  className={` rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none px-4 py-2 border ${formik.values.supportLevel === "basic"
                      ? "bg-[#68b39f] text-white border-transparent font-semibold"
                      : "bg-white text-gray-500 border-gray-300 hover:bg-[#68b39f] hover:text-white hover:border-transparent"
                    }`}
                >
                  Basic
                </SelectItem>

                <SelectItem
                  value="premium"
                  className={` rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none px-4 mt-2 py-2 border ${formik.values.supportLevel === "premium"
                      ? "bg-[#68b39f] text-white border-transparent font-semibold"
                      : "bg-white text-gray-500 border-gray-300 hover:bg-[#68b39f] hover:text-white hover:border-transparent"
                    }`}
                >
                  Premium
                </SelectItem>
              </SelectContent>
            </Select>

            {getFieldError('supportLevel') && (
              <p className="text-sm text-red-500">{getFieldError('supportLevel')}</p>
            )}
          </div>
        </div>

        {/* Plan Description */}
        <div className="space-y-2">
          <label className="!text-[#242731]" style={{ ...FONTS.text5 }}>Plan Description</label>
          <Textarea
            name="planDescription"
            placeholder="Enter plan description..."
            value={formik.values.planDescription}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-gray-300 min-h-[80px]"
          />
          {getFieldError('planDescription') && (
            <p className="text-sm text-red-500">{getFieldError('planDescription')}</p>
          )}
        </div>

        {/* Duration and Duration Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="!text-[#242731]" style={{ ...FONTS.text5 }}>Duration</label>
            <Input
              name="duration"
              placeholder=""
              value={formik.values.duration}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border-gray-300"
            />
            {getFieldError('duration') && (
              <p className="text-sm text-red-500">{getFieldError('duration')}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="!text-[#242731]" style={{ ...FONTS.text5 }}>Duration Type</label>
            <Select
              value={formik.values.durationType}
              onValueChange={(value) => formik.setFieldValue('durationType', value)}
            >
              <SelectTrigger className="border-gray-300 rounded-md">
                <SelectValue placeholder="Select duration type" />
              </SelectTrigger>
              <SelectContent>
                {["days", "weeks", "months", "years"].map((option) => (
                  <SelectItem
                    key={option}
                    value={option}
                    className={`rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none px-4 mt-2 py-2 border text-center ${formik.values.durationType === option
                        ? "bg-[#68b39f] text-white border-transparent font-semibold"
                        : "bg-white text-gray-500 border-gray-300 hover:bg-[#68b39f] hover:text-white hover:border-transparent"
                      }`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {getFieldError('durationType') && (
              <p className="text-sm text-red-500">{getFieldError('durationType')}</p>
            )}
          </div>
        </div>

        {/* Number Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Students */}
          <div className="space-y-2">
            <div className="space-y-2">
              <label className=" !text-[#242731]" style={{ ...FONTS.text5 }}>Number of Students</label>
              <Input
                name="numberOfStudents"
                placeholder=""
                value={formik.values.numberOfStudents}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border-gray-300"
                disabled={formik.values.unlimitedStudents}
              />
              {getFieldError('numberOfStudents') && (
                <p className="text-sm text-red-500">{getFieldError('numberOfStudents')}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="unlimitedStudents"
                checked={formik.values.unlimitedStudents}
                onCheckedChange={(checked) => {
                  formik.setFieldValue('unlimitedStudents', checked);
                  if (checked) {
                    formik.setFieldValue('numberOfStudents', '');
                  }
                }}
              />
              <label htmlFor="unlimitedStudents" className="text-xs text-gray-500">
                Check for Unlimited Students
              </label>
            </div>
          </div>

          {/* Admins */}
          <div className="space-y-2">
            <div className="space-y-2">
              <label className=" !text-[#242731]" style={{ ...FONTS.text5 }}>Number of Admins</label>
              <Input
                name="numberOfAdmins"
                placeholder=""
                value={formik.values.numberOfAdmins}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border-gray-300"
                disabled={formik.values.unlimitedAdmins}
              />
              {getFieldError('numberOfAdmins') && (
                <p className="text-sm text-red-500">{getFieldError('numberOfAdmins')}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="unlimitedAdmins"
                checked={formik.values.unlimitedAdmins}
                onCheckedChange={(checked) => {
                  formik.setFieldValue('unlimitedAdmins', checked);
                  if (checked) {
                    formik.setFieldValue('numberOfAdmins', '');
                  }
                }}
              />
              <label htmlFor="unlimitedAdmins" className="text-xs text-gray-500">
                Check for Unlimited Admins
              </label>
            </div>
          </div>

          {/* Teachers */}
          <div className="space-y-2">
            <div className="space-y-2">
              <label className=" !text-[#242731]" style={{ ...FONTS.text5 }}>Number of Teachers</label>
              <Input
                name="numberOfTeachers"
                placeholder=""
                value={formik.values.numberOfTeachers}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border-gray-300"
                disabled={formik.values.unlimitedTeachers}
              />
              {getFieldError('numberOfTeachers') && (
                <p className="text-sm text-red-500">{getFieldError('numberOfTeachers')}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="unlimitedTeachers"
                checked={formik.values.unlimitedTeachers}
                onCheckedChange={(checked) => {
                  formik.setFieldValue('unlimitedTeachers', checked);
                  if (checked) {
                    formik.setFieldValue('numberOfTeachers', '');
                  }
                }}
              />
              <label htmlFor="unlimitedTeachers" className="text-xs text-gray-500">
                Check for Unlimited Teachers
              </label>
            </div>
          </div>

          {/* Batches */}
          <div className="space-y-2">
            <div className="space-y-2">
              <label className="!text-[#242731]" style={{ ...FONTS.text5 }}>Number of Batches</label>
              <Input
                name="numberOfBatches"
                placeholder=""
                value={formik.values.numberOfBatches}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border-gray-300"
                disabled={formik.values.unlimitedBatches}
              />
              {getFieldError('numberOfBatches') && (
                <p className="text-sm text-red-500">{getFieldError('numberOfBatches')}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="unlimitedBatches"
                checked={formik.values.unlimitedBatches}
                onCheckedChange={(checked) => {
                  formik.setFieldValue('unlimitedBatches', checked);
                  if (checked) {
                    formik.setFieldValue('numberOfBatches', '');
                  }
                }}
              />
              <label htmlFor="unlimitedBatches" className="text-xs text-gray-500">
                Check for Unlimited Batches
              </label>
            </div>
          </div>

          {/* Courses */}
          <div className="space-y-2">
            <div className="space-y-2">
              <label className=" !text-[#242731]" style={{ ...FONTS.text5 }}>Number of Courses</label>
              <Input
                name="numberOfCourses"
                placeholder=""
                value={formik.values.numberOfCourses}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border-gray-300"
                disabled={formik.values.unlimitedCourses}
              />
              {getFieldError('numberOfCourses') && (
                <p className="text-sm text-red-500">{getFieldError('numberOfCourses')}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="unlimitedCourses"
                checked={formik.values.unlimitedCourses}
                onCheckedChange={(checked) => {
                  formik.setFieldValue('unlimitedCourses', checked);
                  if (checked) {
                    formik.setFieldValue('numberOfCourses', '');
                  }
                }}
              />
              <label htmlFor="unlimitedCourses" className="text-xs text-gray-500">
                Check for Unlimited Courses
              </label>
            </div>
          </div>

          {/* Classes */}
          <div className="space-y-2">
            <div className="space-y-2">
              <label className="!text-[#242731]" style={{ ...FONTS.text5 }}>Number of Classes</label>
              <Input
                name="numberOfClasses"
                placeholder=""
                value={formik.values.numberOfClasses}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border-gray-300"
                disabled={formik.values.unlimitedClasses}
              />
              {getFieldError('numberOfClasses') && (
                <p className="text-sm text-red-500">{getFieldError('numberOfClasses')}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="unlimitedClasses"
                checked={formik.values.unlimitedClasses}
                onCheckedChange={(checked) => {
                  formik.setFieldValue('unlimitedClasses', checked);
                  if (checked) {
                    formik.setFieldValue('numberOfClasses', '');
                  }
                }}
              />
              <label htmlFor="unlimitedClasses" className="text-xs text-gray-500">
                Check for Unlimited Classes
              </label>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between px-4 py-2" style={{ ...FONTS.button }}>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="px-6 rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none text-[#6bc1a3] border-[#6bc1a3]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#6bc1a3] px-4 py-2 rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none hover:bg-[#57ab90]" style={{ ...FONTS.button }}
            disabled={formik.isSubmitting}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SubscriptionPlanForm;