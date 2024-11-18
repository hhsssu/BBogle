import style from './ProjectAlarmInput.module.css';

import ToggleOn from '../../../../../assets/image/icon/ToggleOn.svg';
import ToggleOff from '../../../../../assets/image/icon/ToggleOff.svg';

import useProjectStore from '../../../../../store/useProjectStore';

interface Props {
  notificationStatus: boolean;
  notificationTime: string;
}

function ProjectAlarmInput({ notificationStatus, notificationTime }: Props) {
  const updateProject = useProjectStore((state) => state.updateProjectField);

  const handleToggleState = () => {
    updateProject('notificationStatus', !notificationStatus);
  };

  const handleTime = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time = event.target.value;
    updateProject('notificationTime', time);
  };

  return (
    <div className={style.inputLabel}>
      <span className={style.label}>알림 설정</span>
      <div className={style.alarmToggleContainer}>
        {notificationStatus ? (
          <img
            className={style.toggle}
            src={ToggleOn}
            onClick={handleToggleState}
          />
        ) : (
          <img
            className={style.toggle}
            src={ToggleOff}
            onClick={handleToggleState}
          />
        )}

        {notificationStatus ? (
          <div>
            <input
              className={style.timeInput}
              type="time"
              value={notificationTime}
              onChange={handleTime}
            />
          </div>
        ) : (
          <div className={style.toggleInActive}>
            <span>오후 </span>
            <span>05:30</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectAlarmInput;
