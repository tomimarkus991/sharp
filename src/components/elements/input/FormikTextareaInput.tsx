/* eslint-disable jsx-a11y/no-autofocus */
import { VariantProps, cva } from "class-variance-authority";
import { useField } from "formik";
import { ReactNode, forwardRef } from "react";

import { InputErrorText } from "@/components";
import { cn } from "@/utils";

const formikInputVariants = cva(["placeholder:text-stone-500 relative placeholder:text-base"], {
  // regular --> hover --> active --> dark --> focus
  variants: {
    variant: {
      unstyled: "",
      default: `bg-white text-text-primary border-2 border-secondary focus:outline-none focus:border-orange-400`,
      green: `bg-lime-500 text-[#f3f2f0] border-lime-600
      hover:text-white`,
      dark: `bg-gray-700 text-[#f3f2f0] border-gray-900
        hover:text-white`,
      blue: `bg-blue-700 text-[#f3f2f0] border-blue-900
        hover:text-white`,
    },
    // size is already defined on input element
    inputSize: {
      sm: "py-2 px-4 text-md rounded-xl",
      md: "py-2 px-4 text-lg font-semibold rounded-xl",
      lg: "py-3 px-4 text-xl font-semibold rounded-xl",
    },
  },
  defaultVariants: {
    variant: "default",
    inputSize: "md",
  },
});

interface FormikInputProps
  extends React.InputHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof formikInputVariants> {
  name: string;
  label?: string | ReactNode;
}

export const FormikTextareaInput = forwardRef<HTMLTextAreaElement, FormikInputProps>(
  ({ label, name, className = "appearance-none", variant, inputSize, required, ...props }, ref) => {
    const [field, { touched, error }] = useField(name);

    return (
      <div>
        {label && (
          <div className="ml-1">
            <label className="text-sm text-stone-400" htmlFor={props.id || name}>
              {label}
            </label>
            {required && <span className="ml-1 text-red-500">*</span>}
          </div>
        )}

        <div className="relative">
          <textarea
            className={cn(
              formikInputVariants({ variant, inputSize, className }),
              error && "border-2 border-red-400 outline-none caret-red-400 focus:border-red-500"
            )}
            autoFocus={false}
            autoComplete="off"
            ref={ref}
            {...field}
            {...props}
          />
        </div>
        <InputErrorText className="mt-1 ml-1" touched={touched} error={error} />
      </div>
    );
  }
);

FormikTextareaInput.displayName = "FormikTextareaInput";
