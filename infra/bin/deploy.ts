#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { Builder } from "@sls-next/lambda-at-edge";
import { MainStack } from "../lib/main.stack";

const builder = new Builder(".", "./build", { cwd: "../app", args: ["build"] });

builder
  .build(true)
  .then(() => {
    const app = new cdk.App();

    const mainStack = new MainStack(app, "belarusians-website",
      { env: { account: "381434666938", region: "eu-central-1" } }
    );

    cdk.Tags.of(mainStack).add("Mara", "Mara");
  })
  .catch(e => {
    console.error(e);
  });
