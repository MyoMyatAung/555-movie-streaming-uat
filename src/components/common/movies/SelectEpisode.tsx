import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function SelectEpisode() {
  return (
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
  );
}
