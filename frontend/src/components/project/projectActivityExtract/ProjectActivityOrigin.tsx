import useActivityStore from '../../../store/useActivityStore';
import { Activity } from '../../../store/useActivityStore';

import styles from './ProjectActivity.module.css';

import { useEffect, useState } from 'react';
import ProjectActivityList from './ProjectActivityList';
import { useParams } from 'react-router-dom';

interface ProjectActivityOriginProps {
  setSelectedActivity: (activity: Activity) => void;
  setSelectedOriginActivities: (activities: number[]) => void;
}

function ProjectActivityOrigin({
  setSelectedActivity,
  setSelectedOriginActivities,
}: ProjectActivityOriginProps) {
  // 해당 프로젝트 기존 경험 가져오기
  const pjtActivities = useActivityStore((state) => state.pjtActivities);
  const fetchPjtActivities = useActivityStore(
    (state) => state.fetchPjtActivities,
  );
  const { pjtId } = useParams();
  const [isSelectedActivities, setIsSelectedActivities] = useState<{
    [key: number]: boolean;
  }>({});

  // 모든 항목이 선택된 상태인지 여부를 저장
  const [isAllSelected, setIsAllSelected] = useState(false);

  useEffect(() => {
    // 원래 저장된 프로젝트 경험 가져오기
    fetchPjtActivities(null, [], [Number(pjtId)]);
    // 처음 진입 시 모두 선택되게 함
    if (!isAllSelected) {
      handleSelectAll();
    }
  }, []);

  useEffect(() => {
    const allSelected =
      pjtActivities.length > 0 &&
      pjtActivities.every((activity) => {
        return activity.activityId !== undefined
          ? isSelectedActivities[activity.activityId]
          : false;
      });
    setIsAllSelected(allSelected);

    // 부모로 선택된 활동 ID 전달
    const selectedIds = Object.entries(isSelectedActivities)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => Number(id));
    setSelectedOriginActivities(selectedIds);
  }, [isSelectedActivities]);

  // 미리보기 선택 처리 함수
  const handlePreview = (activityId: number) => {
    const activity = pjtActivities.find(
      (activity) => activity.activityId === activityId,
    );
    if (activity) {
      setSelectedActivity(activity); // 선택된 activity 전달
    }
  };

  // 경험 단일 선택/해제 처리 함수
  const handleSelect = (activityId: number) => {
    setIsSelectedActivities((prevSelected) => ({
      ...prevSelected,
      [activityId]: !prevSelected[activityId], // 선택 상태를 토글
    }));
  };

  // 모든 경험 선택/해제 처리 함수
  const handleSelectAll = () => {
    // 선택 또는 해제된 상태에 따라 모든 활동을 선택하거나 해제
    const newSelectedState = !isAllSelected;
    const updatedSelectedActivities = pjtActivities.reduce(
      (acc, activity) => {
        if (activity.activityId !== undefined)
          acc[activity.activityId] = newSelectedState;
        return acc;
      },
      {} as { [key: number]: boolean },
    );

    setIsSelectedActivities(updatedSelectedActivities);
    setIsAllSelected(newSelectedState);
  };

  return (
    <div className={styles.listcontainer}>
      <section className={styles.between}>
        <div className={`${styles.origintitle} ${styles.center}`}>기존</div>
        <button onClick={handleSelectAll} className={styles.all}>
          {isAllSelected ? '선택 해제' : '모두 선택'}
        </button>
      </section>

      <ProjectActivityList
        activities={pjtActivities}
        selectedActivities={isSelectedActivities}
        handleSelect={handleSelect}
        handlePreview={handlePreview}
      />
    </div>
  );
}

export default ProjectActivityOrigin;
