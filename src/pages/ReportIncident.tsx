
import React, { useEffect } from "react";
import IncidentForm from "@/components/IncidentForm";
import { DashboardShell } from "@/components/DashboardShell";
import SafetyTips from "@/components/SafetyTips";
import { RealtimeIncidentUpdates } from "@/components/RealtimeIncidentUpdates";

export default function ReportIncident() {
  // Mise à jour du titre de la page
  useEffect(() => {
    document.title = "Signaler un incident | Incident Signal";
  }, []);

  return (
    <DashboardShell>
      <div className="container px-4 py-6 md:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Signaler un incident</h1>
            <p className="text-gray-500 mt-1">
              Décrivez la situation et fournissez autant de détails que possible
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <IncidentForm />
          </div>
          <div className="space-y-6">
            <RealtimeIncidentUpdates />
            <SafetyTips />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
