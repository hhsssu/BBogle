import useActivityStore, { Activity } from '../../../store/useActivityStore';
import { NewActivity } from '../../../api/activityApi';
import ActivityStyles from '../../activity/Activity.module.css';
import styles from './ProjectActivity.module.css';
import Extract from '../../../assets/image/icon/Extract.svg';
import { useEffect } from 'react';

interface ProjectActivityDetailProps {
  activity: Activity | NewActivity | null;
}

function ProjectActivityDetail({ activity }: ProjectActivityDetailProps) {
  const fetchSelectedActivity = useActivityStore(
    (state) => state.fetchActivityById,
  );
  const selectedActivity = useActivityStore((state) => state.activity);

  useEffect(() => {
    // activity가 Activity 타입일 때만 activityId를 사용
    if (activity && 'activityId' in activity) {
      fetchSelectedActivity(activity.activityId);
    }
  }, [activity]);

  if (!activity) {
    return (
      <div className={ActivityStyles.nothing}>
        <img src={Extract} alt="경험 선택 전" style={{ width: `25%` }} />
        <p className={styles.description}>
          경험 카드의 돋보기 아이콘을 클릭해 주세요!
        </p>
      </div>
    );
  }

  const startDate = activity.startDate ? new Date(activity.startDate) : '';
  const endDate = activity.endDate ? new Date(activity.endDate) : '';
  return (
    <div className={styles.precontainer}>
      <div className={styles.previewtitle}>미리보기</div>
      <section className={`${styles.listbox} ${styles.detailbox}`}>
        <div className={`${styles.detailtitle} ${ActivityStyles.center}`}>
          {activity.title}
        </div>
        <div className={ActivityStyles.between}>
          {/* 키워드 나열 */}
          <div className={ActivityStyles.flex}>
            {activity.keywords.map((keyword, index) => (
              <div key={index}>
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
            ))}
          </div>

          {/* 경험 날짜 */}
          {startDate && endDate ? (
            <div className={`${ActivityStyles.flex} ${styles.date}`}>
              {startDate.toLocaleDateString()} ~ {endDate.toLocaleDateString()}
            </div>
          ) : (
            <div>-</div>
          )}
        </div>
        <div className={styles.content}>
          {'activityId' in activity
            ? selectedActivity.content
            : activity.content}
        </div>
      </section>
    </div>
  );
}

export default ProjectActivityDetail;
