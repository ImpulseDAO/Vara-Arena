import { Box, BoxProps } from "@mantine/core";
import "./styles.scss";
import AvatarIcon from "assets/images/AvatarV2.png";
import { useEffect, useState } from "react";

export const CharInfo = ({
  isMyCharacter,
  name,
  idStr,
  //
  exp,
  maxExp,
  level,
  ...boxProps
}: {
  isMyCharacter: boolean;
  name: string;
  idStr: string;
  //
  exp: number;
  maxExp: number;
  level: number;
} & BoxProps) => {
  return (
    <Box className="profile_user" {...boxProps}>
      <img className={`profile_avatar ${isMyCharacter ? 'my_avatar' : ''}`} src={AvatarIcon} alt="AvatarIcon" />
      <div className="profile_name">
        <p>{name}</p>
        <p>{idStr}</p>

        <LevelBar maxXp={maxExp} curXp={exp} level={level} />
      </div>
    </Box>
  );
};

const LevelBar = ({
  maxXp,
  curXp,
  level,
}: { maxXp: number; curXp: number; level: number; }) => {
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    setTimeout(() => setPercent((curXp / maxXp) * 100), 300);
  });

  return (
    <div className="level_bar_wrapper">
      <span className="level_bar_text">Level</span>

      <div className="level_bar">
        <div className="level_bar_progress" style={{ maxWidth: `${percent}%` }} />
      </div>

      <span className="level_bar_level">{level}</span>
    </div>
  );
};
