import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Group,
  Button,
} from "@mantine/core";
import { Form, Link, useActionData, useTransition } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/node";

import {
  type ParsedRegisterError,
  type Register,
  validateRegisterParams,
} from "~/services/validator.server";
import { hashPassword } from "~/services/bcrypt.server";
import { register } from "~/services/auth.server";
import { createUserSession } from "~/services/session.server";

type ActionData = ParsedRegisterError & {
  authError?: string;
  values?: Partial<Register>;
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const params = Object.fromEntries(formData.entries());
  const validatedResponse = validateRegisterParams(params);

  if (validatedResponse.status === "error") {
    return Object.assign(validatedResponse, { values: params });
  }

  const { email, name, password } = validatedResponse.data;
  const hash = await hashPassword(password);

  const user = await register({ name, email, hash });
  if ("authError" in user) {
    return user;
  }

  return createUserSession(user.id);
}

export default function RegisterPage() {
  const actionData = useActionData<ActionData>();
  const transition = useTransition();

  const loadTexts: any = {
    actionRedirect: "Redirecting...",
  };

  const text =
    transition.state === "submitting"
      ? "Processing..."
      : transition.state === "loading"
      ? loadTexts[transition.type] || "Loading..."
      : "Create account";

  return (
    <>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Welcome to ContactKeeper!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Already have an account?{" "}
        <Anchor component={Link} to="register" size="sm">
          Log In
        </Anchor>
      </Text>

      <Paper
        component={Form}
        method="post"
        withBorder
        shadow="md"
        p={30}
        mt={30}
        radius="md"
      >
        <TextInput
          label="Full Name"
          placeholder="John Doe"
          required
          variant="filled"
          name="name"
          error={actionData?.fieldErrors.name?.join("\n")}
          defaultValue={actionData?.values?.name}
        />
        <TextInput
          label="Email"
          type="email"
          placeholder="you@mantine.dev"
          required
          variant="filled"
          mt="sm"
          name="email"
          error={actionData?.fieldErrors.email?.join("\n")}
          defaultValue={actionData?.values?.email}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          variant="filled"
          mt="sm"
          name="password"
          error={actionData?.fieldErrors.password?.join("\n")}
          defaultValue={actionData?.values?.password}
        />
        <Group position="apart" mt="md">
          <Checkbox label="Remember me" />
          <Anchor component={Link} to="#" size="sm">
            Forgot password?
          </Anchor>
        </Group>
        {actionData?.authError && (
          <Text color="red" mt="md">
            {actionData.authError}
          </Text>
        )}
        <Button
          fullWidth
          mt="xl"
          type="submit"
          loading={transition.state === "loading"}
          disabled={transition.state === "submitting"}
        >
          {text}
        </Button>
      </Paper>
    </>
  );
}
