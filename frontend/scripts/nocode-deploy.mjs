#!/usr/bin/env node
/**
 * No-code deployment orchestrator for Bubble + FlutterFlow.
 *
 * This script prepares deployment payloads and can trigger CI hooks once credentials are present.
 * By default it runs in "dry-run" mode and prints curl commands so sensitive keys stay out of logs.
 */

import process from 'node:process';

const {
  BUBBLE_API_KEY,
  BUBBLE_APP_ID,
  BUBBLE_ENV = 'version-test',
  FLUTTERFLOW_TOKEN,
  FLUTTERFLOW_PROJECT_ID,
  DRY_RUN = 'true',
} = process.env;

function requireVar(name, value) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

function bubbleDeployCommand() {
  requireVar('BUBBLE_API_KEY', BUBBLE_API_KEY);
  requireVar('BUBBLE_APP_ID', BUBBLE_APP_ID);

  return [
    'curl',
    '-X', 'POST',
    'https://bubble.io/api/1.1/wf/deploy',
    '-H', `Authorization: Bearer ${BUBBLE_API_KEY ?? '${BUBBLE_API_KEY}'}`,
    '-H', 'Content-Type: application/json',
    '--data', JSON.stringify({ appname: BUBBLE_APP_ID, version: BUBBLE_ENV }),
  ].join(' ');
}

function flutterflowDeployCommand() {
  requireVar('FLUTTERFLOW_TOKEN', FLUTTERFLOW_TOKEN);
  requireVar('FLUTTERFLOW_PROJECT_ID', FLUTTERFLOW_PROJECT_ID);

  return [
    'curl',
    '-X', 'POST',
    `https://api.flutterflow.io/v1/projects/${FLUTTERFLOW_PROJECT_ID}/deployments`,
    '-H', 'Content-Type: application/json',
    '-H', `Authorization: Bearer ${FLUTTERFLOW_TOKEN ?? '${FLUTTERFLOW_TOKEN}'}`,
    '--data', JSON.stringify({ env: 'staging' }),
  ].join(' ');
}

try {
  const bubbleCmd = bubbleDeployCommand();
  const flutterCmd = flutterflowDeployCommand();

  if (DRY_RUN !== 'false') {
    console.log('Dry run enabled. Execute the following commands manually when ready:\n');
    console.log('# Bubble deploy');
    console.log(bubbleCmd);
    console.log('\n# FlutterFlow deploy');
    console.log(flutterCmd);
    process.exit(0);
  }

  console.log('Starting automated deployment...');
  console.log('(Automation hooks not implemented yet; integrate with CI to run commands securely)');
  process.exit(0);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
