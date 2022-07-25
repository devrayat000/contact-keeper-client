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
import {
  Form,
  Link,
  useActionData,
  useSearchParams,
  useTransition,
} from "@remix-run/react";
import type { ActionArgs } from "@remix-run/node";

import {
  type ParsedLoginError,
  type Login,
  validateLoginParams,
} from "~/services/validator.server";
import { login } from "~/services/auth.server";
import { validateHash } from "~/services/bcrypt.server";
import { createUserSession } from "~/services/session.server";

type ActionData = ParsedLoginError & {
  authError?: string;
  values?: Partial<Login>;
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const params = Object.fromEntries(formData.entries());
  const validatedResponse = validateLoginParams(params);

  if (validatedResponse.status === "error") {
    return Object.assign(validatedResponse, { values: params });
  }

  const { email, password } = validatedResponse.data;
  const user = await login({ email });
  if ("authError" in user) {
    return user;
  }

  const isPasswordCorrect = await validateHash(password, user.hash);
  if (!isPasswordCorrect) return { authError: "Wrong password!" };

  return createUserSession(user.id, formData.get("_next")?.toString()!);
}

export default function LoginPage() {
  const actionData = useActionData<ActionData>();
  const transition = useTransition();
  const [params] = useSearchParams();

  const loadTexts: any = {
    actionRedirect: "Redirecting...",
  };

  const text =
    transition.state === "submitting"
      ? "Processing..."
      : transition.state === "loading"
      ? loadTexts[transition.type] || "Loading..."
      : "Log In";

  return (
    <>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Welcome back!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Do not have an account yet?{" "}
        <Anchor component={Link} to="register" size="sm">
          Create account
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
        <fieldset disabled={transition.state === "submitting"}>
          <input
            type="hidden"
            name="_next"
            value={params.get("_next") ?? "/"}
          />
          <TextInput
            label="Email"
            type="email"
            placeholder="you@mantine.dev"
            required
            name="email"
            error={actionData?.fieldErrors.email?.join("\n")}
            defaultValue={actionData?.values?.email}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="sm"
            name="password"
            error={actionData?.fieldErrors.password?.join("\n")}
            defaultValue={actionData?.values?.password}
          />
        </fieldset>
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
        <Button fullWidth mt="xl" type="submit">
          {text}
        </Button>
      </Paper>
    </>
  );
}
