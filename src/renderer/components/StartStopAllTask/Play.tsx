import React from 'react';

export function Play({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.7048 15.378C20.2345 14.4359 18.2793 15.4449 18.2793 17.2253V30.71C18.2793 32.4903 20.2345 33.4994 21.7048 32.5572L21.7063 32.5563L32.1694 25.814L32.1747 25.8105C33.5142 24.9302 33.5142 23.005 32.1747 22.1247L21.7063 15.379L21.7048 15.378Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.4224 8.43199C15.6871 8.38319 8.52325 15.3604 8.47452 24.0825L8.47449 24.0864C8.37696 32.8153 15.3992 39.982 24.1246 40.0307L24.1285 40.0307C32.8572 40.1283 40.0237 33.1059 40.0724 24.3802L40.0725 24.3763C40.17 15.6474 33.1478 8.48074 24.4224 8.43199ZM7.07456 24.0727C7.12873 14.565 14.9358 6.97897 24.4302 7.03201C33.9344 7.08511 41.5775 14.889 41.4724 24.39C41.4183 33.8935 33.615 41.5358 24.1148 41.4307C14.6115 41.3765 6.96947 33.573 7.07456 24.0727Z"
        fill="currentColor"
      />
    </svg>
  );
}
