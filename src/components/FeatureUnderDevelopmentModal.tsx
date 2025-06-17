
import { FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { AlertTriangle } from 'lucide-react';
import { MotionDiv } from '@/lib/motion-wrapper';

interface FeatureUnderDevelopmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureName: string;
  actionDescription?: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const iconVariants = {
  hidden: { scale: 0.5, opacity: 0, rotate: -45 },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: { delay: 0.1, duration: 0.5, type: 'spring', stiffness: 150 },
  },
};

export const FeatureUnderDevelopmentModal: FC<FeatureUnderDevelopmentModalProps> = ({
  open,
  onOpenChange,
  featureName,
  actionDescription,
}) => {
  const defaultDescription = `The "${featureName}" feature is currently under development and will be available soon. We appreciate your patience!`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card-alt border-border-alt shadow-2xl rounded-xl p-6 text-center">
        <DialogHeader className="items-center">
          <MotionDiv
            variants={iconVariants}
            initial="hidden"
            animate={open ? "visible" : "hidden"}
            className="p-3 bg-primary/10 rounded-full mb-4 border border-primary/20"
          >
            <AlertTriangle className="h-10 w-10 text-primary" />
          </MotionDiv>
          <MotionDiv
            variants={itemVariants}
            initial="hidden"
            animate={open ? "visible" : "hidden"}
            transition={{ delay: 0.2 }}
          >
            <DialogTitle className="text-h3 text-foreground mb-2">
              {featureName} - Coming Soon!
            </DialogTitle>
          </MotionDiv>
          <MotionDiv
            variants={itemVariants}
            initial="hidden"
            animate={open ? "visible" : "hidden"}
            transition={{ delay: 0.3 }}
          >
            <DialogDescription className="text-body-std text-muted-foreground">
              {actionDescription || defaultDescription}
            </DialogDescription>
          </MotionDiv>
        </DialogHeader>
        <DialogFooter className="sm:justify-center mt-6">
          <MotionDiv
            variants={itemVariants}
            initial="hidden"
            animate={open ? "visible" : "hidden"}
            transition={{ delay: 0.4 }}
            className="w-full sm:w-auto"
          >
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              Got it, Thanks!
            </Button>
          </MotionDiv>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
