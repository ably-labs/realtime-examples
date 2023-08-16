import { Space, SpaceMember } from "@ably-labs/spaces";
import Cell from "./Cell";
import { cellData } from "./utils/cellData";

const Spreadsheet = ({
  users,
  space,
}: {
  users: SpaceMember[];
  space?: Space;
}) => {
  const handleClick = (row: number, col: number) => {
    if (!space) return;
    space.locations.set({ row, col });
  };

  return (
    <table className="max-w-[360px] min-w-[290px] w-1/2 border-gray-350 border-[0.25px] border-separate border-spacing-0 bg-slate-150 text-xs text-left">
      <tbody>
        {cellData.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <td
              key={rowIndex}
              className="w-[10%] px-2 py-2 h-10 bg-slate-250 border-gray-350 border-[0.25px] text-center"
            >
              {rowIndex + 1}
            </td>

            {row.map((col, colIndex) => {
              const cellMembers = users.filter((user) => {
                return (
                  user.location !== null &&
                  user.location.row === rowIndex &&
                  user.location.col === colIndex
                );
              });

              return (
                <Cell
                  key={colIndex}
                  value={col}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  cellMembers={cellMembers}
                  handleClick={handleClick}
                />
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Spreadsheet;
