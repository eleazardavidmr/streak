import { motion } from "framer-motion";
import { navTabs as tabs } from "../../lib/navTabs.js";
import { slideUp, springSnappy } from "../../lib/motion.js";

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
      className="fixed inset-x-0 bottom-0 z-50 px-margin md:hidden"
      style={{
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)",
      }}
    >
      <div className="rounded-[1.75rem] border border-white/10 material-chrome shadow-elevated p-1.5">
        <div className="relative flex items-center h-14">
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 rounded-[1.375rem] bg-primary-container/12"
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
                className={`relative z-10 flex flex-1 min-h-11 items-center justify-center transition-colors duration-200 ${
                  isActive
                    ? "text-primary-container"
                    : "text-outline hover:text-on-surface"
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
      </div>
    </motion.nav>
  );
}
