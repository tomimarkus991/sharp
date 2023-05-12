import { useUser } from "@clerk/nextjs";
import { Form, Formik } from "formik";
import Image from "next/image";
import { useState } from "react";

import { YupSchemas } from "@/app-constants";
import { FormikInput, LoadingSpinner } from "@/components";

interface FormValues {
  title: string;
}
export const CreatePostForm = () => {
  const { user } = useUser();
  const [initialValues] = useState<FormValues>({
    title: "",
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={YupSchemas.CreatePost}
      validateOnChange={true}
      onSubmit={async (_, { setSubmitting, resetForm }) => {
        setSubmitting(true);

        // he sends to Nüke
        // const sentFrom = new Sender(email, name);

        // const recipients = [new Recipient("tomimarkusalber@gmail.com", "Nüke")];

        resetForm();

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
                name="title"
                variant="ghost"
                placeholder="Type something!"
                className="grow placeholder:text-[#d2d2d2]"
              />
              {/* <p className="mb-2 text-[#f3f2f0] font-semibold text-lg">{user?.username}</p> */}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
