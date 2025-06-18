'use client';

import { useState } from 'react';

interface CopiableHashtagProps {
  hashtag: string;
  className?: string;
}

export default function CopiableHashtag({ hashtag, className = '' }: CopiableHashtagProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hashtag);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy hashtag:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm hover:bg-red-200 transition-colors cursor-pointer relative ${className}`}
      title="Click to copy"
    >
      {hashtag}
      {copied && (
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
          Copied!
        </span>
      )}
    </button>
  );
}