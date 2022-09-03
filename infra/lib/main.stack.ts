import { Construct } from "constructs";
import { NextJSLambdaEdge } from '@sls-next/cdk-construct';
import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";

export class MainStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    const domainName = "belarusians.nl";

    new NextJSLambdaEdge(this, "NextJsApp", {
      serverlessBuildOutDir: "./build"
    });

    new s3.Bucket(this, "belarusians-emails-bucket", {
      bucketName: "belarusians-emails",
    });
  }
}
