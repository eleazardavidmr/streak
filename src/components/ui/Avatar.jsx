import { useState } from "react";
import { IconUser } from "@tabler/icons-react";

export default function Avatar({ avatarUrl, size = 32, iconSize = 18 }) {
  const [brokenImage, setBrokenImage] = useState(false);
  const [lastAvatarUrl, setLastAvatarUrl] = useState(avatarUrl);

  if (avatarUrl !== lastAvatarUrl) {
    setLastAvatarUrl(avatarUrl);
    setBrokenImage(false);
  }

  const showAvatar = avatarUrl && !brokenImage;

  return (
    <span
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary"
      style={{ width: size, height: size }}
    >
      {showAvatar ? (
        <img
          src={avatarUrl}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setBrokenImage(true)}
        />
      ) : (
        <IconUser size={iconSize} className="text-on-primary" stroke={2} />
      )}
    </span>
  );
}
