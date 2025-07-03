import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { useEffect, useState } from "react";

// TimeDisplay component for IST
const TimeDisplay = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      };
      setTime(now.toLocaleTimeString("en-IN", options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="bg-base-200 text-primary font-mono rounded px-3 py-1 text-sm shadow-sm border border-base-300">
      {time} IST
    </span>
  );
};

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="border-b border-base-300  w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chatables</h1>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <TimeDisplay />
            <div className="flex items-center gap-2">
              <Link
                to={"/settings"}
                className={`
                btn btn-sm gap-2 transition-colors
                
                `}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Link>

              {authUser && (
                <>
                  <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                    <User className="size-5" />
                    <span className="hidden sm:inline">Profile</span>
                  </Link>

                  <button className="flex gap-2 items-center" onClick={logout}>
                    <LogOut className="size-5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
