import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as amplify from "aws-cdk-lib/aws-amplify";
import * as s3 from "aws-cdk-lib/aws-s3";

export class AmplifyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps, githubAccessToken: string) {
    super(scope, id, props);
    const domainName = "belarusians.nl";

    const amplifyApp = new amplify.CfnApp(this, "belarusians-website", {
      name: "belarusians-website",
      accessToken: githubAccessToken,
      repository: "https://github.com/belarusians/website",
    });

    const mainBranch = new amplify.CfnBranch(this, "belarusians-website-main-branch", {
      appId: amplifyApp.attrAppId,
      branchName: "main",
    });

    new amplify.CfnDomain(this, "belarusians-website-domain", {
      appId: amplifyApp.attrAppId,
      domainName,
      subDomainSettings: [
        {
          branchName: mainBranch.attrBranchName,
          prefix: "",
        },
        {
          branchName: mainBranch.attrBranchName,
          prefix: "www",
        },
      ]
    });

    new s3.Bucket(this, "belarusians-emails-bucket", {
      bucketName: "belarusians-emails",
    });
  }
}
