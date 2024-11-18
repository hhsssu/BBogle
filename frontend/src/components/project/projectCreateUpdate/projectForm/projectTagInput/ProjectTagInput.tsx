import style from './ProjectTagInput.module.css';

import TagSection from './tagSection/TagSection';

interface Props {
  role: string[];
  skill: string[];
}

function ProjectTagInput({ role, skill }: Props) {
  return (
    <div className={style.container}>
      <TagSection label={'나의 역할'} array={role} name={'role'} />
      <TagSection label={'사용 기술'} array={skill} name={'skill'} />
    </div>
  );
}

export default ProjectTagInput;
