import { Camera, MapPin, Send } from "lucide-react";
import { useState } from "react";

const categories = [
  "Nid de poule",
  "Éclairage défectueux",
  "Dépôt sauvage",
  "Mobilier urbain endommagé",
  "Autre",
];

export default function IncidentForm() {
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Soumission du formulaire:", { location, category, description, image });
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
        }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Coordonnées GPS"
            className="flex-1 p-2 border rounded-md"
          />
          <button
            type="button"
            onClick={handleLocation}
            className="bg-primary text-white p-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            <MapPin className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Sélectionnez une catégorie</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-md h-32"
          placeholder="Décrivez le problème..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-200 transition-colors">
            <Camera className="h-5 w-5" />
            <span>Ajouter une photo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </label>
          {image && <span className="text-sm text-gray-600">{image.name}</span>}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-secondary text-white py-3 rounded-md hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
      >
        <Send className="h-5 w-5" />
        Envoyer le signalement
      </button>
    </form>
  );
}