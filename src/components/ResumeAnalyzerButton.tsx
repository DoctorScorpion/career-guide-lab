
import { Button } from "@/components/ui/button";
import { FileSearch } from "lucide-react";

interface ResumeAnalyzerButtonProps {
  onClick: (e: React.MouseEvent) => void;
  text: string;
}

export const ResumeAnalyzerButton = ({ onClick, text }: ResumeAnalyzerButtonProps) => {
  return (
    <Button 
      onClick={onClick}
      className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg transition-all flex items-center gap-2 group"
    >
      <FileSearch className="w-5 h-5 group-hover:animate-bounce" />
      <span className="font-medium">{text}</span>
    </Button>
  );
};
