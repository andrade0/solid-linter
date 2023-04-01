#!/usr/bin/env node

import fs from 'fs';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import {ocp} from "./ocp";
import {lsp} from "./lsp";
import {isp} from "./isp";
import {dip} from "./dip";
import {getRuntime} from "./lib/helpers/getRuntime";
import {green, log, red} from "./constants";

interface SolidLintConfig {
  src: string;
  ocp?: string;
  lsp?: string;
  isp?: string;
  dip?: string;
}

const argv: any = yargs(hideBin(process.argv)).argv;

// Check if a config file is provided as an argument
const configFile: any = argv.config || './.solidLint.json';

// Read the config file
let config: SolidLintConfig;
if (fs.existsSync(configFile)) {
  try {
    config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
  } catch (err: any) {
    log('Error reading config file:', err.message);
    process.exit(1);
  }
} else {
  log(`Config file "${red(configFile)}" not found.`);
  process.exit(1);
}

if(config && config.src) {
  const folderPath: string = config.src;
  const runOcpFromConfig: string = config.ocp === undefined? 'on': config.ocp;
  const runLspFromConfig: string = config.lsp === undefined? 'on': config.lsp;
  const runIspFromConfig: string = config.isp === undefined? 'on': config.isp;
  const runDipFromConfig: string = config.dip === undefined? 'on': config.dip;
  const runOcp: boolean = runOcpFromConfig === 'on';
  const runLsp: boolean = runLspFromConfig === 'on';
  const runIsp: boolean = runIspFromConfig === 'on';
  const runDip: boolean = runDipFromConfig === 'on';

  const runtime = getRuntime(folderPath);

  let errorCount = 0;

  // OPEN/CLOSED PRINCIPLE
  if(runOcp)
    errorCount += ocp(runtime);

  // LISKOV SUBSTITUTION PRINCIPLE
  if(runLsp)
    errorCount += lsp(runtime);

  // INTERFACE SEGREGATION PRINCIPLE
  if(runIsp)
    errorCount += isp(runtime);

  // DEPENDENCY INVERSION PRINCIPLE
  if(runDip)
    errorCount += dip(runtime);

  if(errorCount === 0) {
    log(green(`Your project follows all Solid Principles`));
  } else {
    log(`Your project breaks some Solid Principles, ${red(errorCount)} errors has been found`);
    process.exit(1);
  }

}
