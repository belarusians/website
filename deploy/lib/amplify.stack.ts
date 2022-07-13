import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib/core";
import * as amplify from "aws-cdk-lib/aws-amplify";

export class AmplifyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const amplifyApp = new amplify.CfnApp(this, "belarusians-website", {
      name: "belarusians-website",
      accessToken: "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",
      repository: "https://github.com/belarusians/website",
    });

    const amplifyBranch = new amplify.CfnBranch(this, "belarusians-website-branch", {
      appId: amplifyApp.attrAppId,
      branchName: "main",
    });

    new amplify.CfnDomain(this, "belarusians-website-domain", {
      appId: amplifyApp.attrAppId,
      domainName: "belarusians.nl",
      subDomainSettings: [
        {
          branchName: amplifyBranch.attrBranchName,
          prefix: "",
        },
        {
          branchName: amplifyBranch.attrBranchName,
          prefix: "www",
        },
      ],
    });
  }
}
