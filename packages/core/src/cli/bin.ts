#! /usr/bin/env node

import { program } from "commander";
import { initCommand } from "./init";
import { typegenCommand } from "./typegen";

program
  .name("tailprops")
  .description(
    "A command-line tool for automating setup steps in Tailprops projects"
  );

program
  .command("init [framework]")
  .description(
    "Adds the Tailprops content transform to your Tailwind config and optionally generates TS types."
  )
  .action(initCommand);

program
  .command("typegen <framework>")
  .description(
    "Generates types for a framework using the theme from your Tailwind config."
  )
  .action(typegenCommand);

program.parseAsync();
