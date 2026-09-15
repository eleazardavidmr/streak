import { motion } from "framer-motion";
import { IconCircleDot, IconAward, IconAdjustments } from "@tabler/icons-react";
import { slideUp, springSnappy } from "../../lib/motion.js";

const tabs = [
  { id: "dashboard", Icon: IconCircleDot, label: "Home" },
  { id: "achievements", Icon: IconAward, label: "Achievements" },
  { id: "settings", Icon: IconAdjustments, label: "Settings" },
];

export default function BottomNav({ active, onChange }) {
  const activeIndex = Math.max(
    tabs.findIndex((tab) => tab.id === active),
    0,
  );

  return (
    <motion.nav
      variants={slideUp}
      initial="hidden"
      animate="visible"
      transition={springSnappy}
      className="fixed bottom-0 w-full z-50 pb-safe material-chrome border-t border-white/8"
    >
      <div className="relative flex items-center justify-around h-16 px-margin">
        <motion.div
          aria-hidden="true"
          className="absolute inset-y-2 rounded-2xl bg-primary-container/12"
          style={{ width: `${100 / tabs.length}%`, left: 0 }}
          animate={{ x: `${activeIndex * 100}%` }}
          transition={springSnappy}
        />
        {tabs.map(({ id, Icon, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              className={`relative z-10 flex min-w-14 min-h-11 items-center justify-center transition-colors duration-200 ${
                isActive ? "text-primary-container" : "text-outline hover:text-on-surface"
              }`}
            >
              <motion.span
                animate={{ scale: isActive ? 1 : 0.92 }}
                transition={springSnappy}
                className="flex flex-col items-center gap-0.5"
              >
                <Icon size={23} stroke={isActive ? 2 : 1.6} />
                <span
                  className={`font-label-sm text-label-sm tracking-wide ${
                    isActive ? "font-semibold" : "font-medium"
                  }`}
                >
                  {label}
                </span>
              </motion.span>
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
}
