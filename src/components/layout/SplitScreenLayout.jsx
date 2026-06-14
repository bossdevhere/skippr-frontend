import React from 'react';
import { motion } from 'framer-motion';

const SplitScreenLayout = ({ leftContent, children }) => {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-background">
      {/* Left Pane - Brand Message */}
      <div className="relative hidden w-full flex-col bg-[#050505] p-12 text-white lg:flex lg:w-1/2 xl:w-2/5 overflow-hidden">
        {/* Background Decor */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-emerald-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-20 flex items-center text-lg font-black tracking-tighter uppercase">
          <div className="mr-3 h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-black font-black">S</span>
          </div>
          Skippr
        </div>

        <div className="relative z-20 mt-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {leftContent}
          </motion.div>
        </div>
      </div>

      {/* Right Pane - Content/Form */}
      <main className="flex w-full flex-1 flex-col items-center justify-center p-6 lg:p-12 bg-background relative overflow-hidden">
        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-8 left-8 flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-black shadow-lg">S</div>
          <span className="font-black tracking-tighter uppercase text-sm">Skippr</span>
        </div>

        <div className="w-full max-w-[400px] relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default SplitScreenLayout;
