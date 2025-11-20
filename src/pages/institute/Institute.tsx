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
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectInstitutes } from '@/features/institute/reducers/selectors';
import { getInstitutesData } from '@/features/institute/reducers/thunks';
import { GetImageUrl } from '../../utils/helper';

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
      <div>
        <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
        <div className="h-10 w-full bg-gray-300 rounded"></div>
      </div>
      <div>
        <div className="h-4 w-16 bg-gray-300 rounded mb-2"></div>
        <div className="h-10 w-full bg-gray-300 rounded"></div>
      </div>
      <div>
        <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
        <div className="h-10 w-full bg-gray-300 rounded"></div>
      </div>
    </div>
  </Card>
);

interface Institute {
  id: number;
  institute_name: string;
  contact_info: {
    address: {
      city: string;
      state: string;
      country: string;
      postal_code: string;
    };
    phone_no: string;
  };
  type: string;
  logo: string;
  subscription?: {
    identity: string;
  };
  institute_active_status: string;
  registered_date: string;
  image: string;
}

const Institutes: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const instituteData = useSelector(selectInstitutes);
  console.log(instituteData,"institute data")
  const activeCount = instituteData.filter((item: any) => item.Institute_Status === "active").length;
  const inactiveCount = instituteData.filter((item: any) => item.Institute_Status === "inactive").length;

  console.log("Active:", activeCount);
  console.log("Inactive:", inactiveCount);

  useEffect(() => {
    (async () => {
      try {
        await dispatch(getInstitutesData());
      } catch (error) {
        console.error('Error fetching institutes:', error);
      } finally {
        setIsLoading(false);
      }
    })()
  }, [dispatch]);

  // Filter institutes based on selected filters
  useEffect(() => {
    if (!instituteData) return;

    let result = [...instituteData];

    if (selectedPlan) {
      result = result.filter(
        (institute) => institute.subscription?.identity === selectedPlan
      );
    }

    if (selectedStatus) {
      result = result.filter(
        (institute) => institute.institute_active_status === selectedStatus
      );
    }

    if (selectedDate) {
      const now = new Date();
      const dateFilter = new Date();

      switch (selectedDate) {
        case "lastWeek":
          dateFilter.setDate(now.getDate() - 7);
          break;
        case "lastMonth":
          dateFilter.setMonth(now.getMonth() - 1);
          break;
        case "lastYear":
          dateFilter.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }

      result = result.filter(
        (institute) => new Date(institute.registered_date) >= dateFilter
      );
    }

    setFilteredInstitutes(result);
  }, [selectedPlan, selectedStatus, selectedDate, instituteData]);

  const [filteredInstitutes, setFilteredInstitutes] = useState<Institute[]>([]);

  const [kpiData,] = useState([
    {
      title: 'Total Institute',
      value: instituteData.length,
      percentage: 0,
      icon: Zap,
      bgColor: 'bg-teal-600',
      iconBg: 'bg-teal-100',
      iconColor: 'text-purple-500',
      progressColor: '#14b8a6',
    },
    {
      title: 'Active Institute',
      value: activeCount,
      percentage: 0,
      icon: Component,
      bgColor: 'bg-white',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-500',
      progressColor: '#8b5cf6',
    },
    {
      title: 'Blocked Institute',
      value: inactiveCount || 0,
      percentage: 0,
      icon: Droplet,
      bgColor: 'bg-white',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-500',
      progressColor: '#f59e0b',
    },
  ]);


  // useEffect(() => {
  //   if (!instituteData) return;

  //   const total = instituteData?.length;
  //   const filteredTotal = filteredInstitutes?.length;
  //   const filteredActive = filteredInstitutes?.filter(
  //     (i) => i.institute_active_status === 'Active'
  //   ).length;
  //   const filteredBlocked = filteredInstitutes.filter(
  //     (i) => i.institute_active_status === 'Blocked'
  //   ).length;

  //   // setKpiData([
  //   //   {
  //   //     ...kpiData[0],
  //   //     value: `${total}`,
  //   //     percentage: total > 0 ? Math.round((filteredTotal / total) * 100) : 0,
  //   //   },
  //   //   {
  //   //     ...kpiData[1],
  //   //     value: `${filteredActive}`,
  //   //     percentage:
  //   //       filteredTotal > 0
  //   //         ? Math.round((filteredActive / filteredTotal) * 100)
  //   //         : 0,
  //   //   },
  //   //   {
  //   //     ...kpiData[2],
  //   //     value: `${filteredBlocked}`,
  //   //     percentage:
  //   //       filteredTotal > 0
  //   //         ? Math.round((filteredBlocked / filteredTotal) * 100)
  //   //         : 0,
  //   //   },
  //   // ]);
  // }, [filteredInstitutes, instituteData]);

  // Update institute plan
  const updateInstitutePlan = (id: number, newPlan: string) => {
    console.log(`Updating institute ${id} to plan ${newPlan}`);
  };

  // Update institute status
  const updateInstituteStatus = (id: number, newStatus: string) => {
    console.log(`Updating institute ${id} to status ${newStatus}`);
  };

  // Filter options
  const subscriptionPlans = ['Basic Plan - Free', 'Standard', 'Premium'];
  const statusOptions = ['Active', 'Blocked'];
  const dateOptions = [
    { value: 'lastWeek', label: 'Last Week' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'lastYear', label: 'Last Year' },
  ];

  const resetFilters = () => {
    setSelectedPlan(null);
    setSelectedStatus(null);
    setSelectedDate(null);
  };

  const getLocationString = (institute: Institute) => {
    const { city, state, country } = institute.contact_info.address;
    return [city, state, country].filter(Boolean).join(', ');
  };

  return (
    <div className="min-h-screen p-3">
      <div className="mx-auto space-y-6">
        {/* Header - Static buttons (no skeleton) */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            className="bg-[#68B39F] text-white border-[#68B39F] hover:bg-[#2D6974] rounded-tl-2xl rounded-br-2xl rounded-bl-none rounded-tr-none px-4 py-6"
            onClick={() => setShowFilter(!showFilter)}
          >
            <img src={filterImg} className="w-6 h-6 mr-2" />
            <span style={{ ...FONTS.button_text }}>
              {showFilter ? "Hide Filter" : "Show Filter"}
            </span>
          </Button>
          <Button
            className="bg-[#68B39F] text-white border-[#68B39F] hover:bg-[#2D6974] rounded-tl-2xl rounded-br-2xl rounded-bl-none rounded-tr-none px-4 py-6"
            onClick={() => {
              navigate("/institute/add");
            }}
          >
            <Plus className="w-6 h-6" />
            <span style={{ ...FONTS.button_text }}>Add Institute</span>
          </Button>
        </div>

        {/* Show skeleton loader while loading */}
        {isLoading ? (
          <>
            {/* Filter Card Skeleton (if shown) */}
            {showFilter && <SkeletonFilterCard />}

            {/* KPI Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(3)].map((_, index) => (
                <SkeletonKpiCard key={index} />
              ))}
            </div>

            {/* Institute Cards Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, index) => (
                <SkeletonInstituteCard key={index} />
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Filter Card */}
            {showFilter && (
              <Card className='shadow-lg border-0 p-4'>
                <div className='flex items-center justify-between'>
                  <h2 style={{ ...FONTS.sub_text, color: COLORS.secondary }}>
                    Filters
                  </h2>
                  <Button
                    variant='outline'
                    className='bg-[#68B39F] text-white hover:bg-[#2D6974] rounded-md px-4 py-2 rounded-tl-2xl rounded-br-2xl rounded-bl-none rounded-tr-none'
                    onClick={resetFilters}
                  >
                    Reset
                  </Button>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
                  {/* Subscription Plan Filter */}
                  <div>
                    <label
                      className='block mb-1'
                      style={{ ...FONTS.button_text, color: COLORS.black }}
                    >
                      Subscription Plan
                    </label>
                    <select
                      className='w-full p-2 border border-[#999] rounded-md focus:ring-[#68B39F] focus:border-[#68B39F]'
                      value={selectedPlan || ''}
                      style={{ ...FONTS.option_text, color: COLORS.black }}
                      onChange={(e) => setSelectedPlan(e.target.value || null)}
                    >
                      <option
                        value=''
                        style={{ ...FONTS.option_text, color: COLORS.black }}
                      >
                        All Plans
                      </option>
                      {subscriptionPlans?.map((plan) => (
                        <option
                          key={plan}
                          value={plan}
                          style={{ ...FONTS.option_text, color: COLORS.black }}
                        >
                          {plan}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label
                      className='block mb-1'
                      style={{ ...FONTS.button_text, color: COLORS.black }}
                    >
                      Status
                    </label>
                    <select
                      className='w-full p-2 border border-[#999] rounded-md focus:ring-[#68B39F] focus:border-[#68B39F]'
                      value={selectedStatus || ''}
                      style={{ ...FONTS.option_text, color: COLORS.black }}
                      onChange={(e) => setSelectedStatus(e.target.value || null)}
                    >
                      <option
                        value=''
                        style={{ ...FONTS.option_text, color: COLORS.black }}
                      >
                        All Statuses
                      </option>
                      {statusOptions?.map((status) => (
                        <option
                          key={status}
                          value={status}
                          style={{ ...FONTS.option_text, color: COLORS.black }}
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Filter */}
                  <div>
                    <label
                      className="block mb-1"
                      style={{ ...FONTS.button_text, color: COLORS.black }}
                    >
                      Joined Date
                    </label>
                    <select
                      className="w-full p-2 border border-[#999] rounded-md focus:ring-[#68B39F] focus:border-[#68B39F]"
                      value={selectedDate || ""}
                      style={{ ...FONTS.option_text, color: COLORS.black }}
                      onChange={(e) => setSelectedDate(e.target.value || null)}
                    >
                      <option
                        value=""
                        style={{ ...FONTS.option_text, color: COLORS.black }}
                      >
                        All Time
                      </option>
                      {dateOptions.map((date) => (
                        <option
                          key={date.value}
                          value={date.value}
                          style={{ ...FONTS.option_text, color: COLORS.black }}
                        >
                          {date.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </Card>
            )}

            {/* KPI Cards */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
              {kpiData?.map((kpi, index) => {
                const isHovered = hoveredCard === index;
                const IconComponent = kpi.icon;

                return (
                  <Card
                    key={index}
                    className={`
                      shadow-lg transition-all duration-300 cursor-pointer border-0
                      rounded-tl-3xl rounded-br-3xl rounded-bl-none rounded-tr-none
                      ${hoveredCard === index
                        ? 'bg-[#2D6974] text-gray-900 hover:scale-90'
                        : 'bg-white text-gray-900 hover:scale-100'
                      }
                    `}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        {/* Icon with background circle */}
                        <div
                          className={`
                            w-12 h-12 rounded-full flex items-center justify-center
                            ${hoveredCard === index ? 'bg-white/20' : kpi.iconBg}
                          `}
                        >
                          <IconComponent
                            className={`
                              w-6 h-6
                              ${hoveredCard === index ? 'text-white' : kpi.iconColor}
                            `}
                          />
                        </div>

                        {/* Title */}
                        <h3
                          className={`
                            text-sm font-medium leading-tight
                            ${isHovered
                              ? 'text-white'
                              : 'text-[#242731]'
                            }
                          `}
                          style={{ ...FONTS.card_text }}
                        >
                          {kpi?.title}
                        </h3>

                        <div>
                          <p style={{ ...FONTS.big_text }}>{kpi?.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Institute List */}
            {filteredInstitutes?.length > 0 ? (
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {filteredInstitutes?.map((institute: any) => (
                  <Card
                    key={institute?._id}
                    className='bg-white shadow-sm hover:shadow-md transition-shadow'
                  >
                    <CardContent className='px-6'>
                      <div className=''>
                        <div className='flex items-center gap-4 mb-4'>
                          <div className='w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold shadow-md'>
                            {institute?.logo && (
                              <img
                                src={GetImageUrl(institute?.logo) ?? undefined}
                                alt={institute?.institute_name}
                                className='rounded-lg w-full h-full object-cover'
                              />
                            )}
                          </div>
                          <h3
                            className=' !text-[#242731] mb-3'
                            style={{ ...FONTS.tableheader }}
                          >
                            {institute?.institute_name}
                          </h3>
                        </div>

                        <div className='flex-1'>
                          <div className='flex items-center gap-6 text-sm text-gray-500 mb-4'>
                            <div className='flex items-center gap-1'>
                              <img
                                src={locationImg}
                                alt={getLocationString(institute)}
                                className='w-5 h-5 object-cover'
                              />
                              <span
                                style={{ ...FONTS.btn_txt, color: COLORS.gray_01 }}
                              >
                                {getLocationString(institute)}
                              </span>
                            </div>

                            <div className='flex items-center gap-1'>
                              <img
                                src={buildingImg}
                                alt={institute?.type || 'Main'}
                                className='w-5 h-5 object-cover'
                              />
                              <span
                                style={{ ...FONTS.btn_txt, color: COLORS.gray_01 }}
                              >
                                {institute?.type || 'Branches'}
                              </span>
                            </div>
                          </div>

                          <div className='flex justify-between gap-3'>
                            {/* Plan Dropdown */}
                            {/* <DropdownMenu> */}
                              <div>
                                <Button
                                  variant='outline'
                                  className='!text-[#2D6974] border-[#2D6974] px-4 flex items-center gap-2'
                                  style={{ ...FONTS.pass_head_2 }}
                                >
                                  {institute?.subscription?.identity || 'No Plan'}
                                  {/* <ChevronDown className='w-4 h-4' /> */}
                                </Button>
                              </div>
                              {/* <DropdownMenuContent>
                                {subscriptionPlans.map((plan) => (
                                  <DropdownMenuItem
                                    key={plan}
                                    onSelect={() =>
                                      updateInstitutePlan(institute.id, plan)
                                    }
                                  >
                                    {plan}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent> */}
                            {/* </DropdownMenu> */}

                            <div className='flex gap-2'>
                              {/* Status Dropdown */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    className={`px-4 flex items-center gap-2 ${institute?.institute_active_status ===
                                      'Active'
                                      ? 'bg-[#68B39F] hover:bg-[#68B39F]'
                                      : 'bg-red-500 hover:bg-red-600'
                                      }`}
                                    style={{
                                      ...FONTS.pass_head_2,
                                      color: COLORS.white,
                                    }}
                                    disabled
                                  >
                                    {institute.institute_active_status}
                                    <ChevronDown className='w-4 h-4' />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  {statusOptions.map((status) => (
                                    <DropdownMenuItem
                                      key={status}
                                      onSelect={() =>
                                        updateInstituteStatus(institute.id, status)
                                      }
                                    >
                                      {status}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>

                              {/* View Button */}
                              <Button
                                variant='outline'
                                className='!text-white bg-[#2D6974] px-4 flex items-center gap-2'
                                style={{ ...FONTS.pass_head_2 }}
                                onClick={() => {
                                  navigate(`/institute/view/${institute?.uuid}`);
                                }}
                              >
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className='text-center p-8'>
                <h3 style={{ ...FONTS.tableheader, color: COLORS.secondary }}>
                  No Institutes Found
                </h3>
                <p className='mt-2' style={{ ...FONTS.btn_txt }}>
                  Try adjusting your filters to find what you're looking for.
                </p>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Institutes;