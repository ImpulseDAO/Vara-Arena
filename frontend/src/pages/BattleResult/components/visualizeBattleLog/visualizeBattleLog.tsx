
import { Text } from "@mantine/core";
import { type BattleStep, type LogEntry, spellnames } from "../types";

export function visualizeBattleLog(battleSteps: BattleStep[], characters: ({ name: string, id: string; })[]): React.ReactNode[][] {
  const results: React.ReactNode[][] = [];

  battleSteps.forEach((step, index) => {
    const turnLogs: React.ReactNode[] = step.logs.map((log) => {
      const index = characters.findIndex(char => char.id === log.character);
      const charName = characters[index].name;

      try {
        const color = index === 0 ? 'coral' : 'cyan';
        return getLogEntry(log, charName, color);
      } catch (error) {
        return <Text c="red">Error while parsing log entry</Text>;
      }
    });

    if (index === 0) {
      results.push([
        <Text component="span">
          Battle started
        </Text >
      ]);
    }
    else results.push(turnLogs);
  });

  return results;
}

const Name = ({ charName, color }: { charName: string, color: string; }) => {
  return <Text component="span" color={color}>{charName}</Text>;
};

const getLogEntry = (log: LogEntry, charName: string, color: string) => {

  switch (true) {
    case log.action.move != null:
      return (
        <Text component="span">
          <Name {...{ charName, color }} /> moves to position {log.action.move?.position}.
        </Text>
      );
    case log.action.attack != null:
      const { kind, result } = log.action.attack ?? { result: {} };
      return (
        <Text component="span">
          {
            'damage' in result ? (
              <><Name {...{ charName, color }} /> deals {result.damage} dmg using {kind?.toLowerCase()} attack</>
            ) : null
          }
          {
            'miss' in result ? (
              <><Name {...{ charName, color }} /> misses trying to use {kind?.toLowerCase()} attack.</>
            ) : null
          }
        </Text>
      );
    case log.action.rest != null:
      return (
        <Text component="span">
          <Name {...{ charName, color }} /> rests, gaining {log.action.rest?.energy} energy.
        </Text>
      );
    case log.action.castSpell != null:
      const spell = spellnames.find(spell => spell in log.action.castSpell?.result);
      if (!spell) return <Text component="span">Unknown spell</Text>;
      const details = log.action.castSpell?.result[spell] ?? {};

      return (
        <Text component="span">
          <Name {...{ charName, color }} /> casts {spell} spell.
          {'heal' in details ? ` ${details.heal} HP healed` : null}
          {'damage' in details ? ` ${details.damage} damage dealt` : null}
          {'enemyPosition' in details ? ` Enemy thrown to position ${details.enemyPosition}` : null}
        </Text>
      );
    case log.action.fireWall != null:
      return (
        <Text component="span">
          <Name {...{ charName, color }} /> gets {log.action.fireWall.damage} damage from firewall.
        </Text>
      );
    case log.action.notEnoughEnergy != null:
      return (
        <Text component="span">
          <Name {...{ charName, color }} /> doesn't have enough energy.
        </Text>
      );
    case log.action.parry != null:
      return (
        <Text component="span">
          <Name {...{ charName, color }} /> parries the attack.
        </Text>
      );
    case log.action.guardbreak != null:
      return (
        <Text component="span">
          <Name {...{ charName, color }} /> guardbreaks the attack.
        </Text>
      );
    default: {
      return <Text component="span">Unknown action</Text>;
    }
  }
};
