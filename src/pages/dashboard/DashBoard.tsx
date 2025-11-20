/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
} from "recharts";
import { Zap, Component, Droplet, LifeBuoy } from "lucide-react";
import filterImg from "../../assets/dashboard/filter.png";
import { COLORS, FONTS } from "@/constants/ui constants";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxhooks";
import { GetDashboardThunks } from "@/features/dashboard/redux/thunks";
import { GetDashboardSelector } from "@/features/dashboard/redux/selector";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [skeletonloading, isSkeletonLoading] = useState<boolean>(false);
  const nowDate = new Date();
  const currentMonth = nowDate.getMonth();
  const currentYear = nowDate.getFullYear();

  const dispatch = useAppDispatch();
  const DashBoardDatas = useAppSelector<any>(GetDashboardSelector);



  useEffect(() => {
    const fetch = async () => {
      if (selectedMonth || selectedYear) {
        isSkeletonLoading(true);
        await dispatch(
          GetDashboardThunks({
            month: selectedMonth ?? 0,
            year: selectedYear ?? currentYear,
          })
        );
        isSkeletonLoading(false);
      }
      isSkeletonLoading(true);
      await dispatch(
        GetDashboardThunks({ month: currentMonth, year: currentYear })
      );
      isSkeletonLoading(false);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    };
    fetch();
  }, [currentMonth, currentYear, dispatch, selectedMonth, selectedYear]);

  const SkeletonCard = () => (
    <div
      className={`
      shadow-lg border-0 rounded-tl-3xl w-2/3 gap-3 flex rounded-br-3xl 
      rounded-bl-none rounded-tr-none bg-white p-6 animate-pulse
    `}
    >
      <div className="flex flex-col ml-20 items-center text-center space-y-4">
        {/* Icon placeholder */}
        <div className="w-12 h-12 rounded-full bg-gray-200"></div>

        {/* Title placeholder */}
        <div className="h-4 w-24 bg-gray-200 rounded"></div>

        {/* Circular progress placeholder */}
        <div className="w-20 h-20 rounded-full bg-gray-200"></div>
      </div>
    </div>
  );


  const SkeletonChartHeader = () => (
    <div className="h-66 w-full bg-gray-50 shadow-xl rounded mb-4"></div>
  );



  function setSubcriptionData() {
    try {
      const data = {
        jan: 0,
        feb: 0,
        mar: 0,
        apr: 0,
        may: 0,
        jun: 0,
        jul: 0,
        aug: 0,
        sep: 0,
        oct: 0,
        nov: 0,
        dec: 0,
      };

      DashBoardDatas?.instituteSubscriptions?.forEach((item: any) => {
        const date = new Date(item?.createdAt);
        const month = date.getMonth();

        switch (month) {
          case 0:
            ++data.jan;
            break;
          case 1:
            ++data.feb;
            break;
          case 2:
            ++data.mar;
            break;
          case 3:
            ++data.apr;
            break;
          case 4:
            ++data.may;
            break;
          case 5:
            ++data.jun;
            break;
          case 6:
            ++data.jul;
            break;
          case 7:
            ++data.aug;
            break;
          case 8:
            ++data.sep;
            break;
          case 9:
            ++data.oct;
            break;
          case 10:
            ++data.nov;
            break;
          case 11:
            ++data.dec;
            break;
        }
      });

      return [
        { month: "Jan", subscriptions: data.jan },
        { month: "Feb", subscriptions: data.feb },
        { month: "Mar", subscriptions: data.mar },
        { month: "Apr", subscriptions: data.apr },
        { month: "May", subscriptions: data.may },
        { month: "Jun", subscriptions: data.jun },
        { month: "Jul", subscriptions: data.jul },
        { month: "Aug", subscriptions: data.aug },
        { month: "Sep", subscriptions: data.sep },
        { month: "Oct", subscriptions: data.oct },
        { month: "Nov", subscriptions: data.nov },
        { month: "Dec", subscriptions: data.dec },
      ];
    } catch (error) {
      console.log(error, "sub filter");
    }
  }

  const subscriptionData = setSubcriptionData();

  const [kpiData, setKpiData] = useState<any[]>([]);

  // useEffect(() => {
  //   setKpiData([
  //     {
  //       title: "Total Institute",
  //       value: DashBoardDatas?.totalInstituteCount,
  //       percentage: DashBoardDatas?.totalInstituteCount,
  //       icon: Zap,
  //       bgColor: "bg-teal-600",
  //       iconBg: "bg-teal-100",
  //       iconColor: "text-teal-600",
  //       progressColor: "#14b8a6",
  //     },
  //     {
  //       title: "Institute Subscription",
  //       value: DashBoardDatas?.instituteSubscriptions,
  //       percentage:  DashBoardDatas?.instituteSubscriptions?.length,
  //       icon: Component,
  //       bgColor: "bg-white",
  //       iconBg: "bg-pink-100",
  //       iconColor: "text-pink-500",
  //       progressColor: "#ec4899",
  //     },
  //     {
  //       title: "Active Subscription",
  //       value: DashBoardDatas?.activeSubscriptions,
  //       percentage:  DashBoardDatas?.activeSubscriptions,
  //       icon: Droplet,
  //       bgColor: "bg-white",
  //       iconBg: "bg-purple-100",
  //       iconColor: "text-purple-500",
  //       progressColor: "#8b5cf6",
  //     },
  //     {
  //       title: "New Support Tickets",
  //       value: DashBoardDatas?.supportTickets,
  //       percentage: 25,
  //       icon: LifeBuoy,
  //       bgColor: "bg-white",
  //       iconBg: "bg-yellow-100",
  //       iconColor: "text-yellow-500",
  //       progressColor: "#f59e0b",
  //     },
  //   ]);
  // }, [
  //   DashBoardDatas?.activeSubscriptions,
  //   DashBoardDatas?.instituteSubscriptions?.length,
  //   DashBoardDatas?.supportTickets,
  //   DashBoardDatas?.totalInstituteCount,
  // ]);

  useEffect(() => {
    const ticketData = [
      { title: "Admin Tickets", value: DashBoardDatas?.supportTickets?.adminTickets ?? 0, iconBg: "bg-yellow-100", iconColor: "text-yellow-500", progressColor: "#f59e0b" },
      { title: "Staff Tickets", value: DashBoardDatas?.supportTickets?.staffTickets ?? 0, iconBg: "bg-blue-100", iconColor: "text-blue-500", progressColor: "#3b82f6" },
      { title: "Student Tickets", value: DashBoardDatas?.supportTickets?.studentTickets ?? 0, iconBg: "bg-green-100", iconColor: "text-green-500", progressColor: "#10b981" },
      { title: "Teaching Tickets", value: DashBoardDatas?.supportTickets?.teachingTickets ?? 0, iconBg: "bg-red-100", iconColor: "text-red-500", progressColor: "#ef4444" },
    ];

    const totalTickets = ticketData.reduce((sum, t) => sum + t.value, 0);


    setKpiData([
      {
        title: "Total Institute",
        value: DashBoardDatas?.totalInstituteCount,
        percentage: DashBoardDatas?.totalInstituteCount,
        icon: Zap,
        bgColor: "bg-teal-600",
        iconBg: "bg-teal-100",
        iconColor: "text-teal-600",
        progressColor: "#14b8a6",
      },
      {
        title: "Institute Subscription",
        value: DashBoardDatas?.instituteSubscriptions,
        percentage: DashBoardDatas?.instituteSubscriptions?.length,
        icon: Component,
        bgColor: "bg-white",
        iconBg: "bg-pink-100",
        iconColor: "text-pink-500",
        progressColor: "#ec4899",
      },
      {
        title: "Active Subscription",
        value: DashBoardDatas?.activeSubscriptions,
        percentage: DashBoardDatas?.activeSubscriptions,
        icon: Droplet,
        bgColor: "bg-white",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-500",
        progressColor: "#8b5cf6",
      },
      {
        title: "New Support Tickets",
        value: totalTickets,
        percentage: totalTickets > 0 ? Math.round((totalTickets / 100) * 100) : 0,
        icon: LifeBuoy,
        bgColor: "bg-white",
        iconBg: "bg-yellow-100",
        iconColor: "text-yellow-500",
        progressColor: "#f59e0b",
      },
    ]);
  }, [DashBoardDatas?.activeSubscriptions, DashBoardDatas.adminTickets, DashBoardDatas?.instituteSubscriptions, DashBoardDatas.staffTickets, DashBoardDatas.studentTickets, DashBoardDatas?.supportTickets?.adminTickets, DashBoardDatas?.supportTickets?.staffTickets, DashBoardDatas?.supportTickets?.studentTickets, DashBoardDatas?.supportTickets?.teachingTickets, DashBoardDatas.teachingTickets, DashBoardDatas?.totalInstituteCount]);


  const CircularProgress = ({
    percentage,
    progressColor,
    isLoading,
    isHovered,
  }: {
    percentage: number;
    progressColor: string;
    isLoading: boolean;
    isHovered: boolean;
  }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const visibleCircumference = circumference * 0.75;
    const startAngle = -135;
    const strokeDashoffset = isLoading
      ? visibleCircumference
      : visibleCircumference + (percentage / 100) * visibleCircumference;

    return (
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle - only showing 270 degrees */}
          <path
            d={describeArc(50, 50, radius, startAngle, startAngle + 270)}
            stroke={isHovered ? "rgba(255,255,255,0.3)" : "#e5e7eb"}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Progress circle - only showing 270 degrees */}
          <path
            d={describeArc(50, 50, radius, startAngle, startAngle + 270)}
            stroke={isHovered ? "white" : progressColor}
            strokeWidth="8"
            fill="none"
            strokeDasharray={visibleCircumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Center percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`text-lg font-bold ${isHovered ? "text-white" : "text-gray-800"
              } ${isLoading ? "animate-pulse" : ""}`}
            style={{ ...FONTS.percentage_text }}
          >
            {`${percentage}`}
          </span>
        </div>
      </div>
    );
  };

  function describeArc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(" ");
  }

  function polarToCartesian(
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg border-gray-200">
          <p
            style={{ ...FONTS.small_text, color: COLORS.black }}
          >{`${label}`}</p>
          <p
            style={{ ...FONTS.small_text, color: COLORS.secondary }}
          >{`Subscriptions: ${payload[0].payload.subscriptions}`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomBar = (props: any) => {
    const { fill, ...rest } = props;
    const currentDate = new Date();
    const shortMonthName = currentDate.toLocaleString("default", {
      month: "short",
    });
    const isCurrentMonthBar = props.payload?.month === shortMonthName;
    const isHovered = hoveredBar === props.payload?.index;

    return (
      <g>
        <defs>
          <pattern
            id={`crosshatch-${props.payload?.index}`}
            patternUnits="userSpaceOnUse"
            width="4"
            height="4"
          >
            <rect width="4" height="4" fill="#fff" />
            <path
              d="M 0,4 l 4,-4 M -1,1 l 2,-2 M 3,5 l 2,-2"
              stroke="#68B39F"
              strokeWidth="0.8"
              opacity="0.6"
            />
          </pattern>
          <pattern
            id={`crosshatch-hover-${props.payload?.index}`}
            patternUnits="userSpaceOnUse"
            width="4"
            height="4"
          >
            <rect width="4" height="4" fill="#68B39F" />
            <path
              d="M 0,4 l 4,-4 M -1,1 l 2,-2 M 3,5 l 2,-2"
              stroke="#68B39F"
              strokeWidth="1"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <rect
          {...rest}
          className="cursor-pointer"
          fill={
            isCurrentMonthBar
              ? "#2D6974"
              : isHovered
                ? `url(#crosshatch-hover-${props.payload?.index})`
                : `url(#crosshatch-${props.payload?.index})`
          }
          rx="6"
          ry="6"
        />
      </g>
    );
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const revenueData: any[] | undefined = [];

  DashBoardDatas?.revenue?.forEach((item: number, index: number) => {
    revenueData.push({ month: months[index], amount: item });
  });
  const years = ["2022", "2023", "2024", "2025"];

  const resetFilters = () => {
    setSelectedMonth(null);
    setSelectedYear(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Filter Button */}
        <div className="flex justify-start">
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
        </div>

        {showFilter && (
          <Card className="shadow-lg border-0 p-4">
            <div className="flex items-center justify-between">
              <h2 style={{ ...FONTS.sub_text, color: COLORS.secondary }}>
                Filters
              </h2>
              <Button
                variant="outline"
                className="bg-[#68B39F] text-white hover:bg-[#2D6974] rounded-md px-4 py-2 rounded-tl-2xl rounded-br-2xl rounded-bl-none rounded-tr-none"
                onClick={resetFilters}
              >
                Reset
              </Button>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
              <div className="flex-1">
                <label
                  className="block mb-1"
                  style={{ ...FONTS.button_text, color: COLORS.black }}
                >
                  Month
                </label>
                <select
                  className="w-full p-2 border border-[#999] rounded-md focus:ring-[#68B39F] focus:border-[#68B39F]"
                  value={selectedMonth || ""}
                  style={{ ...FONTS.option_text, color: COLORS.black }}
                  onChange={(e) => setSelectedMonth(e.target.value || null)}
                >
                  <option
                    value=""
                    style={{ ...FONTS.option_text, color: COLORS.black }}
                  >
                    All Months
                  </option>
                  {months.map((month) => (
                    <option
                      key={month}
                      value={month}
                      style={{ ...FONTS.option_text, color: COLORS.black }}
                    >
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label
                  className="block mb-1"
                  style={{ ...FONTS.button_text, color: COLORS.black }}
                >
                  Year
                </label>
                <select
                  className="w-full p-2 border border-[#999] rounded-md focus:ring-[#68B39F] focus:border-[#68B39F]"
                  value={selectedYear || ""}
                  style={{ ...FONTS.option_text, color: COLORS.black }}
                  onChange={(e) => setSelectedYear(e.target.value || null)}
                >
                  <option
                    value=""
                    style={{ ...FONTS.option_text, color: COLORS.black }}
                  >
                    All Years
                  </option>
                  {years.map((year) => (
                    <option
                      key={year}
                      value={year}
                      style={{ ...FONTS.option_text, color: COLORS.black }}
                    >
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        )}

        {skeletonloading ? (
          <>
            <div className="flex gap-5">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpiData.map((kpi, index) => {
                const isHovered = hoveredCard === index;
                const IconComponent = kpi.icon;

                return (
                  <Card
                    key={index}
                    className={`
    shadow-lg transition-all duration-300 cursor-pointer border-0
    rounded-tl-3xl rounded-br-3xl rounded-bl-none rounded-tr-none
    ${isHovered
                        ? "bg-[#2D6974] text-white hover:scale-90"
                        : "bg-white text-gray-900 hover:scale-100"
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
          ${isHovered ? "bg-white/20" : kpi.iconBg}
        `}
                        >
                          <IconComponent
                            className={`
            w-6 h-6
            ${isHovered ? "text-white" : kpi.iconColor}
          `}
                          />
                        </div>

                        {/* Title */}
                        <h3
                          className={`
          text-sm font-medium leading-tight
          ${isHovered ? "text-white/90" : "text-gray-600"}
        `}
                          style={{ ...FONTS.card_text }}
                        >
                          {kpi.title}
                        </h3>

                        {/* Circular progress */}
                        <div className="flex flex-col items-center">
                          <CircularProgress
                            percentage={kpi.percentage}
                            progressColor={kpi.progressColor}
                            isLoading={isLoading}
                            isHovered={isHovered}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        <div className="space-y-6">
          <h1 style={{ ...FONTS.bold_heading }}>Graphs & Trends</h1>

          {skeletonloading ? (
            <>
              <SkeletonChartHeader />
            </>
          ) : (
            <>
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-4 flex flex-row justify-between items-center">
                  <CardTitle style={{ ...FONTS.sub_text, color: COLORS.button }}>
                    Revenue Trends (Monthly)
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="flex">
                    <div className="flex-1 h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={revenueData}
                          onMouseMove={(e) => {
                            if (e && typeof e.activeTooltipIndex === "number") {
                              setHoveredBar(e.activeTooltipIndex);
                            }
                          }}
                          onMouseLeave={() => setHoveredBar(null)}
                        >
                          <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            style={{ ...FONTS.small_text, color: COLORS.gray_01 }}
                          />
                          <YAxis
                            dataKey="amount"
                            axisLine={false}
                            tickLine={false}
                            style={{ ...FONTS.small_text, color: COLORS.gray_01 }}
                          />
                          <Bar
                            dataKey="amount"
                            maxBarSize={50}
                            shape={<CustomBar />}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}



          {skeletonloading ? (
            <>
              <SkeletonChartHeader />
            </>
          ) : (
            <>
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-4 flex flex-row justify-between items-center">
                  <div>
                    <CardTitle style={{ ...FONTS.card_text, color: COLORS.black }}>
                      Subscription{" "}
                      <span style={{ ...FONTS.sub_text_2, color: COLORS.black }}>
                        Details
                      </span>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={subscriptionData}
                        margin={{ top: 5, right: 10, left: 10, bottom: 25 }}
                      >
                        <defs>
                          <linearGradient
                            id="lineGradient"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="0"
                          >
                            <stop offset="0%" stopColor="#2D6974" stopOpacity={1} />
                            <stop
                              offset="100%"
                              stopColor="#68B39F"
                              stopOpacity={1}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#6b7280", fontSize: 12 }}
                          interval={0}
                          style={{ ...FONTS.small_text, color: COLORS.gray_02 }}
                        />
                        <YAxis hide />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="subscriptions"
                          stroke="url(#lineGradient)"
                          strokeWidth={1.5}
                          dot={{
                            r: 0,
                            stroke: "#2D6974",
                            strokeWidth: 1,
                            fill: "#fff",
                          }}
                          activeDot={{
                            r: 3,
                            fill: "#2D6974",
                            stroke: "#fff",
                            strokeWidth: 2,
                          }}
                        />

                        <Line
                          type="monotone"
                          dataKey="subscriptions"
                          stroke="#2D6974"
                          strokeWidth={3}
                          strokeOpacity={0.2}
                          dot={false}
                          activeDot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
