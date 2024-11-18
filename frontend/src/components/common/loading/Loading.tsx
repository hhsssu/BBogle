import style from './Loading.module.css';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

// 로딩 메세지 목록
const MESSAGES = [
  '오늘의 작은 노력이 내일의 큰 성과로 이어집니다.',
  '당신의 코드는 세상을 바꿀 잠재력을 가지고 있습니다.',
  '노력은 배신하지 않아요. 믿고 끝까지 도전해 봅시다!',
  '개발자는 끊임없는 도전을 통해 성장합니다.',
  '당신의 가능성은 무한합니다. 자신감을 가지세요.',
  '실패는 성공의 밑거름입니다. 포기하지 마세요.',
  '포기하지 않는 한, 당신은 이미 반 이상 성공한 것입니다.',
  '꿈을 이루기 위해 달려가는 당신의 노력이 멋집니다.',
  '준비한 만큼의 결실을 맺을 거예요. 힘내세요!',
  '오늘의 도전이 내일의 자신감을 만듭니다.',
  '작은 걸음이 모여 큰 성취로 이어집니다.',
  '당신의 열정과 노력이 빛을 발할 날이 곧 올 것입니다.',
  '도전은 끝없는 성장의 시작입니다.',
  '인내하고 견디는 순간, 당신은 더 강해집니다.',
  '목표를 향해 한 걸음씩 나아가면 반드시 도달할 수 있습니다.',
  '어려운 순간은 더 큰 성장을 위한 과정입니다.',
  '현재의 당신은 어제보다 더 나은 개발자가 되어 있습니다.',
  '성공을 꿈꿀 수 있다면, 이룰 수 있습니다.',
  '작은 성공을 쌓아 가면 큰 성공으로 이어질 거예요.',
  '당신의 코드와 열정은 반드시 빛을 발할 것입니다.',
  '꾸준함이 큰 성과를 만듭니다. 매일 조금씩 노력해봅시다.',
  '남들과 비교하지 말고 어제의 자신과 비교하세요.',
  '길고 어려운 여정이지만, 그 끝엔 당신이 있습니다.',
  '실패를 두려워하지 않는 용기가 성공으로 이어집니다.',
  '작은 진전이라도 그것이 쌓여 성공으로 가는 길이 됩니다.',
  '포기하지 않고 계속 도전하는 모습이 가장 아름답습니다.',
  '도전하는 당신은 이미 대단한 사람입니다.',
  '무엇보다도 당신의 성장을 응원합니다.',
  '실패를 경험했더라도, 그것이 더 나은 내일을 위한 과정입니다.',
  '자신을 믿고, 꿈을 향해 나아가세요!',
  '오늘의 고생이 내일의 보람으로 돌아올 거예요.',
  '당신의 가능성은 무궁무진합니다. 스스로를 믿으세요.',
  '이 순간에도 당신은 성장하고 있습니다.',
  '힘든 시간을 버티는 것만으로도 큰 성취입니다.',
  '매일 조금씩 더 나아가는 당신을 응원합니다!',
  '열정과 노력은 결국 빛을 발하게 되어 있습니다.',
  '앞으로 나아가는 용기 있는 당신에게 응원을 보냅니다.',
  '지금의 도전이 미래의 커다란 성장을 이끌 것입니다.',
  '한 걸음씩 목표를 향해 나아가는 당신이 멋집니다.',
  '천천히 가더라도 끝까지 나아가는 것이 중요합니다.',
  '꾸준함은 결국 당신을 최고의 개발자로 만들어줄 거예요.',
  '당신의 노력은 반드시 좋은 결과로 이어질 것입니다.',
  '포기하지 않고 달려가는 당신이 이미 승리자입니다.',
  '꿈을 향해 전진하는 당신을 응원합니다. 화이팅!',
  '내일의 성공을 위해 오늘의 노력을 아끼지 마세요.',
  '작은 성공이 모여 큰 성공으로 이어질 것입니다.',
  '지금까지 잘해왔고 앞으로도 잘 해낼 수 있습니다.',
];

interface LoadingProps {
  isLoading: boolean;
  title: string;
  animationData: Record<string, unknown>;
}

function Loading({ isLoading, title, animationData }: LoadingProps) {
  const [message, setMessage] = useState('');
  const [fade, setFade] = useState(true);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (isLoading) {
      const changeMessage = () => {
        setFade(false);
        setTimeout(() => {
          const randomMessage =
            MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
          setMessage(randomMessage);
          setFade(true);
        }, 500);
      };

      changeMessage();
      intervalId = setInterval(changeMessage, 4000);
    }

    return () => clearInterval(intervalId);
  }, [isLoading]);

  if (!isLoading) {
    return null;
  }

  return (
    <div className={style.overlay}>
      <div className={style.container}>
        <div className={style.animation}>
          <Lottie animationData={animationData} loop autoplay />
        </div>
        <h2 className={style.title}>{title}</h2>
        <p
          className={`${style.description} ${fade ? style.fadeIn : style.fadeOut}`}
        >
          {message}
        </p>
      </div>
    </div>
  );
}

export default Loading;
