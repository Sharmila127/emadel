

import { Button } from "@/components/ui/button"
import { COLORS, FONTS } from "@/constants/ui constants"
import { ArrowLeft } from "lucide-react"

type Plan = {
  name: string
  description: string
  price: string
  features: string[]
  status: "Active" | "Inactive"
}

interface PlanViewProps {
  plan: Plan
  onBack: () => void
}

export default function PlanView({ plan, onBack }: PlanViewProps) {
  const getFeatureValue = (featureName: string) => {
    const feature = plan.features.find((f) =>
      f.toLowerCase().includes(featureName.toLowerCase())
    )
    return feature ? feature.split(": ")[1] : "N/A"
  }

  return (
    <div className="p-6  mx-auto space-y-2 bg-white">
      {/* Back button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
        
        </Button>
      </div>

      {/* Title */}
      <div>
        <h1 className=" mb-2"style={{...FONTS.text,fontSize:"26px"}}>{plan.name}</h1>
        <p className=" border-b border-gray-500 pb-2 opacity-50"style={{...FONTS.text5}}>{plan.description}</p>
      </div>

      {/* Plan Overview */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mt-6 mb-4"style={{...FONTS.text,fontSize:"26px",color:COLORS.black}}>Plan Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6">
          <div>
            <p className="text-sm mt-4 font-medium text-gray-500"style={{...FONTS.text,fontSize:"22px",color:COLORS.black}}>Price</p>
            <p className="text-gray-900 mt-4 opacity-50"style={{...FONTS.text5}}>
              {plan.price}
              <span className="text-gray-500 mt-4 "style={{...FONTS.text5}}> / month</span>
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-4 mt-4"style={{...FONTS.text,fontSize:"22px",color:COLORS.black}}>Status</p>
            <p
              className={
                plan.status === "Active"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {plan.status}
            </p>
          </div>
          <div>
            <p className="text-sm mt-4 font-medium text-gray-500"style={{...FONTS.text,fontSize:"22px",color:COLORS.black}}>Max Users</p>
            <p className="text-gray-900 mt-4 opacity-50"style={{...FONTS.text5}}>Unlimited</p>
          </div>
          <div>
            <p className="text-sm font-medium mt-4 text-gray-500"style={{...FONTS.text,fontSize:"22px",color:COLORS.black}}>Billing Cycle</p>
            <p className="text-gray-900 mt-4 opacity-50"style={{...FONTS.text5}}>Monthly</p>
          </div>
        </div>
      </div>

      {/* Created On */}
      <div>
        <p className="text-sm font-medium text-gray-500 mt-4"style={{...FONTS.text,fontSize:"22px",color:COLORS.black}}>Created On</p>
        <p className=" border-b border-gray-500 pb-2 mt-4 mb-4 text-gray-900 opacity-50"style={{...FONTS.text5}}>N/A</p>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4"style={{...FONTS.text,fontSize:"26px",color:COLORS.black}}>Features Included</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6">
          <div>
            <span className="font-semibold"style={{...FONTS.text,fontSize:"22px",color:COLORS.black}}>Admins:</span>{" "}
            {getFeatureValue("Admins")}
          </div>
          <div>
            <span className="font-semibold"style={{...FONTS.text,fontSize:"22px",color:COLORS.black}}>Students:</span>{" "}
            {getFeatureValue("Students")}
          </div>
          <div>
            <span className="font-semibold"style={{...FONTS.text,fontSize:"22px",color:COLORS.black}}>Teachers:</span>{" "}
            {getFeatureValue("Teachers")}
          </div>
          <div>
            <span className="font-semibold"style={{...FONTS.text,fontSize:"22px",color:COLORS.black}}>Batches:</span>{" "}
            {getFeatureValue("Batches")}
          </div>
          <div>
            <span className="font-semibold"style={{...FONTS.text,fontSize:"22px",color:COLORS.black}}>Classes:</span>{" "}
            {getFeatureValue("Classes")}
          </div>
          <div>
            <span className="font-semibold "style={{...FONTS.text,fontSize:"22px",color:COLORS.black}}>Courses:</span>{" "}
            {getFeatureValue("Courses")}
          </div>
        </div>
      </div>

      <div className="border-b border-gray-500 pb-2"></div>
      <div>
        <h2 className="text-lg font-bold  text-gray-900 mb-2"style={{...FONTS.text,fontSize:"26px",color:COLORS.black}}>
          Why Choose This Plan?
        </h2>
        <p className="text-gray-600 leading-relaxed opacity-50"style={{...FONTS.text5}}>
          This subscription plan is designed for users looking for flexibility
          and efficiency. With a Monthly billing cycle, it ensures predictable
          payments while providing scalable features. The plan supports up to
          Unlimited users, allowing for structured and efficient management.
          This plan is completely free, making it an excellent choice for those
          looking to explore the platform without financial commitment.
        </p>
      </div>
    </div>
  )
}
