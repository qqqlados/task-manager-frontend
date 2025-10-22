"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { FC } from "react";
import { useSearchParams } from "next/navigation";
import { capitalizeString } from "@/lib/utils";

type SelectProps = {
  options: string[];
  label: string;
  value?: string;
  onChange: (nextStatus: string) => void;
  className?: string;
  widthClassName?: string;
};

export const Select: FC<SelectProps> = ({
  options,
  value,
  label,
  onChange,
  className,
  widthClassName = "w-[260px]",
}) => {
  const searchParams = useSearchParams();
  const isChecked = (option: string): boolean => value === option;

  const formattedLabel = value ? capitalizeString(value) : label;

  return (
    <div className={`${widthClassName} ${className ?? ""}`.trim()}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full group justify-start"
          >
            <span className="text-left">{formattedLabel}</span>
            <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180 ml-auto" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-[150px]">
          {options.map((option, index) => {
            return (
              <DropdownMenuCheckboxItem
                key={option}
                checked={isChecked(option)}
                onCheckedChange={(next: boolean) => next && onChange(option)}
              >
                {capitalizeString(option)}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
