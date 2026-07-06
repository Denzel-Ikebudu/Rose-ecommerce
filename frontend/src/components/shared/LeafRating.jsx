"use client";

import React from "react";
import { Leaf } from "lucide-react";

export default function LeafRating({
  value = 0,
  onChange = null,
  size = "w-4 h-4",
}) {
  const interactive = typeof onChange === "function";
  const stops = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1" role={interactive ? "radiogroup" : "img"} aria-label={`${value} out of 5`}>
      {stops.map((stop) => {
        const filled = stop <= value;
        const Tag = interactive ? "button" : "span";
        return (
          <Tag
            key={stop}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => onChange(stop) : undefined}
            aria-label={interactive ? `${stop} leaves` : undefined}
            className={
              interactive
                ? "bg-transparent border-none p-0.5 cursor-pointer"
                : "p-0.5"
            }
          >
            <Leaf
              className={`${size} stroke-[1.5] transition-colors duration-150 ${
                filled ? "text-herbal-accent fill-herbal-accent/40" : "text-herbal-cream/20"
              }`}
            />
          </Tag>
        );
      })}
    </div>
  );
}