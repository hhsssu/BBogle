import style from './ProjectDetailInfoInput.module.css';
import useProjectStore from '../../../../../store/useProjectStore';

interface Props {
  startDate: string;
  endDate: string;
  memberCount: number;
}

function ProjectDetailInfoInput({ startDate, endDate, memberCount }: Props) {
  const updateProject = useProjectStore((state) => state.updateProjectField);

  const { termError, setTermError, setErrMsgOn } = useProjectStore();

  const handleTermError = (value: boolean) => {
    setTermError(value);

    if (!termError) {
      setErrMsgOn(false);
    }
  };

  const handleStartDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    updateProject('startDate', value);
    handleTermError(false);
  };

  const handleFinishDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    updateProject('endDate', value);
    handleTermError(false);
  };

  const handleMemberCount = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target) {
      updateProject('memberCount', Number(event.target.value));
    }
  };

  return (
    <div className={style.container}>
      <div className={style.inputLabel}>
        <p className={style.label}>
          <span>프로젝트 기간</span>
          <span className={style.requiredMark}>*</span>
        </p>
        <div
          className={`${style.termInputContainer} ${termError && style.termError}`}
        >
          <div className={style.termSection}>
            <div className={style.dateWrapper}>
              <p className={style.dateLabel}>시작일</p>
              <input
                className={style.dateInput}
                type="date"
                max={endDate}
                value={startDate}
                onChange={handleStartDate}
              />
            </div>
            {/* <span className={style.separator}>~</span> */}
            <div className={style.dateWrapper}>
              <p className={style.dateLabel}>종료일</p>
              <input
                className={style.dateInput}
                type="date"
                min={startDate}
                value={endDate}
                onChange={handleFinishDate}
              />
            </div>
          </div>
          {termError && (
            <span className={style.error}>
              프로젝트 기간을 확인해주세요(미입력/입력오류)
            </span>
          )}
        </div>
      </div>

      <div className={style.inputLabel}>
        <span className={style.label}>프로젝트 인원</span>
        <div>
          <select
            className={style.selectInput}
            value={memberCount}
            onChange={handleMemberCount}
          >
            {Array.from({ length: 10 }, (_, index) => (
              <option
                className={style.selectOption}
                key={index + 1}
                value={index + 1}
              >
                {index + 1}
              </option>
            ))}
          </select>
          명
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailInfoInput;
