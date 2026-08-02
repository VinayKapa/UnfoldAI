import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExplainableAiWorkspace } from './ExplainableAiWorkspace';

interface ExplainabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendationId?: string;
  recommendationTitle?: string;
}

export const ExplainabilityModal: React.FC<ExplainabilityModalProps> = ({
  isOpen,
  onClose,
  recommendationId = 'rec_mlops',
  recommendationTitle
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-5xl my-8"
        >
          <ExplainableAiWorkspace
            initialRecommendationId={recommendationId}
            recommendationTitle={recommendationTitle}
            onCloseModal={onClose}
            isModal={true}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
