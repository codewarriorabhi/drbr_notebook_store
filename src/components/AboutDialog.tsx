import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, Star, Shield } from "lucide-react";

interface AboutDialogProps {
  open: boolean;
  onClose: () => void;
}

const AboutDialog = ({ open, onClose }: AboutDialogProps) => (
  <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
    <DialogContent className="glass-surface border-border sm:max-w-lg max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-primary text-xl font-bold tracking-tight">
          About Dr. Br. Notebook Store
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-5 py-2">
        {/* Decorative accent bar */}
        <div className="h-1 w-16 rounded-full bg-primary/60" />

        <p className="text-sm text-foreground/90 leading-relaxed">
          Dr. Br. Notebook Store is dedicated to providing premium-quality notebooks and stationery
          products designed to support students, professionals, and institutions. Our mission is to
          deliver durable, affordable, and thoughtfully designed paper products that enhance everyday
          learning and productivity.
        </p>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: Star, label: "Premium Quality", desc: "High-grade paper & binding" },
            { icon: Shield, label: "Reliable Supply", desc: "Consistent & on-time delivery" },
            { icon: BookOpen, label: "For Everyone", desc: "School, office & institutions" },
          ].map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center gap-2 p-3 rounded-xl bg-muted/40 border border-border/50"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-semibold text-foreground">{label}</span>
              <span className="text-[11px] text-muted-foreground leading-tight">{desc}</span>
            </div>
          ))}
        </div>

        <p className="text-sm text-foreground/90 leading-relaxed">
          With a strong focus on quality manufacturing and customer satisfaction, we ensure that
          every notebook meets high standards of paper quality, binding strength, and usability.
          Whether for school, office, or bulk institutional supply, Dr. Br. Notebook Store stands
          for reliability, consistency, and value.
        </p>

        {/* Quote highlight */}
        <blockquote className="border-l-2 border-primary/50 pl-4 py-2 italic text-sm text-primary/80">
          "We believe that great ideas deserve great pages."
        </blockquote>
      </div>
    </DialogContent>
  </Dialog>
);

export default AboutDialog;
