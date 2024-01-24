import "./styles.scss";
import ArenaPng from "assets/images/arena.png";
import { FC, memo } from "react";

import { Button } from "components/Button";

export const colourOptions = [
  { value: "ocean", label: "Ocean", color: "#00B8D9", isFixed: true },
];

type StartFightViewProps = {
  setUser: React.Dispatch<any>;
  user: any;
  name: string;
  handleSubmit: VoidFunction;
};

export const StartFightView: FC<StartFightViewProps> = memo(
  ({ setUser, user, name, handleSubmit }) => {
    return (
      <div className="arena">
        <div className="arena_modal">
          <img className="arena_img" src={ArenaPng} alt="arena" />
          <p className="arena_title">Enter the Arena</p>
          {/* <div className="arena_select_wrapper">
            <p>Select your character</p>
            <Select
              className="arena_select"
              onClick={(user) => setUser(user)}
              //@ts-ignore
              icon={<img className="arena_user_icon" src={userIcon} />}
              //@ts-ignore
              components={{ Control: SelectControl, Option: CustomOption }}
              isSearchable
              name="user"
              options={[
                {
                  value: name || localStorage.getItem("name"),
                  label: name || localStorage.getItem("name"),
                },
              ]}
              selectedUser={user}
            />
          </div> */}
          <Button onClick={handleSubmit} disabled={!user}>
            Start fight
          </Button>
        </div>
      </div>
    );
  }
);
