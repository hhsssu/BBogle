import style from './DiaryImgInput.module.css';

import ImageUpload from '../../../../../assets/image/default/Image.svg';
import Close from '../../../../../assets/image/icon/Close.svg';

import { useEffect, useRef, useState } from 'react';
import useDiaryStore from '../../../../../store/useDiaryStore';

interface Props {
  index: number;
  question: string;
  description: string;
  addCircleRef: (ref: React.RefObject<HTMLDivElement>) => void;
}

function DiaryImgInput({ index, question, description, addCircleRef }: Props) {
  const circleRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { imageList, updateImgList, deleteImage } = useDiaryStore();

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const SUPPORTED_FORMATS = ['image/jpeg', 'image/png']; // 지원하는 파일 형식

  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleImgUploadClick = () => {
    if (fileInputRef.current && imageList.size < 3) {
      fileInputRef.current.click();
    }
  };

  // 파일 드래그 시, 새 창에서 열지 못하게 막기
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];

    if (file) {
      validateFile(file);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      validateFile(file);
    }
  };

  const validateFile = (file: File) => {
    if (file) {
      // 파일 크기 및 형식 확인
      if (file.size > MAX_FILE_SIZE) {
        alert('이미지 파일 크기는 5MB를 초과할 수 없습니다.');
        return;
      }
      if (!SUPPORTED_FORMATS.includes(file.type)) {
        alert('지원하는 이미지 형식은 PNG, JPG입니다.');
        return;
      }
    }

    uploadPreviewImage(file);

    // updateImgFile(file);
  };

  const uploadPreviewImage = (file: File) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      // updateImgUrl(reader.result as string);
      updateImgList(reader.result as string, file);
    };

    reader.readAsDataURL(file);

    // 업로드 진행률 시뮬레이션
    let progress = 0;
    const interval = setInterval(() => {
      if (progress < 100) {
        progress += 10;
        setUploadProgress(progress);
      } else {
        clearInterval(interval);
      }
    }, 100);
  };

  const handleImageDelete = (deleteUrl: string) => {
    deleteImage(deleteUrl);
  };

  useEffect(() => {
    addCircleRef(circleRef);
  }, []);

  return (
    <div className={style.container}>
      <div className={style.questionContainer}>
        <div ref={circleRef} className={style.outerCircle}>
          <div className={style.innerCircle}>{index}</div>
        </div>
        <span className={style.question}>{question}</span>
      </div>
      <p className={style.description}>{description}</p>
      <div className={style.imgContainer}>
        {imageList.size > 0 && (
          <div className={style.imgInputBlock}>
            {[...imageList.keys()].map((key, i) => (
              <div key={i} className={style.imgExBlock}>
                <img key={i + 'img'} className={style.imgEx} src={key}></img>
                <img
                  key={i + 'Close'}
                  className={style.close}
                  src={Close}
                  alt="삭제"
                  onClick={() => handleImageDelete(key)}
                />
              </div>
            ))}
          </div>
        )}

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className={style.progressBarContainer}>
            <div
              className={style.progressBar}
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        {imageList.size < 3 && (
          <div
            className={style.imgInputInfo}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleImgUploadClick}
          >
            <img
              className={style.imgIcon}
              src={ImageUpload}
              alt="이미지 업로드"
            />
            <div>
              <p>이미지 끌어 업로드 or 이미지 선택하기</p>
              <p>지원형식 : PNG, JPG</p>
            </div>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        className={style.hiddenInput}
        type="file"
        onChange={handleImageUpload}
      ></input>
    </div>
  );
}

export default DiaryImgInput;
