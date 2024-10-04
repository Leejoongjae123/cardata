"use client";

import { Button } from "@/components/ui/button";
import { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { Spinner } from "@nextui-org/spinner";
type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  pendingText = "Submitting...",
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full text-white bg-primary hover:bg-primary/90 transition-colors"       aria-disabled={pending}
      {...props}
    >
      {pending ? <Spinner size="sm" /> : children}
    </Button>
  );
}
