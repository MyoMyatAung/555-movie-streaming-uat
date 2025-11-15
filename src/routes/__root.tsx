import { TanstackDevtools } from "@tanstack/react-devtools";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import HomeBg from "@/assets/img/home-background.png";
import type { QueryClient } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react";
import { Toaster } from "sonner";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <NuqsAdapter>
        <div
          className="relative mx-auto flex h-svh w-screen max-w-md flex-col overflow-hidden bg-black bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HomeBg})` }}
        >
          <Outlet />
        </div>
        <TanstackDevtools
          config={{
            position: "bottom-left",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
      </NuqsAdapter>
      <Toaster
        position="bottom-center"
        visibleToasts={1}
        offset={0}
        mobileOffset={0}
        toastOptions={{
          style: {
            background: "#202229",
            color: "#fff",
            fontSize: "14px",
            fontWeight: "500",
            wordBreak: "break-word",
            whiteSpace: "normal",
            padding: "8px 16px",
            borderRadius: "25px",
            textAlign: "center",
            width: "fit-content",
            maxWidth: "420px",
            margin: "0 auto",
            bottom: "100px",
            left: "0",
            right: "0",
          },
        }}
        icons={{
          info: null,
        }}
      />
    </>
  ),
});
