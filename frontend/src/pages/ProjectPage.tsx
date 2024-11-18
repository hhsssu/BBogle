import { Routes, Route } from 'react-router-dom';

import ProjectList from '../components/project/projectList/ProjectList';
import ProjectDetail from '../components/project/projectDetail/ProjectDetail';
import ProjectCreate from '../components/project/projectCreateUpdate/projectCreate/ProjectCreate';
import DiaryPage from './DiaryPage';
import ProjectUpdate from '../components/project/projectCreateUpdate/projectUpdate/ProjectUpdate';
import ProjectActivityExtract from '../components/project/projectActivityExtract/ProjectActivityExtract';

function ProjectPage() {
  return (
    <div>
      <Routes>
        <Route path="" element={<ProjectList></ProjectList>}></Route>
        <Route path=":pjtId" element={<ProjectDetail></ProjectDetail>}></Route>
        <Route path="create" element={<ProjectCreate></ProjectCreate>}></Route>
        <Route
          path=":pjtId/update"
          element={<ProjectUpdate></ProjectUpdate>}
        ></Route>
        <Route path=":pjtId/diary/*" element={<DiaryPage></DiaryPage>}></Route>
        <Route
          path=":pjtId/extract"
          element={<ProjectActivityExtract />}
        ></Route>
      </Routes>
    </div>
  );
}

export default ProjectPage;
