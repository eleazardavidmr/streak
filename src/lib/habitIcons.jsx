import {
  IconBarbell,
  IconBook2,
  IconDroplet,
  IconFlame,
  IconMoon,
  IconPencil,
  IconRun,
  IconSalad,
  IconYoga,
} from "@tabler/icons-react";

export function HabitIcon({ name, ...props }) {
  switch (name) {
    case "flame":
      return <IconFlame {...props} />;
    case "droplet":
      return <IconDroplet {...props} />;
    case "book":
      return <IconBook2 {...props} />;
    case "moon":
      return <IconMoon {...props} />;
    case "yoga":
      return <IconYoga {...props} />;
    case "pencil":
      return <IconPencil {...props} />;
    case "salad":
      return <IconSalad {...props} />;
    case "run":
      return <IconRun {...props} />;
    case "barbell":
    default:
      return <IconBarbell {...props} />;
  }
}
