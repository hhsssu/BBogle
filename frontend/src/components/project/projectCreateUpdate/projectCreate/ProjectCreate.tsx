import style from '../ProjectCreateUpdate.module.css';

import Back from '../../../../assets/image/icon/Back.svg';
import AlertTriangle from '../../../../assets/image/icon/AlertTriangle.svg';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useProjectStore from '../../../../store/useProjectStore';

import ProjectForm from '../projectForm/ProjectForm';
import Modal from '../../../common/modal/Modal';
import { addProject } from '../../../../api/projectApi';

function ProjectCreate() {
  const navigate = useNavigate();

  const project = useProjectStore((state) => state.project);
  const projectImage = useProjectStore((state) => state.projectImage);
  const initProject = useProjectStore((state) => state.initProject);

  const {
    titleError,
    setTitleError,
    termError,
    setTermError,
    errMsgOn,
    setErrMsgOn,
  } = useProjectStore();

  const [isBackModalOpen, setBackModalOpen] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const navPjtList = () => {
    navigate('/project');
  };

  const handleBackModal = () => {
    setBackModalOpen(!isBackModalOpen);
  };

  const handleCreateModal = () => {
    setCreateModalOpen(!isCreateModalOpen);
  };

  const submitForm = () => {
    if (project.title === '') {
      setTitleError(true);
      setErrMsgOn(true);
      return;
    }

    if (project.startDate === '' || project.endDate === '') {
      setTermError(true);
      setErrMsgOn(true);
      return;
    }

    setCreateModalOpen(true);
  };

  const createProject = async () => {
    setCreateModalOpen(!isCreateModalOpen);

    await addProject(project, projectImage);
    navigate('/project');
  };

  useEffect(() => {
    initProject();
    setTitleError(false);
    setTermError(false);
    setErrMsgOn(false);
  }, []);

  return (
    <div>
      <div className={style.container}>
        <div className={style.backBtn} onClick={handleBackModal}>
          <img src={Back} alt="뒤로가기 버튼" />
          프로젝트 목록
        </div>

        <span className={style.pageTitle}>프로젝트 생성</span>
        <div className={style.pjtFormWrapper}>
          <ProjectForm />
          <button
            className={`${style.submitBtn} ${(titleError || termError) && errMsgOn && style.failBtn}`}
            onClick={submitForm}
          >
            완료
          </button>
          {errMsgOn && (
            <div className={style.errMsg}>
              <img className={style.warnIcon} src={AlertTriangle} alt="경고" />
              필수 입력값을 확인해주세요{' '}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isBackModalOpen}
        title={'이 페이지를 벗어나시겠어요?'}
        content={'작성 내용이 초기화됩니다.'}
        onClose={handleBackModal}
        onConfirm={navPjtList}
        confirmText={'이동'}
        cancleText={'취소'}
      />

      <Modal
        isOpen={isCreateModalOpen}
        title={'프로젝트를 생성하시겠어요?'}
        content={''}
        onClose={handleCreateModal}
        onConfirm={createProject}
        confirmText={'확인'}
        cancleText={'취소'}
      />
    </div>
  );
}

export default ProjectCreate;
