import React, { FC } from "react";
import "./styles.scss";

export type StatBarProps = {
  health?: number | string;
  stamina?: number | string;
};

export const StatBar: FC<StatBarProps> = ({ health = 50, stamina = 50 }) => {
  return (
    <div>
      <div className={"Wrapper"}>
        <div className={"leftText"}>Health</div>
        <div className={"healthBar"} />
        <div className={"number"}>{health}</div>
      </div>
      <div className={"Wrapper"}>
        <div className={"leftText"}>Energy</div>
        <div className={"energyBar"} />
        <div className={"number"}>{stamina}</div>
      </div>
    </div>
  );
};
