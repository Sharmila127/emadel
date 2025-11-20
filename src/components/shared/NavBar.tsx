import  { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Profileicon from "../../assets/profileicon.png";
import icon from "../../assets/eflowdot-high-resolution-logo-transparent_.png";
import notification from "../../assets/notification.png";


export default function Navbar() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [shownavoption, setShownavoption] = useState(false);
  const [selectedOption, setSelectedOption] = useState("All Notifications");

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node) &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
        setShowNotificationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleViewNotification = () => {
    setShowNotificationDropdown(false);
    navigate("/notifications");
  };
  const handleViewProfile = () => {
    setShowProfileDropdown(!showProfileDropdown);
    navigate("/profile");
  };
  const handleView = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  return (
    <nav
      ref={profileRef}
      className="flex h-16 items-center justify-between px-4 md:px-6 bg-[#E0ECDE] relative"
    >
      {/* Left section: Logo + Search */}
      <div className="flex items-center gap-32">
        <img src={icon} alt="logo" className="h-650 w-40 ml-4" />

        {/* Search */}
        <div className="relative flex-1 mx-0 w-96 flex items-center">
          <Search className="absolute left-3 top-7 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search or type"
            className="w-full pl-9 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white"
          />
        </div>
      </div>

      {/* Right section: Notification and Profile */}
      <div className="flex items-center gap-6 relative">
        {/* Notification */}
        <div className="relative" ref={notificationRef}>
          <img
            src={notification}
            alt="notifications"
            className="h-[24px] w-[20px] cursor-pointer"
            onClick={() => {
              setShowNotificationDropdown(!showNotificationDropdown);
              setShowProfileDropdown(false);
              setShownavoption(false);
            }}
          />
          {showNotificationDropdown && (
            <div className="absolute right-0 mt-2 w-[400px] bg-white rounded-md shadow-lg z-20 p-4">
              <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-xl text-[#242731]">
                    All Notifications
                  </h3>
                  <button
                    className="text-sm text-gray-500 hover:text-[#999999] transition-colors"
                    type="button"
                  >
                    Mark as all read
                  </button>
                </div>

                {/* Custom Select Container */}

                <div className="w-full rounded-md border border-[#999999] p-1 relative text-[#999999]">
                  {/* Clickable header */}
                  <div
                    className="h-10 flex items-center px-3 cursor-pointer select-none bg-white"
                    onClick={() => setShownavoption(!shownavoption)}
                  >
                    <span className="flex-1">{selectedOption}</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${shownavoption ? "rotate-180" : ""
                        }`}
                      stroke="#999999"
                    />
                  </div>

                  {/* Dropdown options */}
                  {shownavoption && (
                    <div className="absolute top-full left-0 right-0 bg-white z-20 rounded-md shadow-lg mt-1 p-2">
                      {["All Notifications", "New", "Unread", "Other"].map(
                        (option) => {
                          const isSelected = option === selectedOption;
                          return (
                            <div
                              key={option}
                              onClick={() => {
                                setSelectedOption(option);
                                setShownavoption(false);
                              }}
                              className={`border p-2 mb-3 rounded-tl-2xl  rounded-br-2xl rounded-bl-none rounded-tr-none cursor-pointer
              ${isSelected
                                  ? "bg-[#68B39F] text-white border-[#68B39F]"
                                  : "bg-white text-[#68B39F] hover:bg-[#5a9e8b] hover:text-white"
                                }`}
                            >
                              {option}
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>

                {/* Notifications list */}
                <div className="space-y-4 max-h-[360px] overflow-y-auto no-scrollbar">
                  {[
                    {
                      name: "Chendran",
                      message: "It is a long established fact that...",
                      time: "2 minutes ago",
                      image: "",
                    },
                    {
                      name: "Maria Garcia",
                      message: "New updates available.",
                      time: "3 hours ago",
                      image: "",
                    },
                    {
                      name: "Alex Johnson",
                      message: "Please verify your account.",
                      time: "1 day ago",
                      image: "https://randomuser.me/api/portraits/men/32.jpg",
                    },
                    {
                      name: "Store Verification Done",
                      message: "We have successfully received your request.",
                      time: "1 Month Ago",
                      image: "",
                    },
                    {
                      name: "Check Your Mail",
                      message: "All done! Now check your inbox...",
                      time: "4 Months Ago",
                      image: "",
                    },
                  ].map((item, i) => (
                    <div key={i} className="  rounded-md p-3 shadow-lg">
                      <div className="flex justify-between items-center mb-1 ">
                        <div className="flex items-center gap-3 flex-1 ">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt="profile"
                              className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full border border-gray-300 bg-teal-500 flex items-center justify-center text-white font-bold text-lg">
                              {item.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <h4 className="font-bold text-lg text-gray-900">
                            {item.name}
                          </h4>
                        </div>
                        <p className="text-sm text-[#999999] whitespace-nowrap">
                          {item.time}
                        </p>
                      </div>
                      <p className="text-sm text-[#999999]  mb-3 line-clamp-2">
                        {item.message}
                      </p>
                      <div className="flex justify-end gap-3">
                        <button
                          className="bg-[#68B39F] text-white px-4 py-2 rounded-tl-2xl rounded-br-2xl rounded-bl-none rounded-tr-none hover:bg-teal-700 transition-colors"
                          type="button"
                        >
                          Unread
                        </button>
                        <button
                          className="border border-[#68B39F] text-[#68B39F] px-4 py-2 rounded-tl-2xl rounded-br-2xl rounded-bl-none rounded-tr-none hover:bg-teal-50 transition-colors"
                          type="button"
                        >
                          New
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* View all link */}
                <p
                  onClick={handleViewNotification}
                  className="cursor-pointer mt-4 text-center bg-[#68B39F] text-white text-sm font-medium hover:underline p-3 rounded-xl"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleViewNotification()
                  }
                >
                  View All
                </p>
              </div>
            </div>
          )}
        </div>

        {/* profile */}
        <div
          className="h-[48px] w-[48px] rounded-full overflow-hidden cursor-pointer block"
          onClick={handleView}
        >
          <img
            src={Profileicon}
            alt="profile"
            className="h-full w-full object-cover"
             onClick={handleViewProfile}
          />
        </div>

       
      </div>
    </nav>
  );
}
