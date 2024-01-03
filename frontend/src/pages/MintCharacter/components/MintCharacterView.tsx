import { Input } from "components";
import { Button } from "components/Button";
import { ButtonGroupNew } from "components/ButtonGroupNew";
import { StatBar } from "pages/@shared/StatBar";
import { FC, memo, useRef } from "react";
import "./styles.scss";
import { Badge, Box, Table } from "@mantine/core";
import { SchoolOfMagicChoice } from "./SchoolOfMagicChoice";
import { TitleWithQuote } from "components/TitleWithQuote";
import { capitalize } from "lodash";
import { StrategyInput } from "components/StrategyInput";

type MintCharacterViewProps = {
  stats: {
    strength: number;
    agility: number;
    vitality: number;
    stamina: number;
    intelligence: number;
    points: number;
  };
  decrease: (stat) => void;
  increase: (stat) => void;
  disabled: boolean;
  onSubmit: VoidFunction;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onShoolOfMagicChange: (element: MagicElement) => void;
  onUploadCodeChange: (codeId: string) => void;
  name: string;
  codeId: string;
  setCodeId: (codeId: string) => void;
};

export const MintCharacterView: FC<MintCharacterViewProps> = memo(
  ({
    stats,
    decrease,
    increase,
    disabled,
    onSubmit,
    onChange,
    onShoolOfMagicChange,
    onUploadCodeChange,
    name,
    codeId,
    setCodeId,
  }) => {
    const initialStats = useRef({ ...stats });

    return (
      <div className="mint_char">
        <Table className={"table_container"}>
          <div className={"table_header"}>Mint character to proceed</div>
          <div className="modal_wrapper">
            <div className={"modal_left"}>
              <div className={"top_wrapper"}>
                <TitleWithQuote quoteUrl="https://impulse-dao.gitbook.io/impulse-dao/games-for-developers/arena" >
                  Character info
                </TitleWithQuote>
                <Input
                  className={"input_container"}
                  onChange={onChange}
                  value={name}
                  placeholder="Enter character name"
                  name="name"
                />
                <StrategyInput
                  codeId={codeId}
                  setCodeId={setCodeId}
                  onUploadCodeChange={onUploadCodeChange}
                />
              </div>
              <PointsLeft points={stats.points} />
              {[
                'strength',
                'agility',
                'vitality',
                'stamina',
                'intelligence'
              ].map((statName) => {
                return (
                  <ButtonGroupNew
                    key={statName}
                    leftText={capitalize(statName)}
                    firstButton={"-"}
                    value={stats[statName]}
                    secondButton={"+"}
                    onClickFirstButton={() => decrease(statName)}
                    onClickSecondButton={() => increase(statName)}
                    isFirstDisabled={stats[statName] === initialStats.current[statName]}
                    isSecondDisabled={stats.points === 0}
                  />
                );
              })}

            </div>
            <div className={"modal_right"}>
              <Box pt="2.5rem" mb="2rem">
                <StatBar
                  health={stats.vitality * 30 + 10}
                  energy={
                    [0, 110, 120, 130, 140, 150, 160, 170, 180, 190][stats.stamina]
                  }
                />
              </Box>

              <SchoolOfMagicChoice onChange={onShoolOfMagicChange} />
            </div>
          </div>
          <div className={"buttonsGrid"}>
            <Button className={"cancelButton"} onClick={() => { }}>
              Cancel
            </Button>
            <Button
              className={"mintButton"}
              onClick={onSubmit}
              disabled={disabled}
            >
              Mint character
              <Badge component="span" c="white" styles={{
                root: {
                  backgroundColor: '#484848',
                  pointerEvents: 'none',
                }
              }}>
                100 vara
              </Badge>
            </Button>
            <div className="textWrapper">
              75% is added to this season's prize pool
            </div>
          </div>
        </Table>
      </div>
    );
  }
);

const PointsLeft = ({ points }) => {
  return (
    <div className={"points"}>
      Points left:<span>{points}</span>{" "}
    </div>
  );
};
