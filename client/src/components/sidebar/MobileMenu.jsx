import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, Info, Youtube, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileMenuItem = ({ icon, label, href, onClick }) => {
  return (
    <Link
      to={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300"
    >
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const MobileMenu = ({ className, isOpen, toggleMenu }) => {
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const closeMenu = () => {
    toggleMenu();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMenu}
        />
      )}

      <div
        ref={menuRef}
        className={cn(
          "fixed top-0 left-0 bottom-0 w-64 bg-background border-r border-border shadow-lg z-50 lg:hidden flex flex-col transition-transform duration-300 ease-in-out transform",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div
          className="flex items-center py-4 px-4 border-b border-border"
          onClick={() => navigate("/")}
        >
          <img
            src="/logo_icons/favicon-96x96.png"
            alt="Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="ml-2 font-semibold text-lg">Transcripto</span>
        </div>

        <div className="flex-1 overflow-y-auto py-3">
          <MobileMenuItem
            icon={<FileText size={20} />}
            label="Extract Transcript"
            href="/extract-transcript"
            onClick={closeMenu}
          />
          <MobileMenuItem
            icon={<Clock size={20} />}
            label="History"
            href="/history"
            onClick={closeMenu}
          />
          <MobileMenuItem
            icon={<Info size={20} />}
            label="Channel Info"
            href="/channel"
            onClick={closeMenu}
          />
          <MobileMenuItem
            icon={<Youtube size={20} />}
            label="Extract from Playlist"
            href="/playlist"
            onClick={closeMenu}
          />
        </div>

        <div className="mt-auto py-3 px-4 border-t border-border">
          <MobileMenuItem
            icon={<User size={20} />}
            label="Profile"
            href="/profile"
            onClick={closeMenu}
          />
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
