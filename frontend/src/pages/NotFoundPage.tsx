import { useNavigate } from 'react-router-dom';
import SummaryStyles from '../components/summary/Summary.module.css';
import ActivityStyles from '../components/activity/Activity.module.css';
import NotFound from '../assets/image/icon/NotFound.svg';

function NotFoundPage() {
  const navigate = useNavigate();

  // 돌아가기
  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <div className={SummaryStyles.center} style={{ marginTop: '25vh' }}>
      <div style={{ textAlign: 'center' }}>
        <img src={NotFound} alt="잘못된 페이지" style={{ width: '80%' }} />
        <div
          className={`${ActivityStyles.title}`}
          style={{ marginBottom: '3vh' }}
        >
          잘못된 접근입니다.
        </div>
        <button onClick={handleGoBack} className={`${SummaryStyles.orangebtn}`}>
          돌아가기
        </button>
      </div>
    </div>
  );
}

export default NotFoundPage;
