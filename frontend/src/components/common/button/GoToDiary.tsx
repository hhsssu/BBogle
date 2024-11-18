import style from './GoToDiary.module.css';
import MemoIcon from '../../../assets/image/icon/Memo.svg';

interface GoToDiaryProps {
  isInactive?: boolean;
  onClick: () => void;
}

function GoToDiary({ isInactive, onClick }: GoToDiaryProps) {
  return (
    <button
      className={`${style.button} ${isInactive ? style.inActive : ''}`}
      disabled={isInactive}
      onClick={onClick}
    >
      <img className={style.memo} src={MemoIcon} alt="Memo" />
      <div className={style.description}>개발일지 남기러 가기</div>
    </button>
  );
}

export default GoToDiary;
