
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users, Building2 } from "lucide-react";

interface UserTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserTypeDialog = ({ isOpen, onClose }: UserTypeDialogProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleEmployerClick = () => {
    navigate('/services?type=employer');
    onClose();
  };

  const handleEmployeeClick = () => {
    navigate('/jobs');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("dialog.userType.title", "איזה סוג משתמש אתה?")}</DialogTitle>
          <DialogDescription>
            {t("dialog.userType.description", "בחר את האפשרות המתאימה עבורך")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-6 hover:bg-accent/10"
            onClick={handleEmployerClick}
          >
            <Building2 className="w-8 h-8" />
            <span className="text-lg font-medium">
              {t("dialog.userType.employer", "מעסיק")}
            </span>
            <span className="text-sm text-muted-foreground text-center">
              {t("dialog.userType.employerDesc", "מחפש עובדים לחברה")}
            </span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-6 hover:bg-accent/10"
            onClick={handleEmployeeClick}
          >
            <Users className="w-8 h-8" />
            <span className="text-lg font-medium">
              {t("dialog.userType.employee", "מחפש עבודה")}
            </span>
            <span className="text-sm text-muted-foreground text-center">
              {t("dialog.userType.employeeDesc", "מחפש משרה חדשה")}
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
