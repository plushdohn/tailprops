import { writeFileSync } from "fs";
import prompts from "prompts";
import { applyTransformToConfig, readConfigFile } from "./config";
import { logBad, logDiff, logGood, logMeh, logStep } from "./logger";
import { typegenCommand } from "./typegen";

export async function initCommand(framework?: string) {
  logStep("Adding Tailprops transform to your Tailwind config...");

  const currentConfig = readConfigFile();

  if (currentConfig.source.includes("withTailprops")) {
    return logMeh(
      "Your Tailwind config already has the Tailprops transform applied. If you just want to generate types run the `tailprops typegen <framework>` command."
    );
  }

  const newConfigSource = applyTransformToConfig(currentConfig.source);

  logDiff(currentConfig.source, newConfigSource, currentConfig.fileName);

  const { configConfirm } = await prompts({
    type: "confirm",
    name: "configConfirm",
    initial: true,
    message: "These changes will be applied to your Tailwind config, confirm?",
  });

  if (!configConfirm) {
    return logBad("Okay, aborting.");
  }

  writeFileSync(currentConfig.fileName, newConfigSource);

  if (framework) {
    await typegenCommand(framework);
    return;
  }

  logGood("Done! You're all set.");
}
