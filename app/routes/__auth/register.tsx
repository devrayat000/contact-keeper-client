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

export default function RegisterPage() {
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

      <Paper component={Form} withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          label="Full Name"
          placeholder="John Doe"
          required
          variant="filled"
          name="name"
        />
        <TextInput
          label="Email"
          type="email"
          placeholder="you@mantine.dev"
          required
          variant="filled"
          mt="sm"
          name="email"
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          variant="filled"
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
          Create account
        </Button>
      </Paper>
    </>
  );
}
