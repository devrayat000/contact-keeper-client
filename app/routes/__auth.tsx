import { Container } from "@mantine/core";
import { Outlet } from "@remix-run/react";

export default function AuthPage() {
  return (
    <Container size={420} my="xl">
      <Outlet />
    </Container>
  );
}
