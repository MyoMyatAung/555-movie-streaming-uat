import IconChevronLeft from "@/assets/svgs/icon-chevron-left.svg?react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import type { ComponentProps } from "react";

interface NestedLayoutProps {
  children: React.ReactNode;

  link?: ComponentProps<typeof Link>;
  title: string;
  backNode?: React.ReactNode;
  actionNode?: React.ReactNode;
  isIncludeBack?: boolean;
}

function NestedLayout({
  children,
  link,
  title,
  backNode,
  actionNode,
  isIncludeBack,
}: NestedLayoutProps) {
  const navigate = useNavigate();
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="my-7 grid h-[var(--nested-topbar-height)] grid-cols-12 items-center bg-transparent px-4">
        <div className="col-span-2">
          {isIncludeBack && (
            <Button
              type="button"
              size={"icon"}
              onClick={() => {
                if (link) navigate(link);
                else router.history.back();
              }}
              className="rounded-full border border-white/10"
            >
              <IconChevronLeft className="size-5 text-white" />
            </Button>
          )}
          {backNode}
        </div>
        <p className="col-span-8 text-center text-lg font-medium text-neutral-50">
          {title}
        </p>
        <div className="col-span-2 flex justify-end">{actionNode}</div>
      </div>
      <div className="flex-1 overflow-y-auto pb-4">{children}</div>
    </div>
  );
}

export default NestedLayout;
