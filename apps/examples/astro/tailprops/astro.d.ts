declare namespace astroHTML.JSX {
  export interface AstroBuiltinAttributes {
    tw?: string;
    [key: `tw-${string}`]: string;
  }
}
