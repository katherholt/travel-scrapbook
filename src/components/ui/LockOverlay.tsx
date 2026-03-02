"use client";

import { motion } from "framer-motion";

export default function LockOverlay({ title }: { title: string }) {
  return (
    <motion.div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl backdrop-blur-[6px]"
      style={{ backgroundColor: "rgba(246, 242, 234, 0.35)" }}
      initial={{ opacity: 1 }}
      whileHover={{ backgroundColor: "rgba(246, 242, 234, 0.25)" }}
      transition={{ duration: 0.3 }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mb-3 text-noir/60"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      <span className="font-sans text-sm font-bold text-noir/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {title}
      </span>
    </motion.div>
  );
}
