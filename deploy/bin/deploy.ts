#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { AmplifyStack } from "../lib/amplify.stack";

const app = new cdk.App();
const amplifyStack = new AmplifyStack(app, "belarusians-website-amplify", {
  env: { account: "381434666938", region: "eu-central-1" },
});

cdk.Tags.of(amplifyStack).add("Mara", "Mara");
