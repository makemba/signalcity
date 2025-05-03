
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  isFooter?: boolean;
  className?: string;
}

const Logo = ({ isFooter = false, className }: LogoProps) => {
  return (
    <Link 
      to="/" 
      className={cn(
        "flex items-center gap-2 transition-opacity hover:opacity-90", 
        isFooter ? "text-white" : "",
        className
      )}
    >
      <div className="flex items-center justify-center p-1 bg-gradient-to-r from-primary to-blue-700 rounded-lg shadow-sm">
        <Bell className="h-6 w-6 text-white" />
      </div>
      <span className={cn(
        "text-lg font-bold tracking-tight",
        isFooter 
          ? "text-white" 
          : "bg-gradient-to-r from-primary via-blue-700 to-primary bg-clip-text text-transparent"
      )}>
        Report Helper Hub
      </span>
    </Link>
  );
};

export default Logo;
