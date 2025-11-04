import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react"; // Removed LogOut, Settings as they are no longer used
import { useIsMobile } from "@/hooks/use-mobile";
import { useSupabase } from "@/components/SessionContextProvider";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "News", path: "/news" }, // Now links to the NewsIndex page
  { name: "Sponsors", path: "/sponsors" },
  { name: "Donate", path: "/donate" },
  { name: "Events", path: "/events" },
  { name: "Robots", path: "/robots" },
  { name: "Unitybots", path: "/unitybots" },
  { name: "About", path: "/about" },
];

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const { session, supabase } = useSupabase();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const getNavLinkClasses = (isActive: boolean) =>
    `text-white hover:text-white/90 transition-colors pb-1 border-b-2 border-transparent ${
      isActive ? "font-semibold text-white border-[#d92507]" : ""
    }`;

  const getMobileNavLinkClasses = (isActive: boolean) =>
    `text-lg font-medium hover:text-white/90 transition-colors px-2 py-1 rounded ${
      isActive ? "font-bold text-white bg-[#d92507]" : ""
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0d2f60] text-white shadow-lg h-16 flex items-center">
      <div className="w-full flex items-center justify-between px-4">
        {/* Team Name */}
        <Link to="/" className="flex items-center gap-3 text-white hover:text-white/90 transition-colors" aria-label="Tomball Robotics Home">
          <span className="text-2xl sm:text-3xl font-bold"> {/* Adjusted font size here */}
            Tomball Robotics
          </span>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="hidden md:flex flex-grow justify-end">
            <nav className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) => getNavLinkClasses(isActive)}
                  aria-label={`Navigate to ${link.name} page`}
                >
                  {link.name}
                </NavLink>
              ))}
              {session && ( // Only show Admin and Logout if session exists
                <>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) => getNavLinkClasses(isActive)}
                    aria-label="Go to Admin Panel"
                  >
                    Admin
                  </NavLink>
                  <NavLink
                    to="#" // Using '#' as a placeholder, onClick will handle navigation
                    onClick={handleLogout}
                    className={({ isActive }) => getNavLinkClasses(isActive)}
                    aria-label="Log out from Admin Panel"
                  >
                    Logout
                  </NavLink>
                </>
              )}
            </nav>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white" aria-label="Toggle navigation menu">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-[#0d2f60] text-white">
              <nav className="flex flex-col gap-4 pt-6">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) => getMobileNavLinkClasses(isActive)}
                    aria-label={`Navigate to ${link.name} page`}
                  >
                    {link.name}
                  </NavLink>
                ))}
                {session && ( // Only show Admin and Logout if session exists
                  <>
                    <NavLink
                      to="/admin"
                      className={({ isActive }) => getMobileNavLinkClasses(isActive)}
                      aria-label="Go to Admin Panel"
                    >
                      Admin
                    </NavLink>
                    <NavLink
                      to="#" // Using '#' as a placeholder, onClick will handle navigation
                      onClick={handleLogout}
                      className={({ isActive }) => getMobileNavLinkClasses(isActive)}
                      aria-label="Log out from Admin Panel"
                    >
                      Logout
                    </NavLink>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  );
};

export default Header;