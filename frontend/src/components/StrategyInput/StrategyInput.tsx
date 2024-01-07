import {
  useUploadCode,
} from "hooks/useUploadCode";
import { Button, Select, Text } from "@mantine/core";
import React, { useEffect } from "react";
import { OLD_STRATEGY_CODE_ID_HARDCODED, STRATEGY_CODE_ID_HARDCODED } from "consts";
import { useAlert } from "@gear-js/react-hooks";
import { removeCodeIdFromLocalStorage } from "hooks/useUploadCode/useUploadCode";

export const StrategyInput = ({
  codeId,
  setCodeId,
  onUploadCodeChange,
}: {
  codeId: string;
  setCodeId: (codeId: string | null) => void;
  onUploadCodeChange: (codeId: string) => void;
}) => {
  const alert = useAlert();
  const uploadCode = useUploadCode();

  const [strategyCodeIds, setStrategyCodeIds] = React.useState<string[]>([]);

  useEffect(() => {
    /**
      * FILTER OUT OLD STRATEGY CODE ID
      */
    const updatedCodeIds = removeCodeIdFromLocalStorage(OLD_STRATEGY_CODE_ID_HARDCODED);
    setStrategyCodeIds(updatedCodeIds);
  }, []);

  const selectData = React.useMemo(() => {
    return strategyCodeIds.map((codeId, index) => {
      const firstPart =
        codeId === STRATEGY_CODE_ID_HARDCODED
          ? "Default Strategy"
          : `Strategy Class Hash: ${index + 1}`;

      return {
        value: codeId,
        label: `${firstPart}: ${codeId.substring(0, 8)}...`,
      };
    });
  }, [strategyCodeIds]);


  /**
   * 
   */

  const inputFileRef = React.useRef<HTMLInputElement>(null);

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (!event.target.files?.[0]) {
      alert.error("No file selected");
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
        styles={{
          input: {
            backgroundColor: "black",
            color: "white",
            fontSize: "16px",
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
