import { useEffect } from 'react';

const useBeforeUnload = (message: string | null) => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (message) {
        event.preventDefault();
        event.returnValue = message; // 브라우저에서 표시될 메시지
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [message]);
};

export default useBeforeUnload;
