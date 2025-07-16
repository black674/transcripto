import React from "react";
import LoginModal from "@/components/modals/LoginModal";
import SignupModal from "@/components/modals/SignupModal";
import { Button } from "@/components/ui/button";
import { Menu, Clock, Info, Youtube, FileText, User } from "lucide-react";
import MobileMenu from "@/components/sidebar/MobileMenu";
import { UseAuth } from "@/lib/auth/AuthContext";
import { useModal } from "@/lib/modalContext/ModalContext";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const url = window.location.pathname;
  const navigate = useNavigate();

  const { isAuthenticated, isLoading } = UseAuth();
  const { openSignupModal, closeSignupModal, openLoginModal, closeLoginModal } =
    useModal();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLoginClick = () => {
    openLoginModal();
    closeSignupModal();
  };

  const handleSignupClick = () => {
    openSignupModal();
    closeLoginModal();
  };

  const NavLink = ({ icon, label, href }) => (
    <Link
      to={href}
      className="flex items-center gap-2 px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300"
    >
      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-sm">{label}</span>
    </Link>
  );

  const NavLinkSkeleton = () => (
    <div className="flex items-center gap-2 px-3 py-1.5">
      <Skeleton className="h-5 w-5 rounded-md" />
      <Skeleton className="h-4 w-20" />
    </div>
  );

  return (
    <>
      <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
      <nav className="bg-white shadow-sm py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMobileMenu}
              className={`lg:hidden p-2 rounded-md hover:bg-gray-100 ${
                !isAuthenticated && "hidden"
              }`}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
            <div
              className={`flex items-center cursor-pointer ${
                (isAuthenticated || isLoading) && "hidden"
              }`}
              onClick={() => navigate("/")}
            >
              <img
                src="/logo_icons/favicon-96x96.png"
                alt="Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="ml-1 font-semibold text-lg hidden lg:block">
                Transcripto
              </span>
            </div>

            {/* Navigation Links - Hidden on mobile, visible on desktop */}
            <div className="hidden lg:flex items-center space-x-1 ml-6">
              {isLoading ? (
                <>
                  <NavLinkSkeleton />
                  <NavLinkSkeleton />
                  <NavLinkSkeleton />
                  <NavLinkSkeleton />
                </>
              ) : (
                isAuthenticated &&
                url === "/" && (
                  <>
                    <NavLink
                      icon={<FileText size={18} />}
                      label="Extract Transcript"
                      href="/extract-transcript"
                    />
                    <NavLink
                      icon={<Clock size={18} />}
                      label="History"
                      href="/history"
                    />
                    <NavLink
                      icon={<Info size={18} />}
                      label="Channel Info"
                      href="/channel"
                    />
                    <NavLink
                      icon={<Youtube size={18} />}
                      label="Extract from Playlist"
                      href="/playlist"
                    />
                  </>
                )
              )}
            </div>
          </div>

          {/* Right side - Profile/Login/Signup */}
          {isLoading ? (
            <div className="flex items-center space-x-4">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-9 w-20" />
            </div>
          ) : isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <NavLink
                icon={<User size={18} />}
                label="Profile"
                href="/profile"
              />
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleLoginClick}
                className="border-[#1E88E5] text-[#1E88E5] hover:bg-[#1E88E5] hover:text-white"
              >
                Login
              </Button>
              <Button
                onClick={handleSignupClick}
                className="bg-[#1E88E5] hover:bg-[#1976D2] text-white"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </nav>

      <LoginModal />
      <SignupModal />
    </>
  );
}
