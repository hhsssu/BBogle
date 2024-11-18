import { Route, Routes } from 'react-router-dom';

import DiaryCreate from '../components/diary/diaryCreateUpdate/diaryCreate/DiaryCreate';
import DiaryDetail from '../components/diary/diaryDetail/DiaryDetail';
import DiaryUpdate from '../components/diary/diaryCreateUpdate/diaryUpdate/DiaryUpdate';

function DiaryPage() {
  return (
    <div>
      <Routes>
        <Route path="create" element={<DiaryCreate></DiaryCreate>} />
        <Route path=":diaryId" element={<DiaryDetail></DiaryDetail>} />
        <Route path=":diaryId/update" element={<DiaryUpdate></DiaryUpdate>} />
      </Routes>
    </div>
  );
}

export default DiaryPage;
