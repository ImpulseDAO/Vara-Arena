import React, { FC, memo } from "react";
import "./styles.scss";

export type ExperienceBarProp = {
  curXp: string;
  maxXp: string;
};

export const ExperienceBar: FC<ExperienceBarProp> = memo(({ curXp, maxXp }) => {
  const percentage =
    Number(curXp) > Number(maxXp)
      ? 100
      : ((Number(curXp) / Number(maxXp)) * 100).toFixed(2);
  return (
    <div className="experienceBar_contaier">
      <p>XP</p>
      <div className="experienceBar_wrapper">
        <div
          className="experienceBar_line"
          style={{ width: `${percentage}%` }}
        ></div>
        <p className="experienceBar_value">{`${curXp}/${maxXp} ${percentage}%`}</p>
      </div>
    </div>
  );
});
