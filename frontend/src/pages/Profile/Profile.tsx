import {FC, useCallback} from 'react';
import './styles.scss';
import { StatBar } from 'components/StatBar';
import LockSvg from '../../assets/svg/lock.svg';
import CharSvg from '../../assets/svg/char.svg';
import AvatarIcon from '../../assets/images/AvatarV2.png';
import {Button} from "../../components/Button";
import {useNavigate} from "react-router-dom";

export type ProfileProps = {};

export const Profile: FC<ProfileProps> = () => {
  const navigate = useNavigate();
  const goBack = useCallback(() => {
    navigate('/arena');
  }, [navigate]);

  return (
    <div className='profile'>
      <Button className={'back_button'} onClick={goBack}>← Back</Button>
      <div className='profile_char'>
        <div className='profile_data'>
          <div className='profile_user'>
            <img className='profile_avatar' src={AvatarIcon} />
            <div className='profile_name'>
              <p>Drew Cano</p>
              <p>@gladiator1299</p>
              <p>
                <span>Level</span>
                <span>99</span>
              </p>
            </div>
          </div>
          <div className='profile_armour'>
            <span>Armour</span>
            <span>50</span>
          </div>
          <div className='profile_stats'>
            <p>
              <span>Strength</span>
              <span>22</span>
            </p>
            <p>
              <span>Agility</span>
              <span>12</span>
            </p>
            <p>
              <span>Vitality</span>
              <span>31</span>
            </p>
            <p>
              <span>Stamina</span>
              <span>41</span>
            </p>
          </div>
        </div>
        <div className='profile_equip'>
          <StatBar />
          <div className={'imgWrapper'}>
            <img className={'lock_img1'} src={LockSvg} />
            <img className={'lock_img2'} src={LockSvg} />
            <img className={'lock_img3'} src={LockSvg} />
            <img className={'lock_img4'} src={LockSvg} />
            <img className={'lock_img5'} src={LockSvg} />
            <img className={'char_svg'} src={CharSvg} />
            <img className={'lock_img6'} src={LockSvg} />
            <img className={'lock_img7'} src={LockSvg} />
            <img className={'lock_img8'} src={LockSvg} />
            <img className={'lock_img9'} src={LockSvg} />
          </div>
        </div>
      </div>
      <div className='profile_story'></div>
    </div>
  );
};
