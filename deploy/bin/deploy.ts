#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { AmplifyStack } from "../lib/amplify.stack";

const ghToken = process.env.GITHUB_TOKEN;

if (!ghToken) {
  throw new Error("GITHUB_TOKEN environment variable is not set");
}

const app = new cdk.App();
const amplifyStack = new AmplifyStack(app, "belarusians-website-amplify",
  { env: { account: "381434666938", region: "eu-central-1" } },
  ghToken
);

cdk.Tags.of(amplifyStack).add("Mara", "Mara");
