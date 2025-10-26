"use client";

import React from "react";
import { motion } from "framer-motion";

export function LoaderOne() {
  const variants = {
    initial: {
      scale: 0,
      opacity: 0,
    },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        variants={variants}
        initial="initial"
        animate="animate"
        className="flex flex-col items-center gap-4"
      >
        <div className="flex gap-2">
          {[...Array(3)].map((_, index) => (
            <motion.div
              key={index}
              className="h-4 w-4 rounded-full bg-white"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        <p className="text-lg font-medium text-white">Loading assembly guide...</p>
      </motion.div>
    </div>
  );
}

