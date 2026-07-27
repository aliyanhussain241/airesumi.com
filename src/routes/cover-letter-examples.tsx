import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/cover-letter-examples")({
  component: () => <Outlet />,
});
