import { useState, FunctionComponent } from "react";

import useClickOutsideList from "../hooks/useClickOutsideList";
import { MAX_USERS_BEFORE_LIST, type Member } from "../utils/helpers";
import UserInfo from "./UserInfo";

const Surplus: FunctionComponent<{ otherUsers: Member[] }> = ({
  otherUsers,
}) => {
  const [showList, setShowList] = useState(false);
  const { listRef, plusButtonRef } = useClickOutsideList(() =>
    setShowList(false),
  );

  return otherUsers.length > MAX_USERS_BEFORE_LIST ? (
    <div className="right-0 flex flex-col items-center absolute">
      <div
        className="flex justify-center items-center absolute right-0 text-white text-sm bg-gray-500 border-gray-300 border-2
		    h-12 w-12 rounded-full mb-2 select-none"
        style={{
          zIndex: otherUsers.length + 50,
        }}
        ref={plusButtonRef}
        onClick={() => {
          setShowList(!showList);
        }}
      >
        +{otherUsers.slice(MAX_USERS_BEFORE_LIST).length}
      </div>

      {showList ? (
        <div
          className="max-h-[70px] overflow-y-auto p-2 relative top-14 left-6 md:max-h-[250px] lg:left-24 bg-slate-800 rounded-lg text-white min-w-[280px]"
          ref={listRef}
        >
          {otherUsers.slice(MAX_USERS_BEFORE_LIST).map((user) => (
            <div
              className="hover:bg-slate-700 hover:rounded-lg px-2 py-2 md:px-3"
              key={user.clientId}
            >
              <UserInfo user={user} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  ) : null;
};

export default Surplus;
