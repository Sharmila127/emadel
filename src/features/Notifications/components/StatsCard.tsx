import { Card, CardContent } from '@/components/ui/card';
import { Zap, Component, Droplet } from 'lucide-react';
import { FONTS } from '@/constants/ui constants';
import { useEffect, useState } from 'react';


const StatsCard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);


  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Filter institutes based on selected filters

  const [kpiData,] = useState([
    {
      title: 'Total Notifications',
      value: '45',
      percentage: 45,
      icon: Zap,
      bgColor: 'bg-teal-600',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      progressColor: '#14b8a6',
    },
    {
      title: 'Seen Notifications',
      value: '9',
      percentage: 9,
      icon: Component,
      bgColor: 'bg-white',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-500',
      progressColor: '#8b5cf6',
    },
    {
      title: 'Unseen Notifications',
      value: '25',
      percentage: 25,
      icon: Droplet,
      bgColor: 'bg-white',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-500',
      progressColor: '#f59e0b',
    },
  ]);


  return (
    <div className='p-6 w-full'>
      <div className='w-full mx-auto space-y-6'>
        {/* Header */}

        {/* KPI Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          {kpiData.map((kpi, index) => {
            // const isHovered = hoveredCard === index;
            const IconComponent = kpi.icon;

            return (
              <Card
                key={index}
                className={`
    shadow-lg transition-all duration-300 cursor-pointer border-0
    rounded-tl-3xl rounded-br-3xl rounded-bl-none rounded-tr-none
    ${hoveredCard === index
                    ? 'bg-[#2D6974] text-white hover:scale-90'
                    : 'bg-white text-gray-900 hover:scale-100'
                  }
  `}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardContent className='p-6'>
                  <div className='flex flex-col items-center text-center space-y-4'>
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
            ${hoveredCard === index
                            ? 'text-white'
                            : kpi.iconColor
                          }
          `}
                      />
                    </div>

                    {/* Title */}
                    <h3
                      className={`
          text-sm font-medium leading-tight
          ${hoveredCard === index
                          ? 'text-white/90'
                          : 'text-gray-600'
                        }
        `}
                      style={{ ...FONTS.card_text }}
                    >
                      {kpi.title}
                    </h3>

                    {/* Circular progress */}
                    <div className='flex flex-col items-center'>
                      <CircularProgress
                        percentage={kpi.percentage}
                        progressColor={kpi.progressColor}
                        isLoading={isLoading}
                        isHovered={hoveredCard === index}
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
    <div className='relative w-24 h-24'>
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
