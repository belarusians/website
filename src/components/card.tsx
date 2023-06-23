import { PropsWithChildren } from "react";

export default function Card({ className, children }: { className?: string } & PropsWithChildren) {
  return (
    <div
      className={`transition-all flex flex-col rounded-md shadow-xl bg-white font-light text-black p-4 md:p-8 ${
        className ?? ""
      }`}
    >
      {children}
    </div>
  );
}
