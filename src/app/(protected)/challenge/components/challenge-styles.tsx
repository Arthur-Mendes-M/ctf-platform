import { Badge } from "@/components/ui/badge";

export const getDifficultyBadge = (difficulty: string) => {
  // return (
  //   <Badge
  //     variant={
  //       difficulty === "Difícil"
  //         ? "destructive"
  //         : difficulty === "Muito difícil"
  //         ? "default"
  //         : difficulty === "Médio"
  //         ? "yellow"
  //         : difficulty === "Fácil"
  //         ? "green"
  //         : "secondary"
  //     }
  //   >
  //     {difficulty}
  //   </Badge>
  // );

  const variants = {
    Difícil: "destructive",
    "Muito difícil": "default",
    Médio: "secondary",
    Fácil: "secondary",
  } as const;

  const colors = {
    Difícil: "bg-red-100 text-red-800 hover:bg-red-100",
    "Muito difícil": "bg-gray-800 text-white hover:bg-gray-800",
    Médio: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    Fácil: "bg-green-100 text-green-800 hover:bg-green-100",
  } as const;

  return (
    <Badge
      variant={variants[difficulty as keyof typeof variants] || "secondary"}
      className={colors[difficulty as keyof typeof colors] || ""}
    >
      {difficulty}
    </Badge>
  );
};
