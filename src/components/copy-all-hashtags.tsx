'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';

interface CopyAllHashtagsProps {
  hashtags: string[];
  buttonText: string;
  copiedText: string;
}

export default function CopyAllHashtags({ hashtags, buttonText, copiedText }: CopyAllHashtagsProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    const allHashtags = hashtags.join(' ');
    
    try {
      await navigator.clipboard.writeText(allHashtags);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy hashtags: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors text-sm font-medium"
    >
      {isCopied ? (
        <>
          <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
          {copiedText}
        </>
      ) : (
        <>
          <FontAwesomeIcon icon={faCopy} className="w-4 h-4" />
          {buttonText}
        </>
      )}
    </button>
  );
}