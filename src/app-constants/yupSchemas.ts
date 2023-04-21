import { string, object } from "yup";

const CreatePost = object().shape({
  title: string().min(3).required(),
  content: string().min(3).required(),
});

export const YupSchemas = {
  CreatePost,
};
