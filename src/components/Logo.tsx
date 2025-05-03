
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  isFooter?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ isFooter = false, className, size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: {
      container: "p-1",
      icon: "h-4 w-4",
      text: "text-sm"
    },
    md: {
      container: "p-1",
      icon: "h-6 w-6",
      text: "text-lg"
    },
    lg: {
      container: "p-2",
      icon: "h-8 w-8",
      text: "text-2xl"
    }
  };

  const { container, icon, text } = sizeClasses[size];

  return (
    <Link 
      to="/" 
      className={cn(
        "flex items-center gap-2 transition-all duration-300 hover:opacity-90", 
        isFooter ? "text-white" : "",
        className
      )}
    >
      <div className={cn(
        "flex items-center justify-center rounded-lg shadow-md", 
        container,
        "bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 animate-gradient-x"
      )}>
        <Bell className={cn(icon, "text-white drop-shadow-sm")} />
      </div>
      <div>
        <span className={cn(
          "font-bold tracking-tight",
          text,
          isFooter 
            ? "text-white" 
            : "bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 bg-clip-text text-transparent"
        )}>
          Report Helper Hub
        </span>
        <span className={cn(
          "block text-xs",
          isFooter ? "text-blue-100" : "text-gray-500"
        )}>
          Solution de signalement
        </span>
      </div>
    </Link>
  );
};

export default Logo;
