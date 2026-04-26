import { PropsWithClass } from '../app/types';

export function Spinner({ className }: PropsWithClass) {
  return (
    <div className={className}>
      <span
        className={`
    before:m-auto before:origin-center before:absolute before:inset-x-0 before:inset-y-0 before:box-border before:animate-rotate-back-fast before:w-[80%] before:h-[80%] before:rounded-full before:border-2 before:border-r-transparent before:border-t-transparent before:border-b-transparent before:border-l-[color:rgb(237_28_36_/_0.35)]
    after:m-auto after:origin-center after:absolute after:inset-x-0 after:inset-y-0 after:box-border after:animate-rotate-back after:w-[60%] after:h-[60%] after:rounded-full after:border-2 after:border-r-transparent after:border-t-transparent after:border-b-primary after:border-l-primary
    relative box-border animate-rotate-slow inline-block w-[100%] h-[100%] rounded-full border-2 border-t-[color:rgb(237_28_36_/_0.65)] border-b-transparent border-l-transparent border-r-[color:rgb(237_28_36_/_0.65)]
     `}
      ></span>
    </div>
  );
}
