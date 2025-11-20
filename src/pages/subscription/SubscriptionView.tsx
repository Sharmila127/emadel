/* eslint-disable @typescript-eslint/no-explicit-any */

import { useNavigate, useLocation } from "react-router-dom";

const SubscriptionView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan;
  const plans = location.state?.plan.features;
  console.log(plans, "plans")
  console.log(plan, "plan")

  if (!plan) {
    return (
      <div className="p-6">
        <p>No subscription data available.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 rounded-tl-xl rounded-br-xl border border-[#68B39F] text-[#68B39F] hover:bg-[#68B39F] hover:text-white transition"
        >
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 flex flex-col items-center space-y-6 overflow-hidden">
      <div className="w-full max-w-5xl flex justify-start">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-tl-xl rounded-br-xl border border-[#68B39F] text-[#68B39F] hover:bg-[#68B39F] hover:text-white transition"
        >
          ← Back
        </button>
      </div>

      <div className="bg-white shadow rounded-xl max-w-5xl w-full border">
        {/* <div className="bg-gray-100 flex justify-center items-center h-56">
          <img
            src={plan.image}
            alt={plan.identity}
            className="h-full max-w-full object-contain"
          />
        </div> */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-1">{plan.identity}</h2>
          <p className="text-gray-600 mb-4">{plan.description}</p>
          <hr className="mb-4" />

          <h2 className="text-2xl font-bold mb-1">Plan OverView</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-y-2 text-sm mb-4">
            <div>
              <span className="text-lg font-bold">Price:</span> ₹{plan?.duration?.value} / {plan?.duration?.unit}
            </div>
            <div>
              <span className="text-lg font-bold">Status:</span>{" "}
              <span className={plan.is_Active ? "text-green-600" : "text-red-600"}>
                {plan.is_Active ? "Active" : "Inactive"}
              </span>
            </div>
            <div>
              <span className="text-lg font-bold">CreatedAt:</span> {plan?.createdAt}
            </div>
            <div>
              <span className="text-lg font-bold">Billing Cycle:</span> {plan?.duration?.unit}
            </div>
             <div>
              <span className="text-lg font-bold">Maximum Users:</span> {plan?.maximum_users}
            </div>
          </div>

          <hr className="mb-4" />
          <h4 className="text-2xl font-bold mb-1">Features Included</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm mb-4">
            {(plan.features || []).map((f: any, idx: number) => (
              <div key={idx} className=" flex items-center gap-2">
                {/* <span className="w-5 h-5 flex items-center justify-center border border-[#68B39F] rounded-full text-xs font-bold">
                  ✓
                </span> */}
                <span>
                  <span className="text-lg font-bold">{f.feature?.identity || f.label}:</span>{" "}
                  {f.value ?? f.count ?? "No Data"}
                </span>
              </div>
            ))}
          </div>

         
              <hr className="mb-4" />
              <h3 className="font-semibold mb-2">Why Choose This Plan?</h3>
              <p className="text-sm text-gray-700 whitespace-pre-line">{plan.description}</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionView;
