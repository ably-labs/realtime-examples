import React from "react";
import type { Space } from "@ably/spaces";
import { entries } from "./utils/data";
import { AblyPoweredInput } from "./AblyPoweredInput";

interface FormComponentProps {
  space?: Space;
  spaceName: string;
}
const FormComponent: React.FC<FormComponentProps> = ({ space, spaceName }) => {
  if (!space) return null;

  return (
    <>
      {entries.map((entry) => {
        return (
          <AblyPoweredInput
            key={entry.name}
            label={entry.label}
            name={entry.name}
            space={space}
            spaceName={spaceName}
          />
        );
      })}
    </>
  );
};

export default FormComponent;
