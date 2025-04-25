// src/components/DidjyahCard.tsx

import type { DidjyahDb } from "@/server/db/types";
import Image from "next/image";
import React from "react";

interface DidjyahCardProps {
  detail: DidjyahDb;
}

const DidjyahCard: React.FC<DidjyahCardProps> = ({ detail }) => {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{detail.name}</h2>
        {detail.icon && (
          <Image
            src={detail.icon}
            alt={`${detail.name} icon`}
            className="h-8 w-8"
          />
        )}
      </div>
      <p className="mt-2 text-sm text-gray-600">
        <strong>Type:</strong> {JSON.stringify(detail.type)}
      </p>
      {detail.description && (
        <p className="mt-1 text-sm text-gray-500">{detail.description}</p>
      )}
      <div className="mt-4 space-y-1">
        <p className="text-sm">
          <strong>Unit:</strong> {detail.unit ?? "N/A"}
        </p>
        <p className="text-sm">
          <strong>Quantity:</strong> {detail.quantity ?? "N/A"}
        </p>
        <p className="text-sm">
          <strong>Daily Goal:</strong> {detail.daily_goal ?? "N/A"}
        </p>
        <p className="text-sm">
          <strong>Timer:</strong> {detail.timer ?? "None"}
        </p>
        <p className="text-sm">
          <strong>Stopwatch Enabled:</strong> {detail.stopwatch ? "Yes" : "No"}
        </p>
      </div>
      <div className="mt-4 text-xs text-gray-400">
        <p>Created: {new Date(detail.created_date).toLocaleString()}</p>
        <p>Updated: {new Date(detail.updated_date).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default DidjyahCard;
