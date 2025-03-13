import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="flex h-full my-auto items-center justify-center px-4">
      <SignUp />
    </div>
  );
}
