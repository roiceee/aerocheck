import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AuthContext from "@/context/AuthContext";
import MainLayout from "@/layouts/MainLayout";
import { cn, combineDateTime } from "@/lib/utils";
import supabase from "@/supabase-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { z } from "zod";

const formSchema = z.object({
  isExistingChecklist: z.boolean(),
  airplaneModel: z.string().min(1, "Please select an aircraft model"),
  coCheckerUserId: z.string().min(1, "Please select a co-checker"),
  date: z.string().optional(),
  time: z.string().optional(),
  approvedByMechanic: z.boolean(),
  approvedByPilot: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddCheckPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isExistingChecklist: false,
      airplaneModel: "",
      coCheckerUserId: "",
      date: "",
      time: "",
      approvedByMechanic: false,
      approvedByPilot: false,
    },
  });

  const airplaneCheckQuery = useQuery({
    queryKey: ["airplane-model"],
    queryFn: async () => {
      const airplaneRes = await supabase.from("aircraft_models").select("*");
      if (airplaneRes.error) throw airplaneRes.error;
      return airplaneRes.data;
    },
  });

  const coCheckerQuery = useQuery({
    queryKey: ["co-checker"],
    queryFn: async () => {
      const coCheckerRes = await supabase
        .from("users")
        .select("*, user_roles!inner(role)")
        .eq("user_roles.role", user.role === "mechanic" ? "pilot" : "mechanic");
      if (coCheckerRes.error) throw coCheckerRes.error;
      return coCheckerRes.data;
    },
  });

  const handleSubmit = useMutation({
    mutationFn: async (values: FormValues) => {
      const checklistTemplateRes = await supabase
        .from("checklist_templates")
        .select("*")
        .eq("aircraft_model_id", values.airplaneModel);

      if (checklistTemplateRes.error) throw checklistTemplateRes.error;

      const { data, error } = await supabase
        .from("checklists")
        .insert([
          {
            aircraft_model_id: values.airplaneModel,
            submitted_at: values.isExistingChecklist
              ? null
              : combineDateTime(values.date!, values.time!),
            pilot_id:
              user.role === "pilot" ? user.user!.id : values.coCheckerUserId,
            mechanic_id:
              user.role === "mechanic" ? user.user!.id : values.coCheckerUserId,
            approved_by_mechanic: values.approvedByMechanic,
            approved_by_pilot: values.approvedByPilot,
            approved_by_superadmin: false,
            template_id: checklistTemplateRes.data[0].id,
            list: checklistTemplateRes.data[0].list,
          },
        ])
        .select();
      if (error || !data) throw error;

      return data;
    },
  });

  useEffect(() => {
    if (handleSubmit.isSuccess) {
      navigate(`/checklist/${handleSubmit.data[0].id}`);
    }
  }, [handleSubmit, navigate, user]);

  return (
    <MainLayout>
      <main>
        <h1 className="text-xl font-bold my-4">New Check</h1>

        <Form {...form} >
          <form
            onSubmit={form.handleSubmit((values) =>
              handleSubmit.mutate(values)
            )}
            className=" space-y-4"
          >
            <FormField
              control={form.control}
              name="airplaneModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aircraft Model</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select aircraft model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {airplaneCheckQuery.isFetched &&
                          airplaneCheckQuery.data?.map((airplane) => (
                            <SelectItem key={airplane.id} value={airplane.id}>
                              {airplane.name}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coCheckerUserId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Co-Checker</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={`Select Co-checker (${
                            coCheckerQuery.isLoading
                              ? "(Loading...)"
                              : user.role === "mechanic"
                              ? "Pilot"
                              : "Mechanic"
                          })`}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {coCheckerQuery.isFetched &&
                          coCheckerQuery.data?.map((pilot) => (
                            <SelectItem key={pilot.id} value={pilot.id}>
                              <p>{pilot.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {pilot.email}
                              </p>
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isExistingChecklist"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>This is an existing checklist</FormLabel>
                </FormItem>
              )}
            />

            {form.watch("isExistingChecklist") && (
              <>
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) =>
                              field.onChange(date?.toISOString())
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="approvedByMechanic"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Is approved by mechanic</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="approvedByPilot"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Is approved by pilot</FormLabel>
                    </FormItem>
                  )}
                />
              </>
            )}

            <Button
              type="submit"
              disabled={handleSubmit.isPending}
              className="w-full"
            >
              {handleSubmit.isPending ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </main>
    </MainLayout>
  );
}
