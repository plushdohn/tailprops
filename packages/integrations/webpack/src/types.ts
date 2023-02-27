export type TailpropsPluginOptions = {
  framework: "react" | "preact";
} & {
  dry?: boolean;
  keep?: string | RegExp | ((filename: string) => boolean);
};
