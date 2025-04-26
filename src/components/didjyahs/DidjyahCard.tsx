"use client";

import React from "react";
import type { DidjyahDb, DidjyahRecord } from "@/server/db/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconPrefix, IconName } from "@fortawesome/fontawesome-svg-core";
import { toast } from "sonner";
import { createDidjyahRecord } from "@/app/actions/addDidjyahRecord";
import { useQueryClient } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress"; // Adjust the import path if necessary
import EditDidjyahDialog from "./EditDidjyahDialog";
import { Button } from "../ui/button";
import { generateUuidWithPrefix } from "@/lib/utils";

interface DidjyahCardProps {
  detail: DidjyahDb;
}

const DidjyahCard: React.FC<DidjyahCardProps> = ({ detail }) => {
  // Parse the icon from the stored string "prefix|iconName"
  let iconComponent: React.ReactNode = null;
  if (detail.icon) {
    const parts = detail.icon.split("|");
    if (parts.length === 2) {
      const [prefix, iconName] = parts;
      iconComponent = (
        <FontAwesomeIcon
          icon={[prefix as IconPrefix, iconName as IconName]}
          style={{ color: detail.icon_color ?? "#000000" }}
          className="text-5xl"
        />
      );
    }
  }
  // Fallback if no icon is set
  iconComponent ??= <span className="text-2xl">❓</span>;

  // Filter records for today only based on created_date.
  const todayCount = detail.records.filter((record) => {
    // Assuming record.created_date is in ISO format.
    const recordDate = new Date(record.created_date);
    const today = new Date();
    return recordDate.toDateString() === today.toDateString();
  }).length;

  const queryClient = useQueryClient();

  const handlePlayClick = async () => {
    // Create an optimistic record using a temporary ID.
    const optimisticRecord: DidjyahRecord = {
      // id: `temp-${Date.now()}`,
      id: generateUuidWithPrefix("record_"),
      user_id: detail.user_id,
      didjyah_id: detail.id,
      // Adjust the inputs type or value as needed.
      // inputs: {} as any,
      test: "",
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
    };

    // Optimistically update the cached didjyahs data.
    queryClient.setQueryData<DidjyahDb[]>(["didjyahs"], (oldData) => {
      if (!oldData) return oldData;
      return oldData.map((d) => {
        if (d.id === detail.id) {
          return { ...d, records: [...d.records, optimisticRecord] };
        }
        return d;
      });
    });

    // Call the server action.
    const result = await createDidjyahRecord({
      didjyah_id: detail.id,
      id: optimisticRecord.id,
    });
    if (!result.success) {
      toast.error(
        result.message ?? "An error occurred while adding the record.",
      );
      // Optionally, roll back the optimistic update here.
    } else {
      toast.success(`${detail.name} recorded`);
    }
  };

  // Calculate progress based on today's count multiplied by quantity
  // and the daily goal multiplied by quantity.
  // Ensure we don't divide by zero if daily_goal or quantity is zero.
  const current = detail.quantity ? todayCount * detail.quantity : todayCount;
  const total =
    detail.daily_goal && detail.quantity
      ? detail.daily_goal * detail.quantity
      : (detail.daily_goal ?? 0);
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div
      id={`DidgYa-${detail.id}`}
      className="flex w-[450px] overflow-hidden rounded-lg border shadow-sm"
    >
      {/* Left Side: Full-height colored column with the icon */}
      <div
        id={`emoji-${detail.id}`}
        style={{ backgroundColor: detail.color ?? "#ffffff" }}
        className="flex w-20 min-w-20 items-center justify-center p-4"
      >
        {iconComponent}
      </div>

      {/* Right Side: Main content */}
      <div className="mx-auto flex w-full flex-col gap-2 p-4">
        <div className="flex justify-between gap-5">
          {/* Name and performedToday */}
          <div className="flex flex-col">
            <span id={`name-${detail.id}`} className="text-base font-semibold">
              {detail.name}
            </span>
            <span id={`performedToday-${detail.id}`} className="text-xs">
              <b>
                {todayCount} {detail.daily_goal && `/ ${detail.daily_goal}`}
              </b>{" "}
              {todayCount === 1 ? "time" : "times"} today{" "}
              {detail.quantity != 0 && detail.quantity && detail.daily_goal && (
                <>
                  <b>
                    ({(todayCount * detail.quantity).toLocaleString()} /{" "}
                    {(detail.daily_goal * detail.quantity).toLocaleString()}
                  </b>{" "}
                  {detail.unit})
                </>
              )}
            </span>
          </div>
          {/* Buttons & Location Row */}
          <div className="mt-2 flex items-center justify-end">
            <div className="flex items-center justify-end">
              <span
                id={`stop-${detail.id}`}
                className="text-supporting-light dark:text-supporting-dark hover:text-supporting-light/80 dark:hover:text-supporting-dark/80 hidden cursor-pointer"
              >
                <FontAwesomeIcon
                  className="text-3xl text-red-600"
                  icon={["fas", "stop"]}
                />
              </span>
              <Button
                id={`play-${detail.id}`}
                onClick={handlePlayClick}
                variant={"ghost"}
                size={"icon"}
              >
                <FontAwesomeIcon
                  className="text-3xl text-green-600"
                  icon={["fas", "play"]}
                />
              </Button>
              {/* Edit Button */}
              <EditDidjyahDialog didjyah={detail} />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {detail.daily_goal && (
          <Progress showPercentage value={percentage} className="h-4 w-full" />
        )}
      </div>
    </div>
  );
};

export default DidjyahCard;
