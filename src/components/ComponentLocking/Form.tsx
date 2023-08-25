import React, { useState } from "react";
import InputCell from "./InputCell";
import { entries } from "./utils/data";
import { FormComponentProps, FormData } from "./utils/types";

const FormComponent: React.FC<FormComponentProps> = ({
  users,
  self,
  space,
}) => {
  const handleFocus = (name: string) => {
    if (!space) return;
    space.locations.set({ name });
  };

  return (
    <div>
      {entries.map((entry) => {
        // Determine cellMember as the first person who entered the cell
        const cellMember = users.find(
          (user) => user.location && user.location.name === entry.name,
        );

        // Check if the cellMember is the same as yourself
        const isSelf = cellMember === self;

        return (
          <InputCell
            key={entry.name}
            label={entry.label}
            name={entry.name}
            type={entry.type}
            handleFocus={() => handleFocus(entry.name)}
            cellMember={cellMember}
            isSelf={isSelf}
          />
        );
      })}
    </div>
  );
};

export default FormComponent;
