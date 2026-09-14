import {
  IconBarbell,
  IconChevronRight,
  IconDroplet,
  IconPencil,
  IconSparkles,
  IconWalk,
} from "@tabler/icons-react";

const resetActions = [
  {
    id: "push-ups",
    title: "20 push-ups",
    description: "Immediate physical activation to clear the mind",
    Icon: IconBarbell,
  },
  {
    id: "cold-shower",
    title: "Cold shower (1 min)",
    description: "Reset nervous system and adrenaline",
    Icon: IconDroplet,
  },
  {
    id: "walk",
    title: "10 minute walk",
    description: "Change physical environment and rhythm",
    Icon: IconWalk,
  },
  {
    id: "tidy",
    title: "Tidy your room",
    description: "Regain order in your immediate space",
    Icon: IconSparkles,
  },
  {
    id: "journal",
    title: "Write in journal",
    description: "Discharge thought loops onto paper",
    Icon: IconPencil,
  },
];

export default function ActionSelection({ onSelect, onSkip, onBack }) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between pb-space-lg">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="flex items-center justify-center w-10 h-10 -ml-2 text-on-surface-variant hover:text-primary transition-colors"
        >
          <IconChevronRight size={24} stroke={1.6} className="rotate-180" />
        </button>
        <span className="font-label-sm text-label-sm uppercase text-outline tracking-wider">
          Step 2 of 4
        </span>
      </div>

      <div className="flex flex-col gap-space-xs pb-space-xl">
        <h2 className="font-headline-sm text-headline-sm text-primary tracking-tight">
          Choose something to do right now
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Shift physical state and redirect mental focus immediately.
        </p>
      </div>

      <div className="flex flex-col w-full divide-y divide-outline-variant/30">
        {resetActions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => onSelect(action)}
            className="group flex items-center justify-between w-full py-space-md text-left transition-colors hover:bg-surface-container-low"
          >
            <div className="flex items-center gap-space-md min-w-0 pr-space-sm">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-surface-container text-secondary shrink-0 group-hover:bg-secondary-container group-hover:text-primary-container transition-colors">
                <action.Icon size={18} stroke={1.8} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-body-md text-body-md text-primary font-medium group-hover:text-primary-container transition-colors truncate">
                  {action.title}
                </span>
                <span className="font-body-md text-body-md text-outline truncate">
                  {action.description}
                </span>
              </div>
            </div>
            <IconChevronRight
              size={20}
              stroke={1.6}
              className="text-outline shrink-0 group-hover:text-primary-container transition-colors"
            />
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center pt-space-xl pb-space-md">
        <button
          type="button"
          onClick={onSkip}
          className="font-body-md text-body-md text-outline hover:text-on-surface transition-colors py-space-sm px-space-md"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
