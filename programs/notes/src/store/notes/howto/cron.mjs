#! /usr/bin/env node
"use strict";
import { integrate } from "../integration.mjs";
import { Merge } from "../scribe/merge.mjs";
import { Kitchen } from "./structure.mjs";

/**
 * Example of activity initiated using a cron job, to:
 * - Merge files generated in a process
 */

integrate(); // Proper initialization of variables

// -----------------------------------------------------
// Section: Merge files generated in a process
// -----------------------------------------------------

// Get instance of Topic
let kitchen = await Kitchen.getInstance();
Merge.mergeServer(kitchen, "localhost");

// -----------------------------------------------------
// Section: Generate standardized reports
// -----------------------------------------------------
// TODO
