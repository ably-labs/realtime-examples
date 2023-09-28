import React from "react";
import type { Space } from "@ably/spaces";
import { entries } from "../utils/data";
import { AblyPoweredInput } from "./AblyPoweredInput";

interface FormComponentProps {
  space?: Space;
}
const FormComponent: React.FC<FormComponentProps> = ({ space }) => {
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
          />
        );
      })}
    </>
  );
};

export default FormComponent;
