/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import React, { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { APP_NAME } from "@/lib/constants";
import {
  updateDidjyah,
  type UpdateDidjyahData,
} from "@/app/actions/updateDidjyah";
import { DidjyahOptions } from "@/app/api/queryOptions";
import type { DidjyahDb } from "@/server/db/types";
import FAIconPicker from "../FAIconPicker";
import ColorPicker from "../ShadcnColorPicker";
import { Edit } from "lucide-react";
import type { IconName, IconPrefix } from "@fortawesome/fontawesome-svg-core";

// Same schema as in create dialog
const didjyahSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["since", "timer", "stopwatch", "daily", "goal"]),
  icon: z.string().optional(),
  color: z.string().optional(),
  icon_color: z.string().optional(),
  description: z.string().optional(),
  unit: z.string().optional(),
  quantity: z.coerce.number().optional(),
  daily_goal: z.coerce.number().optional(),
  timer: z.coerce.number().optional(),
  stopwatch: z.boolean().optional(),
  inputs: z.string().optional(),
});

// Define form type from schema
type DidjyahFormValues = z.infer<typeof didjyahSchema>;

interface EditDidjyahDialogProps {
  didjyah: DidjyahDb;
}

export function EditDidjyahDialog({ didjyah }: EditDidjyahDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<DidjyahFormValues>({
    resolver: zodResolver(didjyahSchema),
    defaultValues: {
      name: didjyah.name,
      type: didjyah.type,
      icon: didjyah.icon ?? "",
      color: didjyah.color ?? "#000000",
      icon_color: didjyah.icon_color ?? "#000000",
      description: didjyah.description ?? "",
      unit: didjyah.unit ?? "",
      quantity: didjyah.quantity,
      daily_goal: didjyah.daily_goal,
      timer: didjyah.timer,
      stopwatch: didjyah.stopwatch ?? false,
      inputs:
        typeof didjyah.inputs === "string"
          ? didjyah.inputs
          : JSON.stringify(didjyah.inputs),
    },
  });

  // When the didjyah prop changes, reset the form with the new default values.
  useEffect(() => {
    form.reset({
      name: didjyah.name,
      type: didjyah.type,
      icon: didjyah.icon ?? "",
      color: didjyah.color ?? "#000000",
      icon_color: didjyah.icon_color ?? "#000000",
      description: didjyah.description ?? "",
      unit: didjyah.unit ?? "",
      quantity: didjyah.quantity,
      daily_goal: didjyah.daily_goal,
      timer: didjyah.timer,
      stopwatch: didjyah.stopwatch ?? false,
      inputs:
        typeof didjyah.inputs === "string"
          ? didjyah.inputs
          : JSON.stringify(didjyah.inputs),
    });
  }, [didjyah, form]);

  const onSubmit: SubmitHandler<DidjyahFormValues> = async (data) => {
    try {
      // Optimistically update the cache.
      const transformedData = {
        ...data,
        inputs: (() => {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            return JSON.parse(data.inputs ?? "");
          } catch {
            return data.inputs; // or handle the error appropriately
          }
        })(),
      };
      queryClient.setQueryData<DidjyahDb[]>(DidjyahOptions.queryKey, (old) =>
        old
          ? old.map((d) =>
              d.id === didjyah.id ? { ...d, ...transformedData } : d,
            )
          : [],
      );

      // Immediately close the dialog and reset the form.
      setOpen(false);
      form.reset();

      // Fire off the server update in the background.
      const updateData: UpdateDidjyahData = {
        id: didjyah.id,
        name: data.name,
        type: data.type,
        icon: data.icon,
        color: data.color,
        icon_color: data.icon_color,
        description: data.description,
        unit: data.unit,
        quantity: data.quantity,
        daily_goal: data.daily_goal,
        timer: data.timer,
        stopwatch: data.stopwatch,
        inputs: data.inputs,
      };

      const response = await updateDidjyah(updateData);
      if (response.success) {
        toast.success(`${APP_NAME} has been updated`);
      } else {
        toast.error(response.message ?? `Error updating ${APP_NAME}`);
        // Optionally, revert the optimistic update here if needed.
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size={"icon"}>
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {APP_NAME}</DialogTitle>
          <DialogDescription>
            Update the details for {didjyah.name}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Didjyah Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type */}
            {/* <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full rounded border p-2"
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <option value="since">Since</option>
                      <option value="timer">Timer</option>
                      <option value="stopwatch">Stopwatch</option>
                      <option value="daily">Daily</option>
                      <option value="goal">Goal</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* Icon Picker */}
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <FAIconPicker
                      selectedIcon={
                        field.value?.includes("|")
                          ? (() => {
                              const [prefix, name] = field.value.split("|");
                              // Only pass if both prefix and name are defined
                              return prefix && name
                                ? {
                                    prefix: prefix as IconPrefix,
                                    name: name as IconName,
                                  }
                                : undefined;
                            })()
                          : undefined
                      }
                      onSelectIcon={(iconName, prefix) =>
                        field.onChange(`${prefix}|${iconName}`)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Icon Color Picker */}
            <FormField
              control={form.control}
              name="icon_color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon Color</FormLabel>
                  <FormControl>
                    <ColorPicker
                      selectedColor={field.value ?? "#000000"}
                      onSelectColor={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* General Color Picker */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <ColorPicker
                      selectedColor={field.value ?? "#000000"}
                      onSelectColor={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Unit */}
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <Input placeholder="Unit of measure" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quantity */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Daily Goal */}
            <FormField
              control={form.control}
              name="daily_goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Goal</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Daily Goal"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Timer */}
            <FormField
              control={form.control}
              name="timer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timer (in seconds)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Timer value"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Stopwatch */}
            <FormField
              control={form.control}
              name="stopwatch"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-4">
                  <FormLabel>Use Stopwatch</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Inputs (JSON) */}
            <FormField
              control={form.control}
              name="inputs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inputs (JSON)</FormLabel>
                  <FormControl>
                    <Input placeholder='e.g., {"blah": "example"}' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditDidjyahDialog;
