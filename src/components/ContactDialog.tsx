import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, Phone } from "lucide-react";

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
}

const ContactDialog = ({ open, onClose }: ContactDialogProps) => (
  <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
    <DialogContent className="glass-surface border-border sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-primary text-lg">Contact Us</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4 py-2">
        <a
          href="mailto:codewarriorabhi@gmail.com"
          className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted transition-colors"
        >
          <Mail className="w-5 h-5 text-primary" />
          <span className="text-sm text-foreground">codewarriorabhi@gmail.com</span>
        </a>
        <a
          href="tel:9690960990"
          className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted transition-colors"
        >
          <Phone className="w-5 h-5 text-primary" />
          <span className="text-sm text-foreground">9690960990</span>
        </a>
      </div>
    </DialogContent>
  </Dialog>
);

export default ContactDialog;
