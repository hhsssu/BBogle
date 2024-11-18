import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import EmptySummary from '../../assets/image/icon/EmptySummary.svg';

import styles from './Summary.module.css';
import SummaryDetail from './SummaryDetail';
import SummaryUpdate from './SummaryUpdate';
import SummaryCreate from './SummaryCreate';
import useSummaryStore from '../../store/useSummaryStore';
import Loading from '../common/loading/Loading';
import Activity from '../../assets/lottie/Activity.json';
import Bubble from '../../assets/lottie/Bubble.json';
import Retrospect from '../../assets/lottie/Retrospect.json';
import useActivityStore from '../../store/useActivityStore';

function Summary() {
  const summary = useSummaryStore((state) => state.summary);
  const isSummaryLoading = useSummaryStore((state) => state.isSummaryLoading);
  const isActivityLoading = useActivityStore(
    (state) => state.isActivityLoading,
  );
  const isSummaryCreateLoading = useSummaryStore(
    (state) => state.isSummaryCreateLoading,
  );
  const { fetchSummaryInfo, createSummaryAi } = useSummaryStore();
  const { pjtId } = useParams();

  useEffect(() => {
    fetchSummaryInfo(Number(pjtId));
  }, [pjtId]);

  useEffect(() => {
    if (summary.summaryId !== -1 && summary.content !== '') {
      setOpenSection(true);
    } else {
      setOpenSection(false); // 회고가 없으면 섹션을 닫기
    }
  }, [summary]);

  const [openSection, setOpenSection] = useState(false);
  const [detailSection, setDetailSection] = useState(true);
  const [createSection, setCreateSection] = useState(false);

  // 수정 컴포넌트 보이기
  const handleEdit = () => {
    setDetailSection(false);
  };

  // 수동 작성 컴포넌트 보이기
  const handleCreate = () => {
    setCreateSection(true);
  };

  // 작성 취소
  const handleCancleEdit = () => {
    setDetailSection(true);
    setCreateSection(false);
  };

  //TODO 회고 AI 생성 API 연결
  const handleCreateAi = () => {
    createSummaryAi(Number(pjtId));
  };

  if (isSummaryLoading) {
    return (
      <Loading
        isLoading={isSummaryLoading}
        title="데이터 로딩 중 ..."
        animationData={Bubble}
      />
    );
  }

  // 경험 추출 로딩
  if (isActivityLoading) {
    return (
      <Loading
        isLoading={isActivityLoading}
        title="경험 추출 중 ..."
        animationData={Activity}
      />
    );
  }

  // 회고 생성 로딩
  if (isSummaryCreateLoading) {
    return (
      <Loading
        isLoading={isSummaryCreateLoading}
        title="회고 생성 중 ..."
        animationData={Retrospect}
      />
    );
  }

  return (
    <>
      {/* 회고가 있으면 */}
      {openSection ? (
        // 회고 버튼 수정 클릭 유무
        detailSection ? (
          <SummaryDetail onEditClick={handleEdit} content={summary.content} />
        ) : (
          <SummaryUpdate
            onCancleClick={handleCancleEdit}
            onUpdateSuccess={() => {
              setDetailSection(true), setCreateSection(false);
            }}
            projectId={Number(pjtId)}
            summary={summary}
          />
        )
      ) : !createSection ? (
        <section>
          <div className={styles.center}>
            <img src={EmptySummary} alt="회고 없음" />
            <p className={styles.description}>
              생성된 회고록이 없어요
              <br />
              <strong className={styles.bold}>회고록을 생성해 볼까요?</strong>
            </p>
          </div>
          <div className={styles.center}>
            <button className={styles.orangebtn} onClick={handleCreateAi}>
              AI 생성하기
            </button>
            <button className={styles.blackbtn} onClick={handleCreate}>
              직접 작성하기
            </button>
          </div>
        </section>
      ) : (
        <SummaryCreate
          onCancleClick={handleCancleEdit}
          onUpdateSuccess={() => {
            setDetailSection(true), setCreateSection(false);
          }}
          projectId={Number(pjtId)}
          summary={summary}
        />
      )}
    </>
  );
}

export default Summary;
