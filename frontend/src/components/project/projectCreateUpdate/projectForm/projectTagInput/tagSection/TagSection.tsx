import style from './TagSection.module.css';

import AddTag from '../../../../../../assets/image/icon/AddTag.svg';
import Close from '../../../../../../assets/image/icon/Close.svg';
import EnterIcon from '../../../../../../assets/image/icon/Enter.svg';

import { useEffect, useRef, useState } from 'react';
import useProjectStore from '../../../../../../store/useProjectStore';

interface Props {
  label: string;
  array: string[];
  name: string;
}

function TagSection({ label, array, name }: Props) {
  const itemInputRef = useRef<HTMLInputElement>(null);

  const [itemInputOpen, setItemInputOpen] = useState(false);
  const [itemInput, setItemInput] = useState('');

  const updateProject = useProjectStore((state) => state.updateProjectField);

  const openItemInput = () => {
    if (!itemInputOpen) setItemInputOpen(true);
  };

  const handleItemInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItemInput(event.target.value);
  };

  const addItem = (
    event:
      | React.KeyboardEvent<HTMLInputElement>
      | React.MouseEvent<HTMLImageElement>,
  ) => {
    if ('key' in event) {
      if (event.key !== 'Enter') {
        if (event.key === 'Escape') {
          setItemInput('');
          setItemInputOpen(false);
        }
        return;
      }
    }

    if (itemInput === '') {
      setItemInputOpen(false);
      return;
    }

    // 대소문자를 구별하지 않고 중복 제거
    const lowerCaseArray = array.map((item) => item.toLowerCase());
    const lowerCaseInput = itemInput.toLowerCase();

    if (!lowerCaseArray.includes(lowerCaseInput)) {
      updateProject(name, [...array, itemInput]);
    }

    setItemInput('');
    setItemInputOpen(false);
  };

  const deleteItemTag = (index: number) => {
    updateProject(
      name,
      array.filter((_, i) => i !== index),
    );
  };

  useEffect(() => {
    const input = document.querySelector(
      `.${style.tagInput}`,
    ) as HTMLInputElement;

    if (input) {
      input.focus();
    }
  }, [itemInputOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        itemInputRef.current &&
        !itemInputRef.current.contains(event.target as Node)
      ) {
        setItemInput('');
        setItemInputOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  return (
    <div className={style.inputLabel}>
      <span className={style.label}>{label}</span>
      <div className={style.tagSection}>
        {array.map((item, index) => (
          <div key={index} className={style.tag}>
            {item}
            <img
              className={style.close}
              src={Close}
              alt="닫기"
              onClick={() => {
                deleteItemTag(index);
              }}
            />
          </div>
        ))}

        {itemInputOpen && (
          <div ref={itemInputRef} className={style.tagInputContainer}>
            <input
              className={style.tagInput}
              type="text"
              maxLength={20}
              value={itemInput}
              onChange={handleItemInput}
              onKeyDown={addItem}
            />
            <img
              className={style.enterImg}
              src={EnterIcon}
              alt="등록"
              onClick={addItem}
            />
          </div>
        )}

        {array.length < 7 && (
          <img
            className={style.addTag}
            src={AddTag}
            alt="태그 추가"
            onClick={openItemInput}
          />
        )}
      </div>
    </div>
  );
}

export default TagSection;
