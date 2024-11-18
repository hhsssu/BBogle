import ActivityCard from '../../activity/ActivityCard';
import { Activity } from '../../../store/useActivityStore';
import { NewActivity } from '../../../api/activityApi';

import styles from './ProjectActivity.module.css';
import ActivityStyles from '../../activity/Activity.module.css';

import EmptyFolder from '../../../assets/image/icon/EmptyFolder.svg';

interface ProjectActivityProps {
  activities: Activity[] | NewActivity[];
  selectedActivities: { [key: number]: boolean };
  handleSelect: (activityId: number) => void;
  handlePreview: (activityId: number) => void;
}

function ProjectActivityList({
  activities,
  selectedActivities,
  handleSelect,
  handlePreview,
}: ProjectActivityProps) {
  return (
    <section className={styles.listbox}>
      {activities.length > 0 ? (
        activities.map((activityCard, index) => {
          // `activityId`가 없으면 `-1`을 할당
          const activityId =
            'activityId' in activityCard ? activityCard.activityId : index;

          return (
            <div key={index} className={styles.cardmargin}>
              <ActivityCard
                activityId={activityId}
                title={activityCard.title}
                startDate={new Date(activityCard.startDate)}
                endDate={new Date(activityCard.endDate)}
                projectTitle={activityCard.projectTitle ?? ''}
                keywords={activityCard.keywords}
                isExtract={true}
                isSelected={!!selectedActivities[activityId]}
                onClick={() => handleSelect(activityId)}
                onPreviewClick={() => handlePreview(activityId)}
              />
            </div>
          );
        })
      ) : (
        <>
          <div></div>
          <div className={ActivityStyles.nothing}>
            <img
              src={EmptyFolder}
              alt="비어있는 경험"
              style={{ width: `25%` }}
            />
            <p>경험이 비어있어요</p>
          </div>
        </>
      )}
    </section>
  );
}

export default ProjectActivityList;
