import style from './ProjectInfoInput.module.css';

import DefaultProject from '../../../../../assets/image/icon/DefaultProject.svg';
import ImageWithDefault from '../../../../my/ImageWithDefault';

import { useRef } from 'react';
import useProjectStore from '../../../../../store/useProjectStore';

interface Props {
  image: string | null;
  title: string;
  description: string;
}

function ProjectInfoInput({ image, title, description }: Props) {
  const updateProject = useProjectStore((state) => state.updateProjectField);
  const { setProjectImage, titleError, setTitleError, setErrMsgOn } =
    useProjectStore();

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const SUPPORTED_FORMATS = ['image/jpeg', 'image/png']; // 지원하는 파일 형식

  const imgInputRef = useRef<HTMLInputElement>(null);

  const handleImgClick = () => {
    if (imgInputRef.current) {
      imgInputRef.current.click();
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // 파일 크기 및 형식 확인
      if (file.size > MAX_FILE_SIZE) {
        alert('이미지 파일 크기는 5MB를 초과할 수 없습니다.');
        return;
      }
      if (!SUPPORTED_FORMATS.includes(file.type)) {
        alert('지원하는 이미지 형식은 JPG, PNE입니다.');
        return;
      }

      uploadPreviewImage(file);
      setProjectImage(file);
    }
  };

  const uploadPreviewImage = (file: File) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      updateProject('image', reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleTitleError = (value: boolean) => {
    setTitleError(value);

    if (!titleError) {
      setErrMsgOn(false);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    updateProject('title', value);
    if (value !== '') {
      handleTitleError(false);
    }
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = event.target.value;
    updateProject('description', value);
  };

  return (
    <div className={style.container}>
      <div className={style.inputLabel}>
        <p className={style.label}>
          <span>대표이미지/프로젝트명</span>
          <span className={style.requiredMark}>*</span>
        </p>
        <div className={style.titleContainer}>
          <div className={style.img}>
            <ImageWithDefault
              src={image}
              alt="로고"
              defaultSrc={DefaultProject}
              onClick={handleImgClick}
            />
          </div>

          <input
            className={style.hiddenInput}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={imgInputRef}
          />
          <div className={style.titleInputContainer}>
            <input
              className={`${style.titleInput} ${titleError && style.titleError}`}
              type="text"
              maxLength={20}
              value={title}
              onChange={handleTitleChange}
              placeholder="프로젝트 이름을 입력하세요 (최대 20자)"
            />
            {titleError && (
              <span className={style.error}>
                프로젝트 명은 필수 입력값입니다.
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={style.inputLabel}>
        <span className={style.label}>프로젝트 개요</span>
        <textarea
          className={style.description}
          rows={3}
          maxLength={100}
          value={description}
          placeholder="프로젝트 설명을 입력하세요 (최대 100자)"
          onChange={handleDescriptionChange}
        ></textarea>
      </div>
    </div>
  );
}

export default ProjectInfoInput;
