import { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  Checkbox,
  Combobox,
  Group,
  Input,
  Pill,
  PillsInput,
  useCombobox,
} from "@mantine/core";
import styles from "./Filters.module.css";

type FiltersProps = {
  onChangeFilters: (filters: string[]) => void;
};

export const Filters: FC<FiltersProps> = memo(({ onChangeFilters }) => {
  const tiers = useMemo(
    () =>
      Object.keys(
        Array.from({ length: 5 }, (_, i) => i + 1)
          .map((tier) => tier)
          .sort((a, b) => a - b)
          .reduce((acc, tier) => ({ ...acc, [`Tier ${tier}`]: [tier] }), {})
      ),
    []
  );

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const [value, setValue] = useState<string[]>(
    Array.from({ length: 5 }, (_, i) => `Tier ${i + 1}`)
  );

  const handleValueSelect = useCallback(
    (val: string) =>
      setValue((current) =>
        current.includes(val)
          ? current.filter((v) => v !== val)
          : [...current, val]
      ),
    []
  );

  const handleValueRemove = useCallback(
    (val: string) => setValue((current) => current.filter((v) => v !== val)),
    []
  );

  const values = useMemo(
    () =>
      value.map((item) => (
        <Pill
          key={item}
          withRemoveButton
          onRemove={() => handleValueRemove(item)}
        >
          {item}
        </Pill>
      )),
    [handleValueRemove, value]
  );

  useEffect(() => {
    onChangeFilters(value);
  }, [value, onChangeFilters]);

  const options = tiers.map((item) => (
    <Combobox.Option
      className={styles.option}
      value={item}
      key={item}
      active={value.includes(item)}
    >
      <Group gap="sm">
        <Checkbox
          checked={value.includes(item)}
          onChange={() => {}}
          aria-hidden
          tabIndex={-1}
          style={{ pointerEvents: "none" }}
        />
        <p className={styles.text}>{item}</p>
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={handleValueSelect}
      withinPortal={false}
    >
      <Combobox.DropdownTarget>
        <PillsInput
          classNames={{ input: styles.input }}
          pointer
          onClick={() => combobox.toggleDropdown()}
        >
          <Pill.Group>
            {values.length > 0 ? (
              values
            ) : (
              <Input.Placeholder>Pick one or more tiers</Input.Placeholder>
            )}

            <Combobox.EventsTarget>
              <PillsInput.Field
                type="hidden"
                onBlur={() => combobox.closeDropdown()}
                onKeyDown={(event) => {
                  if (event.key === "Backspace") {
                    event.preventDefault();
                    handleValueRemove(value[value.length - 1]);
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown classNames={{ dropdown: styles.options }}>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
});
