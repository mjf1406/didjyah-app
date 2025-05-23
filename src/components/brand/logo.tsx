/** @format */

import { APP_NAME } from "@/lib/constants";
import Link from "next/link";
import React from "react";

interface LogoProps {
  fill?: string;
  size?: string;
}

export function Logo({ fill, size }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      height={size}
      width={size}
      fill={fill}
    >
      <path
        d="M0 80l0 48c0 17.7 14.3 32 32 32l16 0 48 0 0-80c0-26.5-21.5-48-48-48S0 53.5 0 80zM112 32c10 13.4 16 30 16 48l0 304c0 35.3 28.7 64 64 64s64-28.7 64-64l0-5.3c0-32.4 26.3-58.7 58.7-58.7L480 320l0-192c0-53-43-96-96-96L112 32zM464 480c61.9 0 112-50.1 112-112c0-8.8-7.2-16-16-16l-245.3 0c-14.7 0-26.7 11.9-26.7 26.7l0 5.3c0 53-43 96-96 96l176 0 96 0z"
        fill="#22774a"
      />
      <path />
    </svg>
  );
}

export function LogoHeader() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Logo fill="hsl(var(--primary))" size="30" />
      <h1 className="text-foreground text-xl font-bold">{APP_NAME}</h1>
      <span className="-ml-1 justify-start self-start text-xs font-semibold text-red-500 dark:text-orange-500">
        [ALPHA]
      </span>
    </Link>
  );
}
