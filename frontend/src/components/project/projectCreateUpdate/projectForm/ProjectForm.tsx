import style from './ProjectForm.module.css';

import useProjectStore from '../../../../store/useProjectStore';

import ProjectAlarmInput from './projectAlarmInput/ProjectAlarmInput';
import ProjectDetailInfoInput from './projectDetailInfoInput/ProjectDetailInfoInput';
import ProjectInfoInput from './projectInfoInput/ProjectInfoInput';
import ProjectTagInput from './projectTagInput/ProjectTagInput';

function ProjectForm() {
  const project = useProjectStore((state) => state.project);

  return (
    <div className={style.container}>
      <ProjectInfoInput
        image={project.image}
        title={project.title}
        description={project.description}
      />
      <ProjectDetailInfoInput
        startDate={project.startDate}
        endDate={project.endDate}
        memberCount={project.memberCount}
      />
      <ProjectTagInput role={project.role} skill={project.skill} />
      {project.status && (
        <ProjectAlarmInput
          notificationStatus={project.notificationStatus}
          notificationTime={project.notificationTime}
        />
      )}
    </div>
  );
}

export default ProjectForm;
