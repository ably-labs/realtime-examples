import React, { useState } from "react";
import InputCell from "./InputCell";
import { entries } from "./utils/data";
import { FormComponentProps } from "./utils/types";

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
        const cellMembers = users.filter((user) => {
          return user.location !== null && user.location.name === entry.name;
        });
        const isSelf = self && self?.location?.name === entry.name;

        return (
          <InputCell
            key={entry.name}
            label={entry.label}
            name={entry.name}
            type={entry.type}
            handleFocus={() => handleFocus(entry.name)}
            cellMembers={cellMembers}
            self={self}
            isSelf={isSelf}
          />
        );
      })}
    </div>
  );
};

export default FormComponent;
