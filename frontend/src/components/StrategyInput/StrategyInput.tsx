import {
  useUploadCode,
} from "hooks/useUploadCode";
import { Select, SelectProps } from "@mantine/core";
import React from "react";
import styles from "./StrategyInput.module.css";
import { useStableAlert } from "hooks/useWatchMessages/useStableAlert";

export const StrategyInput = ({
  value,
  setValue,
  selectData,
  ...selectProps
}: {
  value?: string | null;
  selectData: { value: string; label: string; }[];
  setValue: (value: string | null) => void;
} & SelectProps) => {
  const alert = useStableAlert();
  const uploadCode = useUploadCode();

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

            setValue(codeId);
          },
        });
      }
    };
  };

  const handleUploadCodeClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  return (
    <>
      <Select
        {...selectProps}
        data={[
          {
            value: "upload",
            label: "+ Upload code",
          },
          ...selectData,
        ]}
        value={value}
        onChange={async (value) => {
          if (value === "upload") {
            handleUploadCodeClick();
            return;
          }
          setValue(value);
        }}
        placeholder="Select items"
        nothingFoundMessage="Nothing found"
        classNames={{
          input: styles.input,
          options: styles.options,
          option: styles.option,
          dropdown: styles.dropdown,
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
