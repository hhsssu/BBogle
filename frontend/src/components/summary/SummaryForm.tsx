import useSummaryStore from '../../store/useSummaryStore';
import styles from './Summary.module.css';
interface SummaryFormProps {
  content: string;
}
function SummaryForm({ content }: SummaryFormProps) {
  // 폼 오류 설정하기
  const { contentError, setContentError, setErrMsgOn } = useSummaryStore();

  // 회고 내용 수정
  const updateSummaryContent = useSummaryStore(
    (state) => state.updateSummaryContent,
  );

  // 🟢내용 오류
  const handleContentError = (value: boolean) => {
    setContentError(value);

    if (!contentError) {
      setErrMsgOn(false);
    }
  };
  // ✅내용 입력
  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = event.target.value;

    updateSummaryContent(value);
    if (content !== '') {
      // 내용 값이 없을 때 오류 처리
      handleContentError(false);
    }
  };
  return (
    <textarea
      name="content"
      rows={10}
      placeholder="내용을 입력하세요 (최소 300자 이상을 권장합니다.)"
      className={styles.editbox}
      value={content}
      onChange={handleContentChange}
    />
  );
}

export default SummaryForm;
