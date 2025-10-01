"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, SlidersHorizontal, RotateCcw, Filter } from "lucide-react";

export default function FilterDrawer() {
  const [open, setOpen] = React.useState(false);

  // Filters state
  const [startDate, setStartDate] = React.useState<Date | undefined>(
    () => new Date(new Date().setMonth(new Date().getMonth() - 3)) // 3 month ago
  );

  const [endDate, setEndDate] = React.useState<Date | undefined>(
    () => new Date() // now
  );
  const [magnitude, setMagnitude] = React.useState<number[]>([3, 8]); // 規模 3~8
  const [depth, setDepth] = React.useState<number[]>([0, 300]); // 深度 0~100 km

  // Hover area opens the sheet on desktop only
  const hoverRef = React.useRef<HTMLDivElement | null>(null);
  const closeTimeout = React.useRef<number | null>(null);

  React.useEffect(() => {
    const el = hoverRef.current;
    if (!el) return;
    const onEnter = () => setOpen(true);
    el.addEventListener("mouseenter", onEnter);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      if (closeTimeout.current) {
        window.clearTimeout(closeTimeout.current);
        closeTimeout.current = null;
      }
    };
  }, []);

  const resetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setMagnitude([3, 7]);
    setDepth([0, 100]);
  };

  const resetDatesOnly = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const applyFilters = () => {
    // Dispatch a custom event so pages/layouts can listen if needed
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("earthquake:apply-filters", {
          detail: {
            startDate,
            endDate,
            magnitude,
            depth,
          },
        })
      );
    }
    // Close after applying
    setOpen(false);
  };

  const formatDate = (d?: Date) => (d ? d.toLocaleDateString() : "");

  return (
    <>
      {/* Desktop hover edge (hidden on mobile) */}
      <div
        ref={hoverRef}
        className="hidden md:block fixed top-0 left-0 h-screen w-32 z-40"
        aria-hidden
      />

      {/* Desktop visible hint tab */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden md:flex fixed left-2 top-1/2 -translate-y-1/2 z-40 items-center gap-1 rounded-full border bg-background/80 px-3 py-1.5 shadow-sm backdrop-blur hover:bg-background transition-colors"
        aria-label="開啟篩選"
      >
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">篩選</span>
      </button>

      {/* Mobile trigger button */}
      <Button
        onClick={() => setOpen(true)}
        className="md:hidden fixed bottom-4 right-28 z-40 shadow-lg"
        variant="outline"
        size="icon"
        aria-label="開啟篩選"
      >
        <Filter className="h-5 w-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="sm:max-w-md p-0 border-r"
          onMouseEnter={() => {
            if (closeTimeout.current) {
              window.clearTimeout(closeTimeout.current);
              closeTimeout.current = null;
            }
          }}
          onMouseLeave={() => {
            if (closeTimeout.current) {
              window.clearTimeout(closeTimeout.current);
            }
            closeTimeout.current = window.setTimeout(() => setOpen(false), 200);
          }}
        >
          <SheetHeader className="sticky top-0 z-10 border-b bg-gradient-to-r from-primary/10 to-transparent px-6 py-5 backdrop-blur">
            <SheetTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              地震篩選器
            </SheetTitle>
            <SheetDescription>設定日期、規模與深度以篩選地震資料。</SheetDescription>
          </SheetHeader>

          <div className="px-6 pb-6 pt-6 space-y-6">
            {/* 日期 */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium">日期</h3>
                <Button variant="ghost" size="sm" className="h-8 px-2 gap-1 text-xs" onClick={resetDatesOnly}>
                  <RotateCcw className="h-3.5 w-3.5" /> 重設日期
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">選擇開始日期</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="start-date"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? formatDate(startDate) : "選擇日期"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        captionLayout="dropdown"
                        fromMonth={new Date(1990, 0, 1)} // Jan 1990
                        toMonth={new Date()}             // Current month
                        disabled={[
                          { before: new Date(1990, 0, 1) },
                          { after: new Date() },
                        ]}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end-date">選擇結束日期</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="end-date"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? formatDate(endDate) : "選擇日期"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        captionLayout="dropdown"
                        fromMonth={new Date(1990, 0, 1)} // Jan 1990
                        toMonth={new Date()}             // Current month
                        disabled={[
                          { before: new Date(1990, 0, 1) },
                          { after: new Date() },
                        ]}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </section>

            <Separator />

            {/* 規模 */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">規模</h3>
                <span className="text-xs text-muted-foreground">
                  {magnitude[0].toFixed(1)} ~ {magnitude[1].toFixed(1)}
                </span>
              </div>
              <Slider
                value={magnitude}
                onValueChange={setMagnitude}
                min={0}
                max={10}
                step={0.1}
                className="py-2"
              />
            </section>

            <Separator />

            {/* 深度 */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">深度 (km)</h3>
                <span className="text-xs text-muted-foreground">
                  {depth[0]} ~ {depth[1]} km
                </span>
              </div>
              <Slider
                value={depth}
                onValueChange={setDepth}
                min={0}
                max={700}
                step={5}
                className="py-2"
              />
            </section>
          </div>

          <div className="sticky bottom-0 border-t bg-background px-6 py-4 flex items-center justify-between gap-3">
            <Button variant="outline" onClick={resetFilters} className="gap-2">
              <RotateCcw className="h-4 w-4" /> 重置
            </Button>
            <Button onClick={applyFilters} className="gap-2">
              套用篩選
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}