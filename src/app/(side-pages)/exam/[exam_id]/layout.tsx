import type { Metadata } from "next";
import "../../../globals.css";
import { getCurrentUserExam } from "@/utils/cookies";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const foundExam = await getCurrentUserExam();

  if(!foundExam) {
    redirect("/exams")
  }

  return {
    title: `${foundExam.title} | CTF`,
    description: foundExam.description,
  };
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
