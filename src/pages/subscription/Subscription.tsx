import React, { useEffect, useState } from "react";
import { Plus, MoreVertical, Check } from "lucide-react";
import { FONTS } from "@/constants/ui constants";
import { useDispatch, useSelector } from "react-redux";
import { GettingAllSubscriptionThunks } from "@/features/subscription/redux/thunks";
import ConfirmDeleteModal from "../../components/SubscriptionPlan/ConfirmDeleteModal";
import { useNavigate } from "react-router-dom";

export interface Feature {
  label?: string;
  value?: string | number;
  identity?: string;
  count?: number;
  feature?: {
    identity?: string;
  };
}

export interface SubscriptionPlanProps {
  identity: string;
  description: string;
  price: string;
  duration: any;
  unit: string;
  image: string;
  features: Feature[];
  is_Active: boolean;
}

const Subscription: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlanProps[]>([]);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [showActionsIndex, setShowActionsIndex] = useState<number | null>(null);
  const [activeStates, setActiveStates] = useState<boolean[]>(plans.map((p: any) => p.active));

  const dispatch = useDispatch();
  const subscriptionData = useSelector((state: any) => state.Subscription.subscription);
  const output = subscriptionData?.data;
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      // setIsLoading(true);
      try {
        await dispatch(GettingAllSubscriptionThunks() as any);
      } catch (error) {
        console.error("Error fetching subscription data:", error);
      } finally {
        // setIsLoading(false);
      }
    })()

  }, [dispatch]);

  useEffect(() => {
    if (output?.length > 0) {
      setPlans(output);
    }
  }, [output]);



  const handleDeletePlan = () => {
    if (deleteIndex !== null) {
      setPlans((prev) => prev.filter((_, i) => i !== deleteIndex));
      setActiveStates((prev) => prev.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
    }
  };

  const toggleActive = (index: number) => {
    setActiveStates((prev) =>
      prev.map((state, i) => (i === index ? !state : state))
    );
  };

  const toggleActions = (index: number) => {
    setShowActionsIndex((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    // console.log("subscription data:", subscriptionData);
  }, [subscriptionData]);

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-2">
        <h1
          className="text-2xl font-semibold text-gray-800"
          style={{ ...FONTS.heading }}
        >
          Subscription Plan
        </h1>
        <button
          onClick={() => navigate("/add-subscription")}
          className="flex items-center gap-2 bg-[#68B39F] px-4 py-2 rounded-tl-xl rounded-br-xl text-white hover:bg-[#58a18e] transition"
        >
          <Plus size={18} /> Add Subscription
        </button>
      </div>

      <div className="grid gap-6  sm:grid-cols-2 lg:grid-cols-3 ">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="group bg-white rounded-xl border shadow-sm
  overflow-hidden border-gray-200 flex flex-col relative 
  hover:bg-[#68B39F] hover:text-white transition-colors duration-300"
          >
            <div className="p-4 flex flex-col flex-grow">
              <img
                src={plan.image ? plan.image : "no data"}
                alt={plan.identity ? plan.identity : "no data"}
                className="h-40 w-full object-cover rounded-md mb-3"
              />

              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-white">
                {plan.identity ? plan.identity : "no data"}
              </h3>
              <p className="text-sm text-gray-500 group-hover:text-white">
                {plan.description ? plan.description : "no data"}
              </p>

              <div className="mt-2 font-bold text-xl flex justify-center items-center text-[#1D3A4E] group-hover:text-white">
                ₹{plan?.price || "0"}
                <span className="font-normal text-base text-gray-500 group-hover:text-white">
                  /{plan?.duration?.unit || "month"}
                </span>
              </div>

              <div className="mt-4 border p-3 rounded-md group-hover:border-white">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 group-hover:text-white">
                  FEATURES
                </h4>
                <ul className="space-y-1">
                  {(plan?.features || []).map((f, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-sm text-gray-600 group-hover:text-white"
                    >
                      <span className="flex items-center justify-center w-3 h-3 rounded-full bg-[#68B39F] text-white mr-2">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {f.value ?? f.feature?.identity}: {f.value ?? (f.count ?? "No Data")}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 flex flex-col flex-grow">
              <div className="flex items-center justify-between mt-4 relative">
                <button
                  onClick={() => toggleActive(index)}
                  className="px-4 py-2 rounded-tl-xl rounded-br-xl text-sm font-medium transition-colors bg-[#68B39F] text-white group-hover:bg-white group-hover:text-[#68B39F]"
                >
                  {activeStates[index] ? "Active" : "Inactive"}
                </button>
                <div className="relative">
                  <MoreVertical
                    className="cursor-pointer bg-[#68B39F] text-white px-2 py-2 rounded-tl-xl rounded-br-xl group-hover:bg-white group-hover:text-[#68B39F]"
                    onClick={() => toggleActions(index)}
                    size={45}
                  />
                  {showActionsIndex === index && (
                    <div className="absolute bottom-full mb-2 right-0 bg-white border rounded-md shadow-md flex flex-col text-sm z-10">
                      <button
                        className="px-4 py-2 hover:bg-gray-100 text-left group-hover:text-[#68B39F]"
                        onClick={() => navigate("/subscription-view", { state: { plan } })}
                      >
                        View
                      </button>
                      <button
                        className="px-4 py-2 hover:bg-gray-100 text-left group-hover:text-[#68B39F]"
                        onClick={() => navigate("/subscription-Edit", { state: { plan } })}
                      >
                        Edit
                      </button>
                      <button
                        className="px-4 py-2 hover:bg-gray-100 text-left text-red-500 group-hover:text-red-300"
                        onClick={() => setDeleteIndex(index)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

        ))}
      </div>

      {deleteIndex !== null && (
        <ConfirmDeleteModal
          onConfirm={handleDeletePlan}
          onCancel={() => setDeleteIndex(null)}
        />
      )}
    </div>
  );
};

export default Subscription;

// function setIsLoading(arg0: boolean) {
//   console.log(arg0)
//   throw new Error("Function not implemented.");
// }
