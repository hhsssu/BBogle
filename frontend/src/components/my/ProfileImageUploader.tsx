import React, { useEffect, useState } from 'react';
import style from './ProfileImageUploader.module.css';
import ImageWithDefault from './ImageWithDefault';
import { updateUserProfile } from '../../api/authApi';
import useUserStore from '../../store/useUserStore';

// 이미지 파일
import DownloadIcon from '../../assets/image/icon/Download.svg';
import DefaultImage from '../../assets/image/default/Image.svg';
import DefaultProfile from '../../assets/image/default/Profile.svg';

interface ProfileImageUploaderProps {
  initialImage: null | string;
  onComplete: () => void;
}

function ProfileImageUploader({
  initialImage,
  onComplete,
}: ProfileImageUploaderProps) {
  // 미리보기 이미지 상태 및 업로드 진행률 상태 관리
  const [previewImage, setPreviewImage] = useState<string | null>(initialImage);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { updateProfile } = useUserStore();

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const SUPPORTED_FORMATS = ['image/jpeg', 'image/png']; // 지원하는 파일 형식

  useEffect(() => {
    if (initialImage) setPreviewImage(initialImage);
  }, [initialImage]);

  // 파일 선택 시 호출되는 함수
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

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

      uploadImage(file);
    }
  };

  // 파일 드롭 시 호출되는 함수
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files && event.dataTransfer.files[0];
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

      uploadImage(file);
    }
  };

  // 드래그 오버 시 기본 동작을 막는 함수
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // 이미지 업로드 처리 함수
  const uploadImage = (file: File) => {
    const reader = new FileReader();

    // 파일 읽고, 미리보기 이미지 업데이트
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };

    // 파일을 Data URL로 변환
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
    }, 100); // Increment every 100ms for simulation
  };

  // 미리보기 이미지를 다운로드하는 함수
  const downloadImage = () => {
    if (previewImage) {
      fetch(previewImage + '?' + new Date().getTime(), { method: 'GET' })
        .then((res) => {
          return res.blob();
        })
        .then((blob) => {
          const blobURL = URL.createObjectURL(blob);

          // a 태그 생성 및 다운로드 속성 설정
          const link = document.createElement('a');
          link.href = blobURL;
          link.download = `uploaded_image.png`; // 파일명 설정
          link.click();

          // a 태그 제거
          link.remove();
        });
    }
  };

  // 프로필 이미지 업데이트를 관리하는 함수
  const handleUpdate = async () => {
    if (!previewImage || previewImage === initialImage) {
      alert('업로드할 이미지를 선택해주세요.');
      return;
    }

    // File 객체로 변환
    // 미리보기 이미지 URL을 통해 이미지 데이터 가져옴
    const response = await fetch(previewImage);

    //  Blob으로 변환
    const blob = await response.blob();

    // Blob 객체를 사용해 새로운 File 객체 생성
    const file = new File([blob], 'profile_image.png', { type: blob.type });

    // Form Data 생성
    const formData = new FormData();
    formData.append('profileImage', file);

    updateUserProfile(formData || null);
    updateProfile(previewImage);

    onComplete(); // 수정 완료 후 모달 닫기
  };

  return (
    <div className={style.container}>
      <div className={style.imgContainer}>
        <div className={style.profile}>
          <div className={style.preview}>
            {previewImage ? (
              <ImageWithDefault
                src={previewImage}
                alt="미리보기"
                defaultSrc={DefaultProfile}
              />
            ) : (
              <p>미리보기</p>
            )}
          </div>
          {previewImage && (
            <img
              src={DownloadIcon}
              alt="다운로드"
              className={style.downloadButton}
              onClick={downloadImage}
            />
          )}
        </div>

        <div
          className={style.dropZone}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <img src={DefaultImage} alt="이미지" />
          <p>이미지 끌어 업로드 or 이미지 선택하기</p>
          <p>지원형식 : PNG, JPG</p>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className={style.fileInput}
          />
        </div>
      </div>

      <div className={style.bottom}>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className={style.progressBarContainer}>
            <div
              className={style.progressBar}
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
        <button onClick={handleUpdate}>수정 완료</button>
      </div>
    </div>
  );
}

export default ProfileImageUploader;
