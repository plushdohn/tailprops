import "react";

declare module "react" {
  export interface Attributes {
    tw?: string;
    [key: `tw-${string}`]: string;
  }
}
