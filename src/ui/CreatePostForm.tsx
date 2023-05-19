/* eslint-disable no-void */
import { useUser } from "@clerk/nextjs";
import { Form, Formik } from "formik";
import Image from "next/image";
import { useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { FormikInput, LoadingSpinner } from "@/components";

import { YupSchemas } from "../app-constants";
import { cn } from "../utils";
import { api } from "../utils/api";

interface FormValues {
  content: string;
}
export const CreatePostForm = () => {
  const { user } = useUser();
  const [initialValues] = useState<FormValues>({
    content: "",
  });

  const ctx = api.useContext();

  const {
    mutate,
    error,
    isLoading: isPosting,
  } = api.posts.create.useMutation({
    onSuccess: () => {
      void ctx.posts.getAll.invalidate();
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={toFormikValidationSchema(YupSchemas.CreatePost)}
      validateOnChange={true}
      onSubmit={async ({ content }, { setSubmitting, resetForm, setErrors }) => {
        setSubmitting(true);

        mutate({ content });

        setErrors({ content: (error as any)?.data?.zodError?.fieldErrors.content[0] });

        if (!error) {
          resetForm();
        }

        setSubmitting(false);
      }}
    >
      {() => {
        return (
          <Form className="flex flex-col">
            <div className="flex items-center justify-start mb-2">
              {user ? (
                <Image
                  alt="pic"
                  src={user?.profileImageUrl || ""}
                  className="rounded-full"
                  width={56}
                  height={56}
                />
              ) : (
                <LoadingSpinner />
              )}

              <FormikInput
                name="content"
                variant="ghost"
                placeholder="Type something!"
                disabled={isPosting}
                className={cn(
                  "grow placeholder:text-[#d2d2d2]",
                  isPosting && "cursor-not-allowed opacity-60"
                )}
              />
              {/* <p className="mb-2 text-[#f3f2f0] font-semibold text-lg">{user?.username}</p> */}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
