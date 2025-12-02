import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export default function SubmitButton({ children, className, ...props }: React.ComponentProps<"button">) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className={cn("w-full", className)} {...props}>
            {pending ? "Carregando..." : children}
        </Button>
    );
}