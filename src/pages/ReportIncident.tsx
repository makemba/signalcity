import IncidentForm from "@/components/IncidentForm";

export default function ReportIncident() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Signaler un incident
          </h1>
          <p className="text-gray-600">
            Utilisez ce formulaire pour signaler un problème dans votre quartier
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <IncidentForm />
        </div>
      </div>
    </div>
  );
}