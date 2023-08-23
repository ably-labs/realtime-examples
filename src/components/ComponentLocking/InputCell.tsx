import React from "react";
import ContentEditable from "react-contenteditable";
import { InputCellProps } from "./utils/types";

const InputCell: React.FC<InputCellProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  cellMembers,
  isSelf,
}) => (
  <div className="flex flex-col mb-4">
    <label htmlFor={name} className="mb-2 text-sm">
      {label}
    </label>
    <div onChange={onChange}>
      <ContentEditable
        id={name}
        tagName={"p"}
        disabled={false}
        data-before={label}
        html="Edit to lock me"
        className="p-2 w-96 h-10 text-sm border border-gray-350 bg-slate-50 rounded-lg focus:bg-white"
      />
    </div>
  </div>
);

export default InputCell;
