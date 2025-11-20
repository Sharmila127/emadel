import { Card, CardContent } from '@/components/ui/card';
import { Zap, Component, Droplet } from 'lucide-react';
import { FONTS } from '@/constants/ui constants';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetAllNotificationThunks } from '@/features/notification/redux/thunks';

const StatsCard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const dispatch = useDispatch();

  const notifications = useSelector(
    (state: any) => state?.Notification?.notification || []
  );

  useEffect(() => {
    dispatch(GetAllNotificationThunks({}) as any);
  }, [dispatch]);

  const totalNotifications = notifications?.length;
  const seenNotifications = notifications?.filter((n: any) => n?.status === 'read').length;
  const unseenNotifications = notifications?.filter((n: any) => n?.status === 'unread').length;
  
  const maxNotifications = 100;

  const kpiData = [
    {
      title: 'Total Notifications',
      value: totalNotifications,
      percentage: totalNotifications > 0 ? Math.min((totalNotifications / maxNotifications) * 100, 100) : 0, 
      icon: Zap,
      bgColor: 'bg-teal-600',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      progressColor: '#14b8a6',
    },
    {
      title: 'Seen Notifications',
      value: seenNotifications,
      percentage: totalNotifications ? (seenNotifications / totalNotifications) * 100 : 0,
      icon: Component,
      bgColor: 'bg-white',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-500',
      progressColor: '#8b5cf6',
    },
    {
      title: 'Unseen Notifications',
      value: unseenNotifications,
      percentage: totalNotifications > 0 ? Math.min((totalNotifications / maxNotifications) * 100, 100) : 0, 
      icon: Droplet,
      bgColor: 'bg-white',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-500',
      progressColor: '#f59e0b',
    },
  ];

  // Show skeleton loader while loading
  if (isLoading) {
    return (
      <div className='w-full'>
        <div className='w-full mx-auto space-y-6'>
          <div className='flex justify-evenly gap-6 w-full'>
            {[1, 2, 3].map((_, index) => (
              <Card
                key={index}
                className='shadow-2xl transition-all w-80 h-85 cursor-pointer border-0 rounded-tl-3xl rounded-br-3xl rounded-bl-none rounded-tr-none bg-white'
              >
                <CardContent className='p-6'>
                  <div className='flex flex-col items-center text-center space-y-4 -mt-5'>
                   
                    <div className='w-16 h-16 rounded-full bg-gray-200 animate-pulse'></div>
                        
                    <div className='w-32 h-6 bg-gray-200 rounded animate-pulse'></div>
              
                    <div className='w-16 h-8 bg-gray-200 rounded animate-pulse'></div>
                    
                    <div className='relative w-30 h-30'>
                      <div className='w-full h-full rounded-full bg-gray-200 animate-pulse'></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=' w-full'>
      <div className='w-full mx-auto space-y-6'>
        {/* KPI Cards */}
        <div className='flex justify-evenly gap-6 w-full'>
          {kpiData.map((kpi, index) => {
            const isHovered = hoveredCard === index;
            const IconComponent = kpi.icon;

            return (
              <Card
                key={index}
                className={`
                  shadow-2xl transition-all w-80 h-85  duration-300 cursor-pointer border-0
                  rounded-tl-3xl rounded-br-3xl rounded-bl-none rounded-tr-none
                  ${isHovered
                    ? 'bg-[#2D6974] text-white hover:scale-90'
                    : 'bg-white text-gray-900 hover:scale-100'
                  }
                `}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardContent className='p-6'>
                  <div className='flex flex-col items-center text-center space-y-4 -mt-5'>
                    {/* Icon with background circle */}
                    <div
                      className={`
                        w-16 h-16 rounded-full flex items-center justify-center
                        ${isHovered ? 'bg-white/20' : kpi.iconBg}
                      `}
                    >
                      <IconComponent
                        className={`
                          w-10 h-10
                          ${isHovered
                            ? 'text-white'
                            : kpi.iconColor
                          }
                        `}
                      />
                    </div>

                    {/* Title */}
                    <h3
                      className={`
                        text-xl font-medium leading-tight
                        ${isHovered
                          ? 'text-white/90'
                          : 'text-gray-600'
                        }
                      `}
                      style={{ ...FONTS.card_text }}
                    >
                      <div className='grid'>
                        <div>{kpi.title}</div>
                        <div>{kpi.value}</div>
                      </div>
                    </h3>

                    {/* Circular progress */}
                    <div className='flex flex-col items-center'>
                      <CircularProgress
                        percentage={kpi.value}
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
      </div>
    </div>
  );
};

// CircularProgress component (unchanged)
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
    <div className='relative w-40 h-40'>
      <svg className='w-full h-full' viewBox='0 0 100 100'>
        {/* Background circle - only showing 270 degrees */}
        <path
          d={describeArc(50, 50, radius, startAngle, startAngle + 270)}
          stroke={isHovered ? 'rgba(255,255,255,0.3)' : '#e5e7eb'}
          strokeWidth='8'
          fill='none'
          strokeLinecap='round'
        />
        {/* Progress circle - only showing 270 degrees */}
        <path
          d={describeArc(50, 50, radius, startAngle, startAngle + 270)}
          stroke={isHovered ? 'white' : progressColor}
          strokeWidth='8'
          fill='none'
          strokeDasharray={visibleCircumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap='round'
          className='transition-all duration-1000 ease-out'
        />
      </svg>
      {/* Center percentage text */}
      <div className='absolute inset-0 flex items-center justify-center'>
        <span
          className={`text-lg font-bold ${isHovered ? 'text-white' : 'text-gray-800'
            } ${isLoading ? 'animate-pulse' : ''}`}
          style={{ ...FONTS.percentage_text }}
        >
          {`${percentage}`}
        </span>
      </div>
    </div>
  );
};

// Helper function to describe an arc for the SVG path
function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(' ');
}

// Helper function to convert polar coordinates to Cartesian
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

export default StatsCard;