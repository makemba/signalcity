
import { Card } from "@/components/ui/card";
import IncidentForm from "@/components/IncidentForm";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const IncidentFormSection = () => {
  const { t } = useTranslation();
  
  const handleSubmit = () => {
    toast.success(t('incidentForm.successTitle'), {
      description: t('incidentForm.successMessage'),
    });
  };

  return (
    <Card className="p-6" role="region" aria-labelledby="incident-form-title">
      <h3 id="incident-form-title" className="text-xl font-semibold mb-4" tabIndex={0}>
        {t('incidentForm.title')}
      </h3>
      <IncidentForm onSubmit={handleSubmit} />
    </Card>
  );
};
