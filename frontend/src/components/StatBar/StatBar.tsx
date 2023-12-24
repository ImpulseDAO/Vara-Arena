import React, { FC } from "react";
import "./styles.scss";

export type StatBarProps = {
  health?: number | string;
  energy?: number | string;
};

export const StatBar: FC<StatBarProps> = ({ health = 50, energy = 50 }) => {
  return (
    <div className="outer-wrapper">
      <div className={"flex-container"}>
        <div className={"elem1 leftText"}>Health</div>
        <div className={"elem2 healthBar"} />
        <div className={"elem3 number"}>{health}</div>
      </div>
      <div className={"flex-container"}>
        <div className={"elem1 leftText"}>Energy</div>
        <div className={"elem2 energyBar"} />
        <div className={"elem3 number"}>{energy}</div>
      </div>
    </div>
  );
};
