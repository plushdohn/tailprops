import "react";

declare module "react" {
  export interface Attributes {
    tw?: string;
    [`tw-${string}`]?: string;
    "tw-hover"?: string;
    "tw-focus"?: string;
    "tw-active"?: string;
    "tw-disabled"?: string;
    "tw-group_hover"?: string;
    "tw-group_focus"?: string;
    "tw-group_active"?: string;
    "tw-group_disabled"?: string;
    "tw-sm"?: string;
    "tw-md"?: string;
    "tw-lg"?: string;
    "tw-xl"?: string;
    "tw-2xl"?: string;
  }
}
