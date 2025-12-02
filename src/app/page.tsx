import CTFLogo from "@/components/ctf-logo";
import LoginForm from "@/components/login-form";
// import Link from "next/link";

export default function Home() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          {/* <Link href="/" className="flex items-center gap-2 font-medium"> */}
            <CTFLogo variant="long" />
          {/* </Link> */}
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted sticky top-0 h-screen w-full overflow-hidden hidden lg:block">
        <video width="1000" height="1000" className="absolute inset-0 h-full w-full object-cover" controls={false} preload="" muted autoPlay loop>
          <source src="/glitch_code_video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
