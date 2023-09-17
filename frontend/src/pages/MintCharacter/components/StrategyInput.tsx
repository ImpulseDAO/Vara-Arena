import "./styles.scss";
import React from "react";
import {
  getCodeIdsFromLocalStorage,
  useCodeUpload,
} from "hooks/useUploadCode/useUploadCode";
import { Button, Select, Text } from "@mantine/core";
import { STRATEGY_CODE_ID_HARDCODED } from "../MintCharacter";

export const StrategyInput = ({
  codeId,
  setCodeId,
  onUploadCodeChange,
}: {
  codeId: string;
  setCodeId: (codeId: string) => void;
  onUploadCodeChange: (codeId: string) => void;
}) => {
  const uploadCode = useCodeUpload();

  const selectData = getCodeIdsFromLocalStorage().map((codeId, index) => {
    const firstPart =
      codeId === STRATEGY_CODE_ID_HARDCODED
        ? "Default Strategy"
        : `Strategy ${index + 1}`;

    return {
      value: codeId,
      label: `${firstPart}: ${codeId.substring(0, 8)}...`,
    };
  });

  const inputFileRef = React.useRef<HTMLInputElement>();

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (!event.target.files[0]) {
      alert("No file selected");
      return;
    }

    fileReader.readAsArrayBuffer(event.target.files[0]);

    fileReader.onload = async (e) => {
      const fileContent = fileReader.result as ArrayBuffer;

      if (fileContent) {
        const buffer = Buffer.from(fileContent);
        await uploadCode({
          optBuffer: buffer,
          name: "test",
          metaHex: undefined,
          resolve: (codeId) => {
            console.log("upload code resolved for codeId ", codeId);

            setCodeId(codeId);
            onUploadCodeChange(codeId);
          },
        });
      }
    };
  };

  const handleClickAndUpload = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
    value: string;
    label: string;
  }

  const SelectItemCustom = React.forwardRef<HTMLDivElement, ItemProps>(
    ({ value, label, ...others }: ItemProps, ref) => {
      if (value === "upload") {
        return (
          <Button
            bg="gray[2]"
            onClick={handleClickAndUpload}
            m="2px"
            mt="5px"
            h="44px"
            p="xs"
            sx={{
              border: "1px solid #ffffff",
            }}
          >
            <Text c="white" fw="600">
              {label}
            </Text>
          </Button>
        );
      }

      return (
        <div ref={ref} {...others}>
          <Text c="white">{label}</Text>
        </div>
      );
    }
  );

  return (
    <>
      <Select
        data={[
          ...selectData,
          {
            value: "upload",
            label: "+ Upload code",
          },
        ]}
        value={codeId}
        onChange={(value) => setCodeId(value)}
        placeholder="Select items"
        nothingFound="Nothing found"
        creatable
        itemComponent={SelectItemCustom}
        w="320px"
        styles={{
          input: {
            backgroundColor: "black",
            color: "white",
            height: "44px",
            borderRadius: "8px",
            "&:focus-within": {
              borderColor: "white",
              borderWidth: "2px",
            },
          },

          itemsWrapper: {
            backgroundColor: "black",
            color: "white",
            borderRadius: "8px",
          },

          item: {
            "&[data-selected]": {
              "&, &:hover": {
                backgroundColor: "#238be6",
              },
            },

            // applies styles to hovered item (with mouse or keyboard)
            "&[data-hovered]": {
              backgroundColor: "#77f6",
              "*": {
                color: "white",
              },
            },
          },
        }}
      />

      <input
        type="file"
        onChange={uploadFile}
        className={"input_file"}
        ref={inputFileRef}
        style={{
          display: "none",
        }}
      />
    </>
  );
};
