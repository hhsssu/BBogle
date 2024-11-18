import { useEffect, useState } from 'react';
import style from './SideBar.module.css';
import useSideBarStore from '../../../store/useSideBarStore';
import { useNavigate, useLocation } from 'react-router-dom';

// logo
import LogoSmall from '../../../assets/image/logo/BBO_small.svg';
import LogoLarge from '../../../assets/image/logo/BBOGLE.svg';

// icons
import FoldIcon from '../../../assets/image/icon/Fold.svg';
import OutFoldIcon from '../../../assets/image/icon/OutFold.svg';

import MainIcon from '../../../assets/image/icon/Main.svg';
import ActiveMainIcon from '../../../assets/image/icon/ActiveMain.svg';

import ProjectIcon from '../../../assets/image/icon/Project.svg';
import ActiveProjectIcon from '../../../assets/image/icon/ActiveProject.svg';

import ExperienceIcon from '../../../assets/image/icon/Experience.svg';
import ActiveExperienceIcon from '../../../assets/image/icon/ActiveExperience.svg';

import MyIcon from '../../../assets/image/icon/My.svg';
import ActiveMyIcon from '../../../assets/image/icon/ActiveMy.svg';

import LogoutIcon from '../../../assets/image/icon/Logout.svg';
import useAuthStore from '../../../store/useAuthStore';

function SideBar() {
  const { isOpen, toggleSideBar, activeTab, setActiveTab } = useSideBarStore();
  const [showDescriptions, setShowDescriptions] = useState(isOpen); // description 표시 여부 상태 추가
  const [showFoldButton, setShowFoldButton] = useState(!isOpen);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  // isOpen 상태가 변경될 때 0.2초 뒤에 showDescriptions 업데이트
  useEffect(() => {
    if (isOpen) {
      setShowFoldButton(false);
      const timer = setTimeout(() => setShowDescriptions(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowDescriptions(false);
      const timer = setTimeout(() => setShowFoldButton(true), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const path = location.pathname;

    // 경로 패턴에 따라 activeTab 설정
    if (path.includes('project')) {
      setActiveTab('project');
    } else if (path.includes('activity')) {
      setActiveTab('activity');
    } else if (path.includes('my')) {
      setActiveTab('my');
    } else {
      setActiveTab('main'); // 기본 탭을 'main'으로 설정
    }
  }, [location.pathname, setActiveTab]);

  // 탭 변경 함수
  const handleTap = (tap: string) => {
    setActiveTab(tap);
    if (tap === 'main') {
      navigate('/');
    } else {
      navigate('/' + tap);
    }
  };

  // 로그아웃 함수
  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div
      className={`${style.sidebarContainer} ${isOpen ? style.open : style.closed}`}
    >
      <div className={style.content}>
        <div className={style.header}>
          {isOpen ? (
            <img
              className={style.largeLogo}
              src={LogoLarge}
              alt="Logo"
              onClick={() => handleTap('main')}
            />
          ) : (
            <img
              className={style.smallLogo}
              src={LogoSmall}
              alt=""
              onClick={() => handleTap('main')}
            />
          )}
          {isOpen && (
            <img
              className={style.openButton}
              src={FoldIcon}
              alt="Fold Icon"
              onClick={toggleSideBar}
            />
          )}
        </div>
        <div className={style.taps}>
          <div className={style.mainTaps}>
            <div className={style.tap} onClick={() => handleTap('main')}>
              {activeTab === 'main' ? (
                <img src={ActiveMainIcon} alt="Active Main Icon" />
              ) : (
                <img src={MainIcon} alt="Main Icon" />
              )}
              {showDescriptions && (
                <div
                  className={`${style.tapDescription} ${activeTab === 'main' && style.active}`}
                >
                  메인
                </div>
              )}
            </div>
            <hr className={style.line} />
            <div className={style.tap} onClick={() => handleTap('project')}>
              {activeTab === 'project' ? (
                <img src={ActiveProjectIcon} alt="Active Project Icon" />
              ) : (
                <img src={ProjectIcon} alt="Project Icon" />
              )}
              {showDescriptions && (
                <div
                  className={`${style.tapDescription} ${activeTab === 'project' && style.active}`}
                >
                  프로젝트
                </div>
              )}
            </div>
            <div className={style.tap} onClick={() => handleTap('activity')}>
              {activeTab === 'activity' ? (
                <img src={ActiveExperienceIcon} alt="Active Activity Icon" />
              ) : (
                <img src={ExperienceIcon} alt="Activity Icon" />
              )}
              {showDescriptions && (
                <div
                  className={`${style.tapDescription} ${activeTab === 'activity' && style.active}`}
                >
                  경험
                </div>
              )}
            </div>
            <div className={style.tap} onClick={() => handleTap('my')}>
              {activeTab === 'my' ? (
                <img src={ActiveMyIcon} alt="Active My Icon" />
              ) : (
                <img src={MyIcon} alt="My Icon" />
              )}
              {showDescriptions && (
                <div
                  className={`${style.tapDescription} ${activeTab === 'my' && style.active}`}
                >
                  내 정보
                </div>
              )}
            </div>
          </div>
          <div className={style.bottom}>
            <div
              className={`${style.tap} ${style.logout}`}
              onClick={handleLogout}
            >
              <img src={LogoutIcon} alt="Logout Icon" />
              {showDescriptions && (
                <div className={style.tapDescription}>로그아웃</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showFoldButton && (
        <img
          className={style.closeButton}
          src={OutFoldIcon}
          alt="Fold Icon"
          onClick={toggleSideBar}
        />
      )}
    </div>
  );
}

export default SideBar;
