import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useActivityStore from '../../../store/useActivityStore';

import { deleteActivity } from '../../../api/activityApi';

import ActivityStyles from '../Activity.module.css';
import ActivityDetailStyles from './ActivityDetail.module.css';

import EditIcon from '../../../assets/image/icon/Pencil.svg';
import DeleteIcon from '../../../assets/image/icon/RedTrash.svg';
import BackIcon from '../../../assets/image/icon/Back.svg';
import Loading from '../../common/loading/Loading';
import Bubble from '../../../assets/lottie/Bubble.json';
import Modal from '../../common/modal/Modal';
import NotFoundPage from '../../../pages/NotFoundPage';

function ActivityDetail() {
  const navigate = useNavigate();
  const { activityId } = useParams();
  const numericActivityId = activityId ? parseInt(activityId, 10) : 0;

  const activity = useActivityStore((state) => state.activity);
  const fetchActivityById = useActivityStore(
    (state) => state.fetchActivityById,
  );
  const isActivityLoading = useActivityStore(
    (state) => state.isActivityLoading,
  );

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  // 수정 이동
  const NavEdit = () => {
    navigate(`/activity/update/${numericActivityId}`);
  };

  // 삭제 모달
  const handleDeleteModal = () => {
    setDeleteModalOpen(!isDeleteModalOpen);
  };

  // 삭제
  const handleDeleteActivity = async () => {
    setDeleteModalOpen(!isDeleteModalOpen);

    await deleteActivity(numericActivityId);
    navigate('/activity');
  };

  // 돌아가기
  const handleGoBack = () => {
    navigate('/activity');
  };

  useEffect(() => {
    if (numericActivityId) {
      fetchActivityById(numericActivityId);
    }
  }, [numericActivityId]);

  if (isActivityLoading) {
    return (
      <Loading
        isLoading={isActivityLoading}
        title="데이터 로딩 중 ..."
        animationData={Bubble}
      />
    );
  }

  // 유효하지 않은 경험일 경우 NotFoundPage 렌더링
  if (!activity || activity.activityId !== numericActivityId) {
    return <NotFoundPage />;
  }

  const startDate = activity.startDate ? new Date(activity.startDate) : null;
  const endDate = activity.endDate ? new Date(activity.endDate) : null;
  if (!activity) {
    return <NotFoundPage />;
  }

  return (
    <>
      <div className={ActivityStyles.backBtn} onClick={handleGoBack}>
        <img src={BackIcon} alt="돌아가기" />
        돌아가기
      </div>
      <div className={`${ActivityStyles.center} ${ActivityStyles.title}`}>
        경험 상세
      </div>

      {/* 경험 정보 */}
      <section className={ActivityDetailStyles.container}>
        {/* 제목 */}
        <p className={ActivityStyles.semibold}>제목</p>
        <div>{activity.title}</div>

        {/* 시작일 ~ 종료일 */}
        <p className={ActivityStyles.semibold}>경험 기간</p>
        {startDate && endDate ? (
          <div className={ActivityDetailStyles.date}>
            {startDate.toLocaleDateString()} ~ {endDate.toLocaleDateString()}
          </div>
        ) : (
          <div>-</div>
        )}

        {/* 프로젝트 명 */}
        <p className={ActivityStyles.semibold}>프로젝트 명</p>
        {activity.projectTitle ? (
          <div>{activity.projectTitle}</div>
        ) : (
          <div>-</div>
        )}

        {/* 경험 태그 */}
        <p className={ActivityStyles.semibold}>관련 키워드</p>
        <div className={ActivityStyles.flex}>
          {activity.keywords.length > 0 ? (
            activity.keywords
              .filter((keyword) => keyword !== null)
              .map((keyword, index) => (
                <div key={index}>
                  {/* 기술태그 0 blue / 인성태그 1 yellow */}
                  {!keyword.type ? (
                    <span className={ActivityStyles.bluekeyword}>
                      {keyword.name}
                    </span>
                  ) : (
                    <span className={ActivityStyles.yellowkeyword}>
                      {keyword.name}
                    </span>
                  )}
                </div>
              ))
          ) : (
            <div>-</div>
          )}
        </div>
      </section>

      <p className={ActivityDetailStyles.content}>{activity.content}</p>

      {/* 수정 & 삭제 버튼 */}
      <section className={ActivityStyles.flex}>
        <button
          onClick={NavEdit}
          className={`${ActivityStyles.flex} ${ActivityDetailStyles.margin}`}
        >
          <img src={EditIcon} alt="수정" />
          <span className={`${ActivityStyles.gray} ${ActivityStyles.small}`}>
            수정
          </span>
        </button>
        <button onClick={handleDeleteModal} className={ActivityStyles.flex}>
          <img src={DeleteIcon} alt="삭제" />
          <span className={`${ActivityStyles.red} ${ActivityStyles.small}`}>
            삭제
          </span>
        </button>
      </section>

      <Modal
        isOpen={isDeleteModalOpen}
        title={'정말 경험을 삭제하시겠어요?'}
        content={'삭제 시 복구가 어려워요'}
        onClose={handleDeleteModal}
        onConfirm={handleDeleteActivity}
        confirmText={'확인'}
        cancleText={'취소'}
      />
    </>
  );
}

export default ActivityDetail;
