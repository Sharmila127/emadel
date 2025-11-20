import { useState } from "react";
import {
  LayoutDashboard,
  Building,
  Banknote,
  BadgePercent,
  Bell,
  HeartHandshake,
  ShieldQuestionMark,
  LogOut,
  ChevronDown,
  ChevronUp,
  BadgeInfo,
  BadgeQuestionMark,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../Auth/AuthContext";

const Sidebar = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [showsigninpage, setshowsigninpage] = useState(false);



  const sidebarItems = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "Institute", path: "/institute", icon: Building },
    { label: "Payments", path: "/payments", icon: Banknote },
    { label: "Subscriptions", path: "/subscriptions", icon: BadgePercent },
    { label: "Notifications", path: "/notifications", icon: Bell },
    {
      label: "Help Center",
      icon: HeartHandshake,
      id: "help",
      children: [
        {
          label: "HelpcenterFaq",
          path: "/helpcenter/faq",
          icon: BadgeQuestionMark,
        },
        {
          label: "Tickets",
          path: "/helpcenter/tickets",
          icon: BadgeQuestionMark,
        },
      ],
    },
    {
      label: "FAQ Management",
      icon: ShieldQuestionMark,
      id: "faq",
      children: [
        { label: "Categories", path: "/faq/categories", icon: BadgeInfo },
        { label: "FAQ", path: "/faq/faqs", icon: BadgeInfo },
      ],
    },
  ];

  const handleLogout = () => {
    toast.success("Logout successfully");
    setshowsigninpage(!showsigninpage);
    // ClearLocalStorage()
    logout()
    navigate("/sign-in");
    window.location.reload();
  };


  return (
    <div className=" h-screen bg-[#E0ECDE] p-4">
      <div className="flex h-[90%] flex-col justify-between">
        {/* Top Menu */}
        <div>
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const hasChildren = !!item.children;

              // Check if any child route is currently active
              const isChildActive = hasChildren
                ? item.children.some((child) => {

                  return location.pathname === child.path ||
                    location.pathname.startsWith(child.path + '/');
                })
                : false;

              // Determine if dropdown should be expanded
              const isExpanded = expanded === item.id || isChildActive;

              return hasChildren ? (
                <div key={item.label}>
                  {/* Parent dropdown item - only show as active if no child is active */}
                  <div
                    className={`flex items-center px-4 py-2 rounded-tl-xl rounded-br-xl cursor-pointer ${!isChildActive
                        ? "text-[#5F6165] hover:bg-[#2D6974] hover:text-white"
                        : "text-[#5F6165] hover:bg-[#2D6974] hover:text-white"
                      }`}
                    onClick={() => {
                      setExpanded((prev) => (prev === item.id ? null : item.id));
                    }}
                  >
                    <item.icon className="w-6 h-6 mr-3" />
                    <span className="text-sm font-medium">{item.label}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-2" />
                    )}
                  </div>

                  {/* Child items */}
                  {isExpanded && (
                    <ul className="ml-8 mt-1 space-y-1">
                      {item.children.map((subItem) => (
                        <NavLink
                          key={subItem.label}
                          to={subItem.path}
                          className={() => {
                            // Custom active check for better matching
                            const isCurrentlyActive = location.pathname === subItem.path ||
                              location.pathname.startsWith(subItem.path + '/');

                            return `flex items-center text-sm px-3 py-1 rounded-tl-xl rounded-br-xl ${isCurrentlyActive
                                ? "bg-[#2D6974] text-white"
                                : "text-[#5F6165] hover:bg-[#2D6974] hover:text-white"
                              }`;
                          }}
                        >
                          <subItem.icon className="w-4 h-4 mr-2" />
                          {subItem.label}
                        </NavLink>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  key={item.label}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-tl-xl rounded-br-xl cursor-pointer ${isActive
                      ? "bg-[#2D6974] text-white"
                      : "text-[#5F6165] hover:bg-[#2D6974] hover:text-white"
                    }`
                  }
                >
                  <item.icon className="w-6 h-6 mr-3" />
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </ul>
        </div>

        {/* Bottom Items */}
        <div>
          <ul className="space-y-2">
            <div
              className="flex items-center px-4 py-2 rounded-tl-xl rounded-br-xl text-white bg-[#2D6974] cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="w-6 h-6 mr-3" />
              <p className="text-sm font-medium">Logout</p>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;