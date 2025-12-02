import { intervalToDuration } from "date-fns/fp";

export const formatDate = (dateString: string, includeYear: boolean = false) => {
  return includeYear ? new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    year: "2-digit",
    minute: "2-digit"
  }).replace(",", " as") : new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).replace(",", " as")
};


// export const calcFormattedDiffBetweenDates = (start: string, end: string) => {
//   // const {days, hours, minutes, seconds} = intervalToDuration({
//   const { days, hours, minutes } = intervalToDuration({
//     start: new Date(start),
//     end: new Date(end)
//   })

//   return days || 0 > 0 ? `${days || "?"}D ${hours || "?"}H ${minutes || "?"}min` : hours || 0 > 0 ? `${hours || "?"}H ${minutes || "?"}min` : minutes || 0 > 0 ? `${minutes || "?"}min` : `< 1min`
// }

export const calcFormattedDiffBetweenDates = (start: string, end: string) => {
  const { days = 0, hours = 0, minutes = 0} = intervalToDuration({
    start: new Date(start),
    end: new Date(end),
  });

  const parts: string[] = [];

  if (days > 0) {
    // parts.push(`${days}D`);

    return "> 24"
  }

  if (hours > 0) {
    parts.push(`${hours}H`);
  }

  if (minutes > 0) {
    parts.push(`${minutes}min`);
  }

  if (parts.length === 0) {
    return "< 1min";
  }

  return parts.join(" ");
};


// export const calcDiff