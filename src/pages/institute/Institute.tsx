/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Component, Droplet, Plus, ChevronDown } from "lucide-react";
import filterImg from "../../assets/dashboard/filter.png";
import { COLORS, FONTS } from "@/constants/ui constants";
import locationImg from "../../assets/institute/location.png";
import buildingImg from "../../assets/institute/building.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectInstitutes } from "@/features/institute/reducers/selectors";
import { getInstitutesData } from "@/features/institute/reducers/thunks";
import { GetImageUrl } from "../../utils/helper";

// Skeleton Loader Components
const SkeletonKpiCard = () => (
  <Card className="shadow-lg border-0 rounded-tl-3xl rounded-br-3xl rounded-bl-none rounded-tr-none bg-white animate-pulse">
    <CardContent className="p-6">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-gray-300"></div>
        <div className="h-4 w-24 bg-gray-300 rounded"></div>
        <div className="h-8 w-16 bg-gray-300 rounded"></div>
      </div>
    </CardContent>
  </Card>
);

const SkeletonInstituteCard = () => (
  <Card className="bg-white shadow-sm animate-pulse">
    <CardContent className="px-6 py-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
        <div className="h-6 w-40 bg-gray-300 rounded"></div>
      </div>
      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-gray-300 rounded"></div>
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-gray-300 rounded"></div>
          <div className="h-4 w-20 bg-gray-300 rounded"></div>
        </div>
      </div>
      <div className="flex justify-between gap-3">
        <div className="h-10 w-32 bg-gray-300 rounded"></div>
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-gray-300 rounded"></div>
          <div className="h-10 w-16 bg-gray-300 rounded"></div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const SkeletonFilterCard = () => (
  <Card className="shadow-lg border-0 p-4 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-6 w-20 bg-gray-300 rounded"></div>
      <div className="h-10 w-20 bg-gray-300 rounded"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, index) => (
        <div key={index}>
          <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
          <div className="h-10 w-full bg-gray-300 rounded"></div>
        </div>
      ))}
    </div>
  </Card>
);

interface Institute {
  _id: string;
  uuid: string;
  institute_name: string;
  contact_info: {
    address: {
      city: string;
      state: string;
      country: string;
      postal_code?: string;
    };
    phone_no?: string;
  };
  type?: string;
  logo?: string;
  subscription?: {
    identity: string;
  };
  institute_active_status: string;
  registered_date: string;
  image?: string;
}

const Institutes: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filteredInstitutes, setFilteredInstitutes] = useState<Institute[]>([]);

  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const instituteData: Institute[] = useSelector(selectInstitutes) || [];

  const activeCount = instituteData.filter(i => i.institute_active_status === "Active").length;
  const inactiveCount = instituteData.filter(i => i.institute_active_status === "Blocked").length;

  const kpiData = [
    { title: 'Total Institute', value: instituteData.length, icon: Zap, iconBg: 'bg-teal-100', iconColor: 'text-purple-500' },
    { title: 'Active Institute', value: activeCount, icon: Component, iconBg: 'bg-purple-100', iconColor: 'text-purple-500' },
    { title: 'Blocked Institute', value: inactiveCount, icon: Droplet, iconBg: 'bg-yellow-100', iconColor: 'text-yellow-500' },
  ];

  useEffect(() => {
    (async () => {
      try {
        await dispatch(getInstitutesData());
      } catch (error) {
        console.error("Error fetching institutes:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    let result = [...instituteData];

    if (selectedPlan) {
      result = result.filter(i => i.subscription?.identity === selectedPlan);
    }
    if (selectedStatus) {
      result = result.filter(i => i.institute_active_status === selectedStatus);
    }
    if (selectedDate) {
      const now = new Date();
      const dateFilter = new Date();
      switch (selectedDate) {
        case "lastWeek": dateFilter.setDate(now.getDate() - 7); break;
        case "lastMonth": dateFilter.setMonth(now.getMonth() - 1); break;
        case "lastYear": dateFilter.setFullYear(now.getFullYear() - 1); break;
      }
      result = result.filter(i => new Date(i.registered_date) >= dateFilter);
    }

    setFilteredInstitutes(result);
  }, [selectedPlan, selectedStatus, selectedDate, instituteData]);

  const resetFilters = () => {
    setSelectedPlan(null);
    setSelectedStatus(null);
    setSelectedDate(null);
  };

  const getLocationString = (institute: Institute) => {
    const { city, state, country } = institute.contact_info.address;
    return [city, state, country].filter(Boolean).join(", ");
  };

  const subscriptionPlans = ["Basic Plan - Free", "Standard", "Premium"];
  const statusOptions = ["Active", "Blocked"];
  const dateOptions = [
    { value: "lastWeek", label: "Last Week" },
    { value: "lastMonth", label: "Last Month" },
    { value: "lastYear", label: "Last Year" },
  ];

  return (
    <div className="min-h-screen p-3">
      <div className="mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            className="bg-[#68B39F] text-white border-[#68B39F] hover:bg-[#2D6974] rounded-tl-2xl rounded-br-2xl px-4 py-6"
            onClick={() => setShowFilter(!showFilter)}
          >
            <img src={filterImg} className="w-6 h-6 mr-2" />
            <span style={{ ...FONTS.button_text }}>
              {showFilter ? "Hide Filter" : "Show Filter"}
            </span>
          </Button>
          <Button
            className="bg-[#68B39F] text-white border-[#68B39F] hover:bg-[#2D6974] rounded-tl-2xl rounded-br-2xl px-4 py-6"
            onClick={() => navigate("/institute/add")}
          >
            <Plus className="w-6 h-6" />
            <span style={{ ...FONTS.button_text }}>Add Institute</span>
          </Button>
        </div>

        {isLoading ? (
          <>
            {showFilter && <SkeletonFilterCard />}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(3)].map((_, idx) => <SkeletonKpiCard key={idx} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, idx) => <SkeletonInstituteCard key={idx} />)}
            </div>
          </>
        ) : (
          <>
            {showFilter && (
              <Card className="shadow-lg border-0 p-4">
                <div className="flex items-center justify-between">
                  <h2 style={{ ...FONTS.sub_text, color: COLORS.secondary }}>Filters</h2>
                  <Button
                    variant="outline"
                    className="bg-[#68B39F] text-white hover:bg-[#2D6974] rounded-md px-4 py-2 rounded-tl-2xl rounded-br-2xl"
                    onClick={resetFilters}
                  >
                    Reset
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {/* Subscription Plan Filter */}
                  <div>
                    <label className="block mb-1" style={{ ...FONTS.button_text, color: COLORS.black }}>
                      Subscription Plan
                    </label>
                    <select
                      value={selectedPlan || ""}
                      onChange={e => setSelectedPlan(e.target.value || null)}
                      className="w-full p-2 border border-[#999] rounded-md"
                    >
                      <option value="">All Plans</option>
                      {subscriptionPlans.map(plan => <option key={plan} value={plan}>{plan}</option>)}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block mb-1" style={{ ...FONTS.button_text, color: COLORS.black }}>Status</label>
                    <select
                      value={selectedStatus || ""}
                      onChange={e => setSelectedStatus(e.target.value || null)}
                      className="w-full p-2 border border-[#999] rounded-md"
                    >
                      <option value="">All Statuses</option>
                      {statusOptions.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </div>

                  {/* Date Filter */}
                  <div>
                    <label className="block mb-1" style={{ ...FONTS.button_text, color: COLORS.black }}>Joined Date</label>
                    <select
                      value={selectedDate || ""}
                      onChange={e => setSelectedDate(e.target.value || null)}
                      className="w-full p-2 border border-[#999] rounded-md"
                    >
                      <option value="">All Time</option>
                      {dateOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                </div>
              </Card>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {kpiData.map((kpi, idx) => {
                const isHovered = hoveredCard === idx;
                const Icon = kpi.icon;
                return (
                  <Card
                    key={idx}
                    className={`shadow-lg transition-all duration-300 cursor-pointer border-0 rounded-tl-3xl rounded-br-3xl rounded-bl-none rounded-tr-none
                    ${isHovered ? "bg-[#2D6974] text-gray-900" : "bg-white text-gray-900"}`}
                    onMouseEnter={() => setHoveredCard(idx)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${kpi.iconBg}`}>
                          <Icon className={`w-6 h-6 ${kpi.iconColor}`} />
                        </div>
                        <h3 style={{ ...FONTS.card_text }}>{kpi.title}</h3>
                        <p style={{ ...FONTS.big_text }}>{kpi.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Institute Cards */}
            {filteredInstitutes.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredInstitutes.map(inst => (
                  <Card key={inst._id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="px-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold shadow-md">
                          {inst.logo && <img src={GetImageUrl(inst.logo)} alt={inst.institute_name} className="rounded-lg w-full h-full object-cover" />}
                        </div>
                        <h3 style={{ ...FONTS.tableheader }}>{inst.institute_name}</h3>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <img src={locationImg} className="w-5 h-5 object-cover" alt={getLocationString(inst)} />
                          <span>{getLocationString(inst)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <img src={buildingImg} className="w-5 h-5 object-cover" alt={inst.type || "Main"} />
                          <span>{inst.type || "Branches"}</span>
                        </div>
                      </div>

                      <div className="flex justify-between gap-3">
                        <Button variant="outline" className="!text-[#2D6974] border-[#2D6974] px-4 flex items-center gap-2">
                          {inst.subscription?.identity || "No Plan"}
                        </Button>

                        <div className="flex gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button className={`px-4 flex items-center gap-2 ${inst.institute_active_status === "Active" ? "bg-[#68B39F]" : "bg-red-500"}`} disabled>
                                {inst.institute_active_status}
                                <ChevronDown className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {statusOptions.map(status => (
                                <DropdownMenuItem key={status}>{status}</DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>

                          <Button className="!text-white bg-[#2D6974] px-4 flex items-center gap-2" onClick={() => navigate(`/institute/view/${inst.uuid}`)}>
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center p-8">
                <h3 style={{ ...FONTS.tableheader, color: COLORS.secondary }}>No Institutes Found</h3>
                <p style={{ ...FONTS.btn_txt }}>Try adjusting your filters to find what you're looking for.</p>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Institutes;
