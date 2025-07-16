import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, Info, Youtube, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";

const SidebarItem = ({ icon, label, href, collapsed }) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300",
        collapsed ? "justify-center" : "justify-start"
      )}
    >
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
        {icon}
      </div>
      {!collapsed && (
        <span className="transition-opacity duration-300 opacity-100 whitespace-nowrap">
          {label}
        </span>
      )}
    </Link>
  );
};

const Sidebar = ({ className }) => {
  const [collapsed, setCollapsed] = useState(true);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setCollapsed(false);
  };

  const handleMouseLeave = () => {
    setCollapsed(true);
  };

  return (
    <div
      ref={sidebarRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "fixed left-0 top-0 bottom-0 bg-background border-r border-border shadow-sm z-50 flex flex-col h-screen transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-56",
        "hidden lg:flex",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center py-2 px-3 transition-all duration-300 cursor-pointer",
          collapsed ? "justify-center" : "justify-start px-4"
        )}
        onClick={() => navigate("/")}
      >
        <img
          src="/logo_icons/favicon-96x96.png"
          alt="Logo"
          className="w-12 h-12 object-contain"
        />
        {!collapsed && (
          <span className="ml-2 font-semibold text-lg transition-opacity duration-300 opacity-100 whitespace-nowrap">
            Transcripto
          </span>
        )}
      </div>

      <div className="h-px bg-border mx-3" />

      <div className="flex-1 overflow-y-auto py-3 px-1">
        <SidebarItem
          icon={<FileText size={20} />}
          label="Extract Transcript"
          href="/extract-transcript"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<Clock size={20} />}
          label="History"
          href="/history"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<Info size={20} />}
          label="Channel Info"
          href="/channel"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<Youtube size={20} />}
          label="Extract from Playlist"
          href="/playlist"
          collapsed={collapsed}
        />
      </div>

      <div className="mt-auto py-3 px-1">
        <SidebarItem
          icon={<User size={20} />}
          label="Profile"
          href="/profile"
          collapsed={collapsed}
        />
      </div>
    </div>
  );
};

export default Sidebar;
