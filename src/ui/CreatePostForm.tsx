/* eslint-disable no-void */
import { useUser } from "@clerk/nextjs";
import { Form, Formik } from "formik";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { FormikInput, LoadingSpinner, RealButton } from "@/components";

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
    onError: e => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again later.");
      }
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

        const errorMessage = error?.data?.zodError?.fieldErrors.content;
        if (errorMessage && errorMessage[0]) {
          setErrors({ content: errorMessage[0] });
        }

        if (!error) {
          resetForm();
        }

        setSubmitting(false);
      }}
    >
      {({ submitForm }) => {
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
                placeholder="Type some emojis!"
                disabled={isPosting}
                className={cn(
                  "grow placeholder:text-[#d2d2d2]",
                  isPosting && "cursor-not-allowed opacity-60"
                )}
                inputAfterfix={
                  <>
                    <RealButton size="xs" onClick={submitForm}>
                      {isPosting ? <LoadingSpinner size={24} /> : "Send"}
                    </RealButton>
                  </>
                }
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
