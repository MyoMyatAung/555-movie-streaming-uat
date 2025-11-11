import BulletScreen from "@/assets/svgs/bulletscreens.svg?react";
import Download from "@/assets/svgs/download.svg?react";
import HeartActive from "@/assets/svgs/heart-active.svg?react";
import Message from "@/assets/svgs/message-text.svg?react";
import Share from "@/assets/svgs/share.svg?react";
import Star from "@/assets/svgs/star.svg?react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/player/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { t } = useTranslation();

  return (
    <>
      {/* Video Player Content */}
      {/** Tab Bar */}
      <Tabs defaultValue="account">
        <div className="flex items-center justify-between border-b border-gray-500 p-3">
          <TabsList className="bg-transparent">
            <TabsTrigger
              className="rounded-none text-lg text-white data-[state=active]:bg-transparent data-[state=active]:font-semibold"
              value="account"
            >
              Intro
            </TabsTrigger>
            <TabsTrigger
              className="rounded-none text-lg text-white data-[state=active]:bg-transparent data-[state=active]:font-semibold"
              value="password"
            >
              Comment
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-1">
            <span className="text-white">Bullet Comments</span>
            <BulletScreen />
          </div>
        </div>
        <TabsContent value="account" className="p-3">
          <h1 className="text-white">Moana (2016)</h1>
          <div className="flex w-fit items-start divide-x divide-solid divide-gray-400 text-white">
            <div className="w-fit pr-2">2016</div>
            <div className="flex w-fit items-center gap-1 px-2">
              <Star /> <span>6.8/10</span>
            </div>
            <div className="w-fit px-2">2hr 48mins</div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white inset-shadow-sm backdrop-blur-md">
              Action
            </button>
            <button className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white inset-shadow-sm backdrop-blur-md">
              Fantasy
            </button>
            <button className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white inset-shadow-sm backdrop-blur-md">
              Animation
            </button>
            <button className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white inset-shadow-sm backdrop-blur-md">
              Disney
            </button>
          </div>
          <p className="mt-4 line-clamp-3 text-white">
            Moana is a 2016 American animated musical fantasy adventure film
            produced by Walt Disney Animation Studios and released by Walt
            Disney Pictures. It is the 56th Disney animated feature film. The
            film tells the story of Moana, a Polynesian girl who sets sail on a
            daring mission to save her people. During her journey, Moana meets
            the demigod Maui, voiced by Dwayne Johnson, and together they face
            challenges to restore the heart of Te Fiti.
          </p>
          <button className="mt-2 text-blue-400">Read more</button>
          <div className="mt-4 flex justify-between gap-4">
            <button className="flex flex-col items-center gap-2 text-white">
              <Download /> Download
            </button>
            <button className="flex flex-col items-center gap-2 text-white">
              <HeartActive /> Bookmark
            </button>
            <button className="flex flex-col items-center gap-2 text-white">
              <Message /> Feedback
            </button>
            <button className="flex flex-col items-center gap-2 text-white">
              <Share /> Share
            </button>
          </div>
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="item-1"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <h1 className="text-white">Season 1</h1>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex flex-1 gap-2 overflow-x-auto">
                    <button className="shrink-0 rounded bg-[#2496FF66] px-4 py-2 text-white inset-shadow-sm inset-shadow-[#2496FF66]">
                      01
                    </button>
                    <button className="shrink-0 rounded bg-[#2496FF66] px-4 py-2 text-white inset-shadow-sm inset-shadow-[#2496FF66]">
                      02
                    </button>
                    <button className="shrink-0 rounded bg-[#2496FF66] px-4 py-2 text-white inset-shadow-sm inset-shadow-[#2496FF66]">
                      03
                    </button>
                    <button className="shrink-0 rounded bg-[#2496FF66] px-4 py-2 text-white inset-shadow-sm inset-shadow-[#2496FF66]">
                      04
                    </button>
                    <button className="shrink-0 rounded bg-[#2496FF66] px-4 py-2 text-white inset-shadow-sm inset-shadow-[#2496FF66]">
                      05
                    </button>
                    <button className="shrink-0 rounded bg-[#2496FF66] px-4 py-2 text-white inset-shadow-sm inset-shadow-[#2496FF66]">
                      06
                    </button>
                    <button className="shrink-0 rounded bg-[#2496FF66] px-4 py-2 text-white inset-shadow-sm inset-shadow-[#2496FF66]">
                      07
                    </button>
                    <button className="shrink-0 rounded bg-[#2496FF66] px-4 py-2 text-white inset-shadow-sm inset-shadow-[#2496FF66]">
                      08
                    </button>
                    <button className="shrink-0 rounded bg-[#2496FF66] px-4 py-2 text-white inset-shadow-sm inset-shadow-[#2496FF66]">
                      09
                    </button>
                    <button className="shrink-0 rounded bg-[#2496FF66] px-4 py-2 text-white inset-shadow-sm inset-shadow-[#2496FF66]">
                      10
                    </button>
                  </div>
                  <button className="text-blue-400">View more</button>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                <h1 className="text-white">Season 2</h1>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex flex-1 gap-2 overflow-x-auto">
                    <button className="shrink-0 rounded bg-[#2496FF66] px-4 py-2 text-white inset-shadow-sm inset-shadow-[#2496FF66]">
                      01
                    </button>
                    <button className="shrink-0 rounded bg-[#2496FF66] px-4 py-2 text-white inset-shadow-sm inset-shadow-[#2496FF66]">
                      02
                    </button>
                    <button className="shrink-0 rounded bg-[#2496FF66] px-4 py-2 text-white inset-shadow-sm inset-shadow-[#2496FF66]">
                      03
                    </button>
                    <button className="shrink-0 rounded bg-[#2496FF66] px-4 py-2 text-white inset-shadow-sm inset-shadow-[#2496FF66]">
                      04
                    </button>
                    <button className="shrink-0 rounded bg-[#2496FF66] px-4 py-2 text-white inset-shadow-sm inset-shadow-[#2496FF66]">
                      05
                    </button>
                    <button className="shrink-0 rounded bg-[#2496FF66] px-4 py-2 text-white inset-shadow-sm inset-shadow-[#2496FF66]">
                      06
                    </button>
                    <button className="shrink-0 rounded bg-[#2496FF66] px-4 py-2 text-white inset-shadow-sm inset-shadow-[#2496FF66]">
                      07
                    </button>
                    <button className="shrink-0 rounded bg-[#2496FF66] px-4 py-2 text-white inset-shadow-sm inset-shadow-[#2496FF66]">
                      08
                    </button>
                    <button className="shrink-0 rounded bg-[#2496FF66] px-4 py-2 text-white inset-shadow-sm inset-shadow-[#2496FF66]">
                      09
                    </button>
                    <button className="shrink-0 rounded bg-[#2496FF66] px-4 py-2 text-white inset-shadow-sm inset-shadow-[#2496FF66]">
                      10
                    </button>
                  </div>
                  <button className="text-blue-400">View more</button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
      {/** Video Detail */}
      {/** Video Actions */}
      {/** Related Videos */}
    </>
  );
}
