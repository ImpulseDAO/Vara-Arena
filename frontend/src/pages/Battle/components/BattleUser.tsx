import { StatBar } from "pages/@shared/StatBar";
import LockSvg from "../../../assets/svg/lock.svg";
import CharSvg from "../../../assets/svg/char.svg";

export const BattleUser = ({
  user,
  userIndex,
  health,
  energy,
}: {
  user: any;
  userIndex: 1 | 2;
  health: number;
  energy: number;
}) => {
  return (
    <div className={`battle_user${userIndex}`}>
      <div className="battle_data">
        <div className="battle_user">
          <div className="battle_name">
            <p>{user?.name}</p>
            <p>
              <span>Level</span>
              <span>1</span>
            </p>
          </div>
        </div>
        <div className="battle_armour">
          <span>Armour</span>
          <span>0</span>
        </div>
        <div className="battle_stats">
          <p>
            <span>Strength</span>
            <span>{user?.attributes.strength}</span>
          </p>

          <p>
            <span>Agility</span>
            <span>{user?.attributes.agility}</span>
          </p>
          <p>
            <span>Vitality</span>
            <span>{user?.attributes.vitality}</span>
          </p>
          <p>
            <span>Stamina</span>
            <span>{user?.attributes.stamina}</span>
          </p>
        </div>
      </div>
      <div className="battle_equip">
        <StatBar health={health} energy={energy} />
        <div className={"img_wrapper"}>
          {[
            "lock_img1",
            "lock_img2",
            "lock_img3",
            "lock_img4",
            "lock_img5",
            "char_svg",
            "lock_img6",
            "lock_img7",
            "lock_img8",
            "lock_img9",
          ].map((className) => (
            <img
              className={className}
              key={className}
              src={className.startsWith("lock") ? LockSvg : CharSvg}
              alt={className}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
