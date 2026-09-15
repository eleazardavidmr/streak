export const springSoft = { type: "spring", stiffness: 300, damping: 30, mass: 0.9 };
export const springSnappy = { type: "spring", stiffness: 460, damping: 32 };
export const springBouncy = { type: "spring", stiffness: 380, damping: 20 };

export const fadeRise = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export const fadeScale = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1 },
};

export const slideDown = {
  hidden: { opacity: 0, y: -14 },
  visible: { opacity: 1, y: 0 },
};

export const slideUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -16 },
};

export const overlayFade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const sheetSpring = {
  hidden: { opacity: 0, y: 26, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 18, scale: 0.98 },
};

export const staggerParent = { hidden: {}, visible: {} };

export function staggerTransition(staggerChildren = 0.06, delayChildren = 0) {
  return { staggerChildren, delayChildren };
}
