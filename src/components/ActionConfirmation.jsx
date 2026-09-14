import { IconBolt, IconCircleCheck, IconX } from "@tabler/icons-react";

export default function ActionConfirmation({ action, onDone, onChangeAction, onClose }) {
  const title = action?.title ?? "Reset action";

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between py-space-xs mb-space-md">
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-container-low text-on-surface-variant"
        >
          <IconX size={18} stroke={1.8} />
        </button>
        <div className="flex items-center gap-space-xs px-space-sm py-space-xs rounded-full bg-surface-container-lowest text-outline">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
            Active protocol
          </span>
        </div>
        <div className="w-8 h-8" />
      </div>

      <div className="flex flex-col items-center text-center mt-space-xs mb-space-lg">
        <span className="font-label-sm text-label-sm uppercase text-outline tracking-widest mb-space-xs">
          Current action
        </span>
        <h2 className="font-headline-sm text-headline-sm text-primary tracking-tight">
          {title}
        </h2>
      </div>

      <div className="relative flex flex-col items-center justify-center my-space-sm">
        <div className="relative w-56 h-56 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 240 240">
            <circle
              cx="120"
              cy="120"
              r="104"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-surface-container-low"
            />
            <circle
              cx="120"
              cy="120"
              r="104"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="653.45"
              strokeDashoffset="160"
              className="text-primary-container"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-space-md text-center select-none">
            <p className="font-label-sm text-label-sm text-on-surface-variant tracking-wide uppercase">
              Breathe steady · Focus
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mt-space-lg text-center px-space-sm">
        <div className="w-12 h-0.5 bg-surface-container-highest rounded-full mb-space-md" />
        <div className="flex items-center gap-space-xs mb-space-sm">
          <IconBolt size={18} className="text-primary-container" stroke={1.8} />
          <span className="font-label-md text-label-md text-secondary tracking-wide uppercase">
            Dopamine reset
          </span>
        </div>
        <p className="font-body-md text-body-md text-on-surface max-w-xs">
          Notice the physical shift. You are reclaiming biological agency right
          now.
        </p>
      </div>

      <div className="mt-space-xl flex flex-col items-center w-full">
        <button
          type="button"
          onClick={onDone}
          className="w-full h-13 rounded-full bg-primary-container text-on-primary-fixed font-label-md text-label-md font-semibold flex items-center justify-center gap-space-xs active:scale-[0.98] transition-transform"
        >
          <IconCircleCheck size={20} stroke={2} />
          Mark as done
        </button>
        <button
          type="button"
          onClick={onChangeAction}
          className="mt-space-md font-label-md text-label-md text-outline hover:text-on-surface transition-colors py-space-sm px-space-md"
        >
          Choose different action
        </button>
      </div>
    </div>
  );
}
