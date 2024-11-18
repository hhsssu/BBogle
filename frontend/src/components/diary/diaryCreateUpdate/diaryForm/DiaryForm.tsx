import style from './DiaryForm.module.css';

import React, { useEffect, useRef } from 'react';

import useDiaryStore from '../../../../store/useDiaryStore';
import DiaryEntryInput from './diaryEntryInput/DiaryEntryInput';
import DiaryImgInput from './diaryImgInput/DiaryImgInput';

function DiaryForm() {
  const questionList = useDiaryStore((state) => state.questionList);
  const answerList = useDiaryStore((state) => state.answerList);

  const lineRefArr = useRef<React.RefObject<HTMLDivElement>[]>([]);
  const questionRefArr = useRef<React.RefObject<HTMLDivElement>[]>([]);
  const circleRefArr = useRef<Array<React.RefObject<HTMLDivElement>>>([]);
  const positionArr = useRef<number[]>([]);

  const addCircleRef = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current && !circleRefArr.current.includes(ref)) {
      circleRefArr.current.push(ref);
    }
  };

  // const [currentIdx, setCurrentIdx] = useState(0);

  const updateLineHeight = () => {
    lineRefArr.current.map(
      (line: React.RefObject<HTMLDivElement>, index: number) => {
        if (line.current && circleRefArr.current[index]?.current) {
          const topLoc =
            Number(circleRefArr.current[index].current?.offsetTop) +
            Number(circleRefArr.current[index].current?.offsetHeight);
          const bottomCircle = Number(
            circleRefArr.current[index + 1].current?.offsetTop,
          );
          line.current.style.height = `${bottomCircle - topLoc}px`;
        }
      },
    );

    questionRefArr.current.map((ref, index) => {
      if (ref.current) {
        positionArr.current[index] = ref.current?.offsetTop;
      }
    });
  };

  useEffect(() => {
    for (let index = 0; index <= questionList.length; index++) {
      if (!questionRefArr.current[index]) {
        questionRefArr.current[index] = React.createRef();
      }
    }

    updateLineHeight();
  }, [questionList]);

  useEffect(() => {
    window.addEventListener('resize', updateLineHeight);
    // window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', updateLineHeight);
      // window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // let lastScrollY = 0;
  // const handleScroll = () => {
  //   const scrollTop = window.scrollY;
  //   const scrollDirectionDown = lastScrollY < scrollTop;

  //   let newIdx = currentIdx;

  //   if (scrollDirectionDown && currentIdx < positionArr.current.length - 1) {
  //     const scrollLoc =
  //       positionArr.current[currentIdx] +
  //       (positionArr.current[currentIdx + 1] -
  //         positionArr.current[currentIdx]) /
  //         3;
  //     if (scrollTop >= scrollLoc) {
  //       newIdx = currentIdx + 1;
  //     }
  //   } else if (!scrollDirectionDown && currentIdx > 0) {
  //     const scrollLoc =
  //       positionArr.current[currentIdx] -
  //       (positionArr.current[currentIdx] -
  //         positionArr.current[currentIdx - 1]) /
  //         3;

  //     if (scrollTop <= scrollLoc) {
  //       newIdx = currentIdx - 1;
  //     }
  //   }

  //   if (newIdx !== currentIdx) {
  //     setCurrentIdx(newIdx);
  //     window.scrollTo({
  //       top: positionArr.current[newIdx],
  //       behavior: 'smooth',
  //     });
  //   }

  //   lastScrollY = scrollTop;
  // };

  return (
    <div className={style.container}>
      {questionList.map((question, index) => {
        if (!lineRefArr.current[index]) {
          lineRefArr.current[index] = React.createRef();
        }

        return (
          <div ref={questionRefArr.current[index]} key={index}>
            <DiaryEntryInput
              index={index + 1}
              question={question.question}
              description={question.description}
              answer={answerList[index]}
              addCircleRef={addCircleRef}
              lineRef={lineRefArr.current[index]}
            />
          </div>
        );
      })}
      <div ref={questionRefArr.current[questionList.length]}>
        <DiaryImgInput
          index={questionList.length + 1}
          question={'첨부 이미지 업로드'}
          description={
            '관련된 이미지를 최대 3장까지 첨부할 수 있어요 ! (1장 당 최대 5MB)'
          }
          addCircleRef={addCircleRef}
        />
      </div>
    </div>
  );
}

export default DiaryForm;
