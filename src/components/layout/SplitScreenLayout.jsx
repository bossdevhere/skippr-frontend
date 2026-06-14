import React from 'react';
import { motion } from 'framer-motion';

const SplitScreenLayout = ({ leftContent, children }) => {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left Pane - Brand Message */}
      <div className="relative hidden w-full flex-col bg-primary p-10 text-white lg:flex lg:w-1/2 xl:w-2/5">
        <div className="absolute inset-0 bg-emerald-600/10" /> {/* Subtle accent overlay */}
        <div className="relative z-20 flex items-center text-lg font-medium">
          <div className="mr-2 h-8 w-8 rounded-lg bg-white flex items-center justify-center">
            <span className="text-black font-bold">S</span>
          </div>
          Skippr
        </div>
        <div className="relative z-20 mt-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {leftContent}
          </motion.div>
        </div>
      </div>

      {/* Right Pane - Content/Form */}
      <main className="flex w-full flex-1 flex-col items-center justify-center p-6 lg:p-12 xl:p-24 bg-background">
        <div className="w-full max-w-[450px]">
          <div className="lg:hidden mb-8 flex items-center justify-center">
            <div className="mr-2 h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">S</div>
            <span className="text-xl font-bold tracking-tight">Skippr</span>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default SplitScreenLayout;
