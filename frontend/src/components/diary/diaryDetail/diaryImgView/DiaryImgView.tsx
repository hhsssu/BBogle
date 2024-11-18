import style from './DiaryImgView.module.css';

import Download from '../../../../assets/image/icon/Download.svg';
import useDiaryStore from '../../../../store/useDiaryStore';

interface Props {
  index: number;
  question: string;
  circleRef: React.RefObject<HTMLDivElement> | null;
}

function DiaryImgView({ index, question, circleRef }: Props) {
  const { title, imageList } = useDiaryStore();

  const handleImageDownload = (index: number, url: string) => {
    if (!url) return;

    fetch(url + '?' + new Date().getTime(), { method: 'GET' })
      .then((res) => {
        return res.blob();
      })
      .then((blob) => {
        const blobURL = URL.createObjectURL(blob);

        // a 태그 생성 및 다운로드 속성 설정
        const link = document.createElement('a');
        link.href = blobURL;
        link.download = `${title}_${index + 1}.jpg`; // 파일명 설정
        link.click();

        // a 태그 제거
        link.remove();
      });
  };

  return (
    <div className={style.container}>
      <div className={style.questionContainer}>
        <div ref={circleRef} className={style.outerCircle}>
          <div className={style.innerCircle}>{index}</div>
        </div>
        <span className={style.question}>{question}</span>
      </div>

      <div className={style.imgContainer}>
        {[...imageList.keys()].map((url, index) => (
          <div key={index} className={style.imgExBlock}>
            <img key={index + 'img'} className={style.imgEx} src={url}></img>
            <img
              key={index + 'Download'}
              className={style.download}
              src={Download}
              alt="삭제"
              onClick={() => handleImageDownload(index, url)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default DiaryImgView;
