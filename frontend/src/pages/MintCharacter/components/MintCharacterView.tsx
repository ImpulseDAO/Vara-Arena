import { Input } from "components";
import { Button } from "components/Button";
import { ButtonGroup } from "components/ButtonGroup";
import { StatBar } from "pages/@shared/StatBar";
import { FC, memo, useRef } from "react";
import "./styles.scss";
import { Badge, Box, Table } from "@mantine/core";
import { TitleWithQuote } from "components/TitleWithQuote";
import capitalize from "lodash/capitalize";
import { getFullEnergy, getFullHp } from "consts";
import { CharacterStats } from "../hooks/useStats";

type MintCharacterViewProps = {
  stats: CharacterStats;
  decrease: (stat) => void;
  increase: (stat) => void;
  disabled: boolean;
  onSubmit: VoidFunction;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  name: string;
  strategyInput?: React.ReactNode;
};

export const MintCharacterView: FC<MintCharacterViewProps> = memo(
  ({
    stats,
    decrease,
    increase,
    disabled,
    onSubmit,
    onChange,
    name,
    strategyInput
  }) => {
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
                {strategyInput}
              </div>
              <PointsLeft points={stats.points} />
              {[
                'strength',
                'agility',
                'stamina',
                'intelligence'
              ].map((statName) => {
                return (
                  <ButtonGroup
                    key={statName}
                    leftText={capitalize(statName)}
                    firstButton={"-"}
                    value={stats[statName]}
                    secondButton={"+"}
                    onClickFirstButton={() => decrease(statName)}
                    onClickSecondButton={() => increase(statName)}
                    isFirstDisabled={stats[statName] === 1}
                    isSecondDisabled={stats.points === 0}
                  />
                );
              })}

            </div>
            <div className={"modal_right"}>
              <Box pt="2.5rem" mb="2rem">
                <StatBar
                  health={getFullHp(stats.level ?? 1)}
                  energy={getFullEnergy(stats.stamina)}
                />
              </Box>

              {/* <SchoolOfMagicChoice onChange={onShoolOfMagicChange} /> */}
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
