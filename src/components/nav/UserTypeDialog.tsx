
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserTypeDialog = ({ open, onOpenChange }: UserTypeDialogProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleEmployerClick = () => {
    navigate('/services?type=employer');
    onOpenChange(false);
  };

  const handleEmployeeClick = () => {
    navigate('/services?type=employee');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              {t("dialog.userType.employerDesc", "מחפש שירותי גיוס וייעוץ")}
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
              {t("dialog.userType.employeeDesc", "מחפש שירותי קריירה וייעוץ")}
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
