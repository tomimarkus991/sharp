import { useUser } from "@clerk/nextjs";
import { Form, Formik } from "formik";
import { useState } from "react";

import { YupSchemas } from "@/app-constants";

import { FormikInput, FormikTextareaInput } from "../components";

interface FormValues {
  title: string;
  content: string;
}
export const CreatePostForm = () => {
  const { user } = useUser();
  const [initialValues] = useState<FormValues>({
    title: "",
    content: "",
  });

  if (!user) return null;

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
          <Form className="flex flex-row">
            <div className="mr-2">
              <img src={user?.profileImageUrl} className="w-8 h-8 rounded-full" />
            </div>
            <div>
              <p className="mb-2 text-[#f3f2f0]">{user?.username}</p>
              <FormikInput name="title" variant="dark" className="mb-2" />
              <FormikTextareaInput name="content" variant="dark" />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
