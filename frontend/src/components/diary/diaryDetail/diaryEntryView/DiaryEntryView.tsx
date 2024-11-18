import style from './DiaryEntryView.module.css';

interface Props {
  index: number;
  question: string;
  answer: string;
  circleRef: React.RefObject<HTMLDivElement> | null;
  lineRef: React.RefObject<HTMLDivElement> | null;
}

function QnaView({ index, question, answer, circleRef, lineRef }: Props) {
  return (
    <div className={style.container}>
      <div className={style.questionContainer}>
        <div ref={circleRef} className={style.outerCircle}>
          <div className={style.innerCircle}>{index}</div>
          <div ref={lineRef} className={style.line}></div>
        </div>
        <span className={style.question}>{question}</span>
      </div>

      <div className={style.textArea}>{answer}</div>
    </div>
  );
}

export default QnaView;
