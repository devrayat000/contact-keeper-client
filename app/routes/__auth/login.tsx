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
import { Form, Link } from "@remix-run/react";

export default function LoginPage() {
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

      <Paper component={Form} withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          label="Email"
          type="email"
          placeholder="you@mantine.dev"
          required
          name="email"
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          mt="sm"
          name="password"
        />
        <Group position="apart" mt="md">
          <Checkbox label="Remember me" />
          <Anchor component={Link} to="#" size="sm">
            Forgot password?
          </Anchor>
        </Group>
        <Button fullWidth mt="xl" type="submit">
          Sign in
        </Button>
      </Paper>
    </>
  );
}
