import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Settings2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

interface QueryFilterProps {
  onFilterChange: (filters: {
    checklistId: string;
    startDate: Date | null;
    endDate: Date | null;
    showPending: boolean;
  }) => void;
  filters: {
    checklistId: string;
    startDate: Date | null;
    endDate: Date | null;
    showPending: boolean;
  };
}

export const QueryFilter = ({ onFilterChange, filters }: QueryFilterProps) => {
  const [checklistId, setChecklistId] = useState(filters.checklistId);
  const [startDate, setStartDate] = useState<Date | null>(filters.startDate);
  const [endDate, setEndDate] = useState<Date | null>(filters.endDate);
  const [showPending, setShowPending] = useState(filters.showPending);

  // Ref to control the drawer
  const drawerRef = useRef<HTMLButtonElement>(null);

  const handleApplyFilters = () => {
    // Apply filters
    onFilterChange({
      checklistId,
      startDate,
      endDate,
      showPending,
    });

    // Close the drawer programmatically
    if (drawerRef.current) {
      drawerRef.current.click(); // Simulate a click on the close button
    }
  };

  useEffect(() => {
    // Update the filters when the user changes them
    setChecklistId(filters.checklistId);
    setStartDate(filters.startDate);
    setEndDate(filters.endDate);
    setShowPending(filters.showPending);
  }, [onFilterChange, filters]);

  return (
    <Drawer>
      <DrawerTrigger>
        <Settings2Icon />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-center">Filters</DrawerTitle>
        </DrawerHeader>
        <DrawerDescription className="text-center">
          Filter the checklist by ID, date range, and status.
        </DrawerDescription>

        <div className="w-full p-2 max-w-[900px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Checklist ID Input */}
            <div className="space-y-2">
              <Label htmlFor="checklistId">Checklist ID</Label>
              <Input
                id="checklistId"
                type="text"
                value={checklistId}
                onChange={(e) => setChecklistId(e.target.value)}
                placeholder="Enter Checklist ID"
              />
            </div>

            {/* Start Date Picker */}
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover modal>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" forceMount>
                  <Calendar
                    mode="single"
                    selected={startDate || undefined}
                    onSelect={(date) => setStartDate(date ? date : null)}
                    initialFocus
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date Picker */}
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover modal>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate || undefined}
                    onSelect={(date) => setEndDate(date || null)}
                    initialFocus
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Pending Checklists Filter */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showPending"
                checked={showPending}
                onCheckedChange={(checked) => setShowPending(checked === true)}
              />
              <Label htmlFor="showPending">Show Pending</Label>
            </div>
          </div>
        </div>

        <DrawerFooter className="w-full max-w-[900px] mx-auto">
          {/* Close button with ref */}
          <DrawerClose ref={drawerRef}>Cancel</DrawerClose>
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
