import { IconCircleDot, IconAward, IconAdjustments } from "@tabler/icons-react";

const tabs = [
  { id: "dashboard", Icon: IconCircleDot, label: "Home" },
  { id: "achievements", Icon: IconAward, label: "Achievements" },
  { id: "settings", Icon: IconAdjustments, label: "Settings" },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface">
      <div className="flex items-center justify-around h-16 px-margin">
        {tabs.map(({ id, Icon, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex flex-col items-center justify-center min-w-11 min-h-11 transition-colors ${
                isActive ? "text-primary" : "text-outline hover:text-on-surface"
              }`}
            >
              <Icon size={24} stroke={isActive ? 2 : 1.6} />
              <span
                className={`absolute bottom-1 w-0.75 h-0.75 rounded-full bg-primary-container pointer-events-none transition-opacity duration-200 ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
