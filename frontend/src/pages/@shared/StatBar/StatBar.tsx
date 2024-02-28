import React, { FC } from "react";
import "./styles.scss";
import { LIFES_INITIAL_QUANTITY } from "consts";

export type StatBarProps = {
  lives?: number;
  health: number | undefined;
  healthMax?: number | undefined;
  energy: number | undefined;
  energyMax?: number | undefined;
};

export const StatBar: FC<StatBarProps> = ({ lives, health, healthMax, energy, energyMax, }) => {

  const healthPercent = healthMax ? (health ?? 0) / healthMax * 100 : 100;
  const energyPercent = energyMax ? (energy ?? 0) / energyMax * 100 : 100;

  let livesIndicators: React.ReactNode[] = [];

  if (lives != null) {

    livesIndicators = Array(LIFES_INITIAL_QUANTITY).fill(null).map((el, idx) => {
      const isSpentLife = idx + 1 > lives;

      /**
       * show empty life indicator if life is spents
       */

      if (isSpentLife) return <div key={idx} className={"lifeIndicator empty"} />;
      return <div key={idx} className={"lifeIndicator"} />;
    });
  }

  return (
    <div className="outer-wrapper">
      {lives != null && (
        <div className={"flex-container"}>
          <div className={"elem1 leftText"}>Lives</div>
          <div className={"elem2 livesContainer"}>
            {livesIndicators}
          </div>
          <div className={"elem3 elem_number"}>{lives}/5</div>
        </div>
      )}

      <div className={"flex-container"}>
        <div className={"elem1 leftText"}>Health</div>
        <div className={"elem2 healthBar"} >
          <div className={"healthBarInner"} style={{ maxWidth: `${healthPercent}%` }} />
        </div>
        <div className={"elem3 elem_number"}>{
          healthMax
            ? `${health}/${healthMax}`
            : health
        }</div>
      </div>
      <div className={"flex-container"}>
        <div className={"elem1 leftText"}>Energy</div>
        <div className={"elem2 energyBar"} >
          <div className={"energyBarInner"} style={{ maxWidth: `${energyPercent}%` }} />
        </div>
        <div className={"elem3 elem_number"}>{
          energyMax
            ? `${energy}/${energyMax}`
            : energy
        }</div>
      </div>
    </div>
  );
};
