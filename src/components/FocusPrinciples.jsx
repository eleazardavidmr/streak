import { motion } from "framer-motion";
import { fadeRise, springSoft, staggerParent, staggerTransition } from "../lib/motion.js";

const defaultPrinciples = [
  {
    number: "01",
    title: "Friction over indulgence",
    description: "Decide once, execute daily without renegotiation.",
  },
  {
    number: "02",
    title: "Presence across discomfort",
    description: "The urge is not a mandate; it is merely a sensation.",
  },
];

export default function FocusPrinciples({ principles = defaultPrinciples }) {
  return (
    <div className="flex flex-col gap-space-md">
      <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase">
        Focus principles
      </span>
      <motion.div
        variants={staggerParent}
        initial="hidden"
        animate="visible"
        transition={staggerTransition(0.08)}
        className="flex flex-col gap-space-sm"
      >
        {principles.map((p, i) => (
          <motion.div key={p.number} variants={fadeRise} transition={springSoft}>
            <div className="flex items-start gap-space-sm">
              <span className="font-label-sm text-label-sm text-primary-container pt-0.5">
                {p.number}
              </span>
              <div className="flex flex-col">
                <span className="font-body-md text-body-md text-on-surface">
                  {p.title}
                </span>
                <span className="font-label-sm text-label-sm text-outline">
                  {p.description}
                </span>
              </div>
            </div>
            {i < principles.length - 1 && (
              <div className="w-full h-px bg-surface-container-highest opacity-40 my-space-xs" />
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
