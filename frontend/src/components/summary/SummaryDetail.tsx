import Edit from '../../assets/image/icon/Pencil.svg';
import styles from './Summary.module.css';
import useActivityStore from '../../store/useActivityStore';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

interface SummaryDetailProps {
  onEditClick: () => void;
  content: string;
}

function SummaryDetail({ onEditClick, content }: SummaryDetailProps) {
  const createActivityAi = useActivityStore((state) => state.createActivityAi);

  const navigate = useNavigate();

  const contentRef = useRef<HTMLDivElement>(null);

  const [maxLength, setMaxLength] = useState(0);
  const [lines, setLines] = useState({ firstLine: '', remaining: '' });

  const calculateMaxLength = (element: React.RefObject<HTMLDivElement>) => {
    if (!element.current) return 0;

    // 컨테이너 너비 가져오기
    const containerWidth = element.current.offsetWidth;

    // 글자 크기 및 평균 글자 너비 계산
    const computedStyle = getComputedStyle(element.current);
    const fontSize = parseFloat(computedStyle.fontSize); // 글자 크기 (px)

    // 한 줄에 들어갈 수 있는 최대 문자 수 계산
    return Math.floor(containerWidth / fontSize);
  };

  const splitFirstLine = (maxLength: number) => {
    const splitContent = content.split('\n');

    if (splitContent[0].length < maxLength) {
      return {
        firstLine: splitContent[0],
        remaining: splitContent.slice(1).join('\n'),
      };
    }
    // 첫 번째 줄이 maxChars보다 길면 처리
    return {
      firstLine: splitContent[0].slice(0, maxLength),
      remaining:
        splitContent[0].slice(maxLength) +
        (splitContent.slice(1).join('\n')
          ? '\n' + splitContent.slice(1).join('\n')
          : ''),
    };
  };

  const requestCreateActivity = async () => {
    await createActivityAi(content);
    navigate('extract');
  };

  useEffect(() => {
    const handleResize = () => {
      const newMaxLength = calculateMaxLength(contentRef);
      setMaxLength(newMaxLength);
    };

    // 초기 계산
    handleResize();

    // 윈도우 리사이즈 이벤트 등록
    window.addEventListener('resize', handleResize);

    // 컴포넌트 언마운트 시 이벤트 제거
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setLines(splitFirstLine(maxLength));
  }, [maxLength]);

  return (
    <>
      <section className={styles.contentbox}>
        <button className={styles.editbtn} onClick={onEditClick}>
          <img src={Edit} alt="수정" />
          <span className={styles.edit}>수정</span>
        </button>
        <div ref={contentRef} className={styles.content}>
          <p className={styles.firstLine}>{lines.firstLine}</p>
          <p>{lines.remaining}</p>
        </div>
      </section>
      <div className={styles.center}>
        <button className={styles.orangebtn} onClick={requestCreateActivity}>
          경험 추출
        </button>
      </div>
    </>
  );
}

export default SummaryDetail;
