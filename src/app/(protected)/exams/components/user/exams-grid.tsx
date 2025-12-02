"use client";
import {
  ClipboardX,
  SearchX,
  ClipboardCheck,
  ClipboardClock,
  ClipboardPenLine,
} from "lucide-react";
import { toast } from "sonner";
import { getAllExams } from "@/utils/api/exam";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import ExamsLoading from "../../loading";
import ExamCard from "./exam-card";
import { ExamFilteredType, getExamStatus } from "@/utils/types/exam";

export default function ExamsGrid() {
  const { isPending, isError, data } = useQuery({
    queryKey: ["exams"],
    queryFn: getAllExams,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (isPending) {
      toast.info("Aguarde. Carregando exames...", { id: "loading" });
    } else {
      toast.dismiss("loading");
    }
  }, [isPending]);

  if (isPending) {
    return <ExamsLoading />;
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <ClipboardX className="h-12 w-12 mx-auto mb-4" />
        <p>Ops!, Ocorreu um erro inesperado.</p>
        <p className="text-sm">
          Nossa equipe está resolvendo. Tente novamente mais tarde.
        </p>
      </div>
    );
  }

  if (!data || data?.length == 0) {
    return (
      <div className="text-center py-8">
        <SearchX className="h-12 w-12 mx-auto mb-4" />
        <p>Nenhum exame foi encontrado</p>
        <p className="text-sm">
          Aguarde o administrador disponibilizar um exame.
        </p>
      </div>
    );
  }

  const comingSoonExams: ExamFilteredType[] = data.filter(
    (exam: ExamFilteredType) => getExamStatus(exam) === "Em breve"
  );
  const inProgressExams: ExamFilteredType[] = data.filter(
    (exam: ExamFilteredType) => getExamStatus(exam) === "Em andamento"
  );
  const doneExams: ExamFilteredType[] = data.filter(
    (exam: ExamFilteredType) => getExamStatus(exam) === "Concluído"
  );
  const lostExams: ExamFilteredType[] = data.filter(
    (exam: ExamFilteredType) => getExamStatus(exam) === "Não realizado"
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Em breve */}
      <div className="flex flex-col gap-4 p-4 pb-8 border rounded-2xl">
        <div>
          <h2 className="text-xl font-semibold text-ctf-blue flex gap-3 items-center">
            <ClipboardClock /> Em breve
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-1 items-start lg:grid-cols-3">
          {comingSoonExams.length > 0 ? (
            comingSoonExams.map((exam: ExamFilteredType) => (
              <ExamCard key={exam.id} exam={exam} />
            ))
          ) : (
            <div className="text-center py-8 col-span-full">
              <ClipboardClock className="h-12 w-12 mx-auto mb-4" />
              <p>Nenhum exame para ser liberado!</p>
              <p className="text-sm">
                Aguarde o professor / admin liberar um exame para que ele seja
                exibido aqui.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Em andamento */}
      <div className="flex flex-col gap-4 p-4 pb-8 border rounded-2xl">
        <div>
          <h2 className="text-xl font-semibold text-ctf-yellow flex gap-3 items-center">
            <ClipboardPenLine /> Em andamento
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-1 items-start lg:grid-cols-3">
          {inProgressExams.length > 0 ? (
            inProgressExams.map((exam: ExamFilteredType) => (
              <ExamCard key={exam.id} exam={exam} />
            ))
          ) : (
            <div className="text-center py-8 col-span-full">
              <ClipboardPenLine className="h-12 w-12 mx-auto mb-4" />
              <p>Nenhum exame em andamento no momento!</p>
              <p className="text-sm">
                Aguarde a data e horário de início dos exames que estão para ser
                liberados.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Concluídos */}
      <div className="flex flex-col gap-4 p-4 pb-8 border rounded-2xl">
        <div>
          <h2 className="text-xl font-semibold text-ctf-green flex gap-3 items-center">
            <ClipboardCheck /> Concluídos
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-1 items-start lg:grid-cols-3">
          {doneExams.length > 0 ? (
            doneExams.map((exam: ExamFilteredType) => (
              <ExamCard key={exam.id} exam={exam} />
            ))
          ) : (
            <div className="text-center py-8 col-span-full">
              <ClipboardCheck className="h-12 w-12 mx-auto mb-4" />
              <p>Nenhum exame foi concluído até o momento!</p>
              <p className="text-sm">
                Realize a entrega dos exames que estiverem em andamento para que
                eles apareçam aqui!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Não realizados */}
      <div className="flex flex-col gap-4 p-4 pb-8 border rounded-2xl">
        <div>
          <h2 className="text-xl font-semibold text-ctf-red flex gap-3 items-center">
            <ClipboardX /> Não realizados
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-1 items-start lg:grid-cols-3">
          {lostExams.length > 0 ? (
            lostExams.map((exam: ExamFilteredType) => (
              <ExamCard key={exam.id} exam={exam} />
            ))
          ) : (
            <div className="text-center py-8 col-span-full">
              <ClipboardX className="h-12 w-12 mx-auto mb-4" />
              <p>Nenhum exame foi perdido!</p>
              <p className="text-sm">
                Não esqueça de entregar nenhum exame para que eles não apareçam
                aqui!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
//EXAMS {
//   data: [
//     {
//       id: '6895fd5306c2d348a4e8de94',
//       title: 'Cyber Security Test',
//       description: 'Prova para testar conhecimentos de cybersegurança',
//       xp: 100,
//       ruby: 100,
//       category: 'Forensis',
//       difficulty: 'easy',
//       hidden: false,
//       exam_duration: 60,
//       exam_value: 10,
//       exercises: [Array],
//       created_at: '2025-08-08T13:36:19.274Z',
//       updated_at: '2025-08-08T13:36:19.274Z'
//     }
//   ],
//   message: 'Provas encontradas.',
//   success: true
// }
