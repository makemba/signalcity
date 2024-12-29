import { MapPin } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-primary py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="h-6 w-6 text-white" />
          <h1 className="text-xl font-bold text-white">SignalCity</h1>
        </div>
        <button className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-md transition-colors">
          Signaler un incident
        </button>
      </div>
    </header>
  );
}