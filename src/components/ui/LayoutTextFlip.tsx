"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "../../utils/cn";

export function LayoutTextFlip({
  words,
  text,
  duration = 3000,
  className,
  containerClassName,
}: {
  words: string[];
  text: string;
  duration?: number;
  className?: string;
  containerClassName?: string | string[];
}) {
  const [index, setIndex] = useState(0);

  const currentContainerClass = Array.isArray(containerClassName)
    ? containerClassName[index % containerClassName.length]
    : containerClassName || "bg-white";

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-50, 50], [5, -5]);
  const rotateY = useTransform(x, [-50, 50], [-5, 5]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * words.length);
        } while (newIndex === prevIndex);
        return newIndex;
      });
    }, duration);

    return () => clearInterval(interval);
  }, [words, duration]);

  return (
    <div
      className={cn("flex flex-wrap items-center justify-center", className)}
    >
      <div className="flex items-center justify-center gap-2 md:gap-3">
        <span
          className={cn("font-bold", className)}
          style={{ color: 'white' }}
        >
          {text}
        </span>
        <motion.span
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className={cn(
            "relative w-fit overflow-hidden rounded-md border border-transparent px-2 py-1 font-bold tracking-tight text-white shadow-sm transition-colors duration-300",
            className,
            currentContainerClass
          )}
        >
          <AnimatePresence mode="popLayout">
            <motion.span
              initial={{
                y: -25,
                opacity: 0,
                filter: "blur(8px)",
              }}
              animate={{
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
              }}
              exit={{
                y: 25,
                opacity: 0,
                filter: "blur(8px)",
              }}
              transition={{
                duration: 0.4,
                ease: "easeInOut",
              }}
              key={index}
              className="inline-block whitespace-nowrap text-white"
              style={{
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
            >
              {words[index]}
            </motion.span>
          </AnimatePresence>
        </motion.span>
      </div>
    </div>
  );
}
