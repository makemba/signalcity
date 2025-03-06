
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";

interface LogoProps {
  isFooter?: boolean;
}

const Logo = ({ isFooter = false }: LogoProps) => {
  return (
    <Link 
      to="/" 
      className={`flex items-center space-x-2 ${isFooter ? "text-white" : "text-primary"} hover:opacity-80 transition-opacity`}
    >
      <Bell className="h-8 w-8" />
      <span className={`text-xl font-bold ${isFooter ? "text-white" : "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"}`}>
        Report Helper Hub
      </span>
    </Link>
  );
};

export default Logo;
