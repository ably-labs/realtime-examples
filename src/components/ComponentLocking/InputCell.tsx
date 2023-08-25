import React from "react";
import { useChannel } from "@ably-labs/react-hooks";
import { InputCellProps } from "./utils/types";
import "./locking.css";
import { getCellStylesForMember } from "./utils/helper";

const InputCell: React.FC<InputCellProps> = ({
  label,
  name,
  type,
  handleFocus,
  cellMember,
  isSelf,
}) => {
  const [content, setContent] = React.useState("");
  const memberColor = cellMember?.profileData.memberColor;
  const memberName = cellMember?.profileData.memberName;

  const channelName = `input-${name}`;

  const [channel, _message] = useChannel(
    channelName,
    (message: { connectionId: any; data: any }) => {
      if (message.connectionId === cellMember?.connectionId) return;
      setContent(message.data);
    },
  );

  const handleCellFocus = () => {
    handleFocus(name);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
    channel.publish({ data: e.target.value });
  };

  return (
    <div className="input-wrapper flex flex-col mb-4">
      <label htmlFor={name} className="mb-2 text-sm">
        {label}
      </label>
      <div
        className="member-name-tab"
        data-name-content={memberName ? memberName : ""}
        style={{ "--member-bg-color": memberColor } as React.CSSProperties}
      >
        <input
          id={name}
          name={name}
          type={type}
          value={content}
          onChange={handleChange}
          onFocus={handleCellFocus}
          placeholder="Edit to lock me"
          className={`p-2 w-96 h-10 text-sm bg-slate-50 rounded-lg outline-none focus:bg-white relative ${getCellStylesForMember(
            cellMember,
          )}`}
        />
      </div>
    </div>
  );
};

export default InputCell;
