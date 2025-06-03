import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { type EmptyCanvasProps } from './types';

const EmptyCanvas = (_props: EmptyCanvasProps) => {
  return (
    <motion.div
      className="workflow-canvas rounded-xl border border-dashed border-border h-[400px] flex items-center justify-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center text-muted-foreground">
        <Plus className="w-12 h-12 mx-auto mb-4 opacity-20" />
        <p>Add AI agents to build your workflow</p>
        <p className="text-sm mt-2">Drag and arrange agents to create a processing pipeline</p>
      </div>
    </motion.div>
  );
};

export default EmptyCanvas;
