"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

const slideInFromLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

interface MotionProps {
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof motionVariants;
  delay?: number;
  duration?: number;
}

const motionVariants = {
  fadeInUp,
  fadeIn,
  scaleIn,
  slideInFromLeft,
};

export function Motion({ 
  children, 
  className, 
  variant = "fadeInUp", 
  delay = 0, 
  duration = 0.5 
}: MotionProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={motionVariants[variant]}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ 
        duration, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] // Smooth easing
      }}
    >
      {children}
    </motion.div>
  );
}

export function MotionCard({ children, className, delay = 0 }: MotionProps) {
  return (
    <Motion 
      variant="scaleIn" 
      delay={delay} 
      className={className}
    >
      {children}
    </Motion>
  );
}

export function MotionButton({ 
  children, 
  className, 
  onClick, 
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <motion.button
      className={cn(className)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      type={props.type}
      disabled={props.disabled}
      form={props.form}
      name={props.name}
      value={props.value}
    >
      {children}
    </motion.button>
  );
}

export function Stagger({ 
  children, 
  className, 
  staggerDelay = 0.1 
}: { 
  children: React.ReactNode; 
  className?: string; 
  staggerDelay?: number; 
}) {
  return (
    <motion.div
      className={cn(className)}
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export { AnimatePresence };
export type { Variants };