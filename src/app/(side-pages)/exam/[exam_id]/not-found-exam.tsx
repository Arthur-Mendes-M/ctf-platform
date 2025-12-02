import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ExamNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-white p-6">
      <div className="max-w-md text-center">
        <Image
          src="/exam-not-found-undraw.svg"
          alt="Exame não encontrado"
          width={360}
          height={240}
          className="mx-auto mb-6"
        />

        <h2 className="text-2xl md:text-3xl font-bold dark mb-4">
          Exame não encontrado
        </h2>

        <p className="dark text-lg mb-8 max-w-md mx-auto">
          Parece que o exame que você buscou não está disponível.
        </p>

        <Button asChild size="lg" variant={"default"} className="bg-blue-600">
          <Link href="/exams" className="flex items-center gap-2">
            <ArrowLeftIcon className="w-4 h-4" />
            Voltar para exames
          </Link>
        </Button>
      </div>
    </div>
  );
}
