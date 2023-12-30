import React, { FC } from "react";
import "./styles.scss";
import { LIFES_INITIAL_QUANTITY } from "consts";

export type StatBarProps = {
  lives?: number;
  health?: number | undefined;
  energy?: number | undefined;
};

export const StatBar: FC<StatBarProps> = ({ lives, health, energy }) => {
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
          <div className={"elem3 number"}>{lives}/5</div>
        </div>
      )}

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
