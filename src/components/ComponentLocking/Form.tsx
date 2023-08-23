import React, { useState } from "react";
import InputCell from "./InputCell";
import { entries } from "./utils/data";
import { FormComponentProps, FormData } from "./utils/types";

const FormComponent: React.FC<FormComponentProps> = ({
  users,
  self,
  space,
}) => {
  const [formData, setFormData] = useState({
    entry1: "",
    entry2: "",
    entry3: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value } as Pick<
      FormData,
      keyof FormData
    >);
  };

  return (
    <div>
      {entries.map((entry) => (
        <InputCell
          key={entry.name}
          label={entry.label}
          name={entry.name}
          type={entry.type}
          value={formData[entry.name as keyof FormData]}
          onChange={handleChange}
          cellMembers={[]}
          isSelf={false}
        />
      ))}
    </div>
  );
};

export default FormComponent;
