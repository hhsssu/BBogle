import style from './My.module.css';

// 이미지 import
import Alarm from '../../assets/image/icon/Alarm.svg';
import Warn from '../../assets/image/icon/Warn.svg';
import { useState } from 'react';

function AlarmPermissinon() {
  const [permission, setPermission] = useState(true);

  return (
    <div
      className={`${style.permission} ${permission ? style.allow : style.deny}`}
    >
      <div className={style.header}>
        <img
          className={style.icon}
          src={permission ? Alarm : Warn}
          alt={permission ? '활성화 상태' : '비활성화 상태'}
        />
        <div className={style.alarmGuide}>
          {permission ? '알림 권한이 켜져 있어요' : '알림 권한이 꺼져 있어요'}
        </div>
        <label className={style.switch}>
          <input
            type="checkbox"
            checked={permission}
            onChange={() => setPermission(!permission)}
          />
          <span className={style.slider}></span>
        </label>
      </div>
      <div className={style.guideDetail}>
        {permission ? (
          '지금 뽀글의 알림을 받고 있어요 !'
        ) : (
          <div>
            뽀글이 보내드리는{' '}
            <span style={{ fontWeight: 700 }}>개발일지 작성 알림</span>을
            받아보실래요 ?
          </div>
        )}
      </div>
    </div>
  );
}

export default AlarmPermissinon;
