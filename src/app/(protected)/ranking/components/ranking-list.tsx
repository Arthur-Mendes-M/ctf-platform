"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Crown, Medal, Award, Zap, Trophy } from "lucide-react";
import type { RankingUser } from "@/utils/types/user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChartBarStats } from "./stats/bar-chart";
import { ChartAreaStats } from "./stats/area-chart";

export function RankingList({
  ranking,
  currentUserEmail,
}: {
  ranking: RankingUser[];
  currentUserEmail: string;
}) {
  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <Trophy className="h-5 w-5 text-slate-400" />;
    }
  };

  const getPositionBadge = (position: number) => {
    switch (position) {
      case 1:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case 2:
        return "bg-gray-100 text-gray-800 border-gray-300";
      case 3:
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  const RankingUserListCard = ({
    user,
    userPosition,
    isCurrentUser,
  }: {
    user: RankingUser;
    userPosition: number;
    isCurrentUser: boolean;
  }) => {
    return (
      <Card
        className={`transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${
          isCurrentUser ? "ring-2 ring-ctf-blue ring-offset-2" : ""
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-center flex-wrap gap-4">
            {/* Posição */}
            <div className="flex items-center gap-2 flex-wrap min-w-[80px]">
              {getPositionIcon(userPosition + 1)}
              <Badge
                className={`${getPositionBadge(
                  userPosition + 1
                )} font-semibold`}
              >
                {userPosition + 1}º
              </Badge>
            </div>
            {/* Avatar */}
            <Avatar className="h-12 w-12 ">
              <AvatarImage src={user.avatar_url || ""} alt={user.name} />
              <AvatarFallback className="">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Informações do usuário */}
            <div className="flex-1 min-w-24">
              <h3 className="font-semibold truncate">
                {user?.name ?? "Desconhecido"}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-ctf-blue text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  {user.xp.toLocaleString()} XP
                </Badge>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="md:gap-5 hidden md:flex">
              <div className="text-center text-sm">
                <p className="font-medium">
                  {!user.solved_challenges
                    ? 0
                    : user.solved_challenges.filter(
                        (challenge) => challenge.solved
                      ).length}
                </p>
                <p className="text-xs">desafios</p>
              </div>

              <div className="text-center text-sm">
                <p className="font-medium">
                  {!user.solved_exams
                    ? 0
                    : user.solved_exams.filter((exam) => exam.solved).length}
                </p>
                <p className="text-xs">exames</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 max-w-4xl mx-auto">
      {ranking &&
        ranking.length > 0 &&
        ranking.map((user, userPosition) => {
          const isCurrentUser = user.email === currentUserEmail;

          return (
            <Dialog key={`${userPosition}-${user.email}`}>
              <DialogTrigger className="text-left cursor-pointer">
                <RankingUserListCard
                  user={user}
                  isCurrentUser={isCurrentUser}
                  userPosition={userPosition}
                />
              </DialogTrigger>

              <DialogContent className="sm:max-w-7xl">
                <DialogHeader>
                  <DialogTitle>{user?.name ?? "Desconhecido"}</DialogTitle>
                  <DialogDescription>
                    Veja um pouco das estatísticas do(a){" "}
                    {user?.name ?? "Desconhecido"}
                  </DialogDescription>
                </DialogHeader>

                <div className="flex gap-2 flex-wrap">
                  <ChartBarStats user={user} />

                  <ChartAreaStats user={user} />
                </div>
              </DialogContent>
            </Dialog>
          );
        })}
    </div>
  );
}
