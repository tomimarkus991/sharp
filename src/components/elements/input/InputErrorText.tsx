import { cn } from "@/utils";

interface Props {
  touched: boolean;
  error: string | undefined;
  className?: string;
}

export const InputErrorText = ({ touched, error, className }: Props) => {
  return (
    <>
      {touched && error && (
        <p className={cn("text-sm font-medium text-red-500", className)}>{error}</p>
      )}
    </>
  );
};
