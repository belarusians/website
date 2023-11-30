'use client';

import { useState, PropsWithChildren } from 'react';


import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { ClickOutside } from './click-outside';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface DropdownProps extends PropsWithChildren {
  className: string;
  label: string;
  onOpen?: () => void;
  onClose?: () => void;
}

export function Dropdown({ className, label, children: dropdownMenu, onOpen, onClose }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    if (isOpen) {
      if (typeof onClose === 'function') onClose();
    } else {
      if (typeof onOpen === 'function') onOpen();
    }
    setIsOpen(!isOpen);
  }

  return (
    <ClickOutside onClickOutside={() => {
      setIsOpen(false);
      if (typeof onClose === 'function') onClose();
    }}>
      <div className="divide-solid divide-light-grey divide-y">
        <button className={`${className}`} onClick={toggleDropdown}>
          {label}
          <FontAwesomeIcon icon={faChevronDown} className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
        </button>
        {isOpen && dropdownMenu}
      </div>
    </ClickOutside>
  );
}
