import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// FIX #16: QueryClient created once outside getRouter so it's never wiped on re-render.
// FIX #23: defaultPreloadStaleTime removed (was 0, which disabled prefetching).
//          defaultPreload: "intent" now prefetches routes on link hover → instant navigation.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
});

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
  });

  return router;
};
