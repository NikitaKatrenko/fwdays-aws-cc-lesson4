/**
 * ApiStack
 * ---------
 * Створює простий REST API:
 *
 * GET  /notes  → getNotesFn
 * POST /notes  → createNoteFn
 *
 * Додає CORS, щоб React міг викликати API.
 */

import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import * as cdk from "aws-cdk-lib";

export interface ApiStackProps extends StackProps {
    getNotesFn: IFunction;
    createNoteFn: IFunction;
}

export class ApiStack extends Stack {
    public readonly api: apigw.RestApi;

    constructor(scope: Construct, id: string, props: ApiStackProps) {
        super(scope, id, props);

        this.api = new apigw.RestApi(this, "NotesApi", {
            restApiName: "Notes Service",
            defaultCorsPreflightOptions: {
                allowOrigins: apigw.Cors.ALL_ORIGINS,
                allowMethods: apigw.Cors.ALL_METHODS,
            },
        });

        const notes = this.api.root.addResource("notes");

        notes.addMethod("GET", new apigw.LambdaIntegration(props.getNotesFn));
        notes.addMethod("POST", new apigw.LambdaIntegration(props.createNoteFn));

        // Виводимо URL у термінал після деплою
        new cdk.CfnOutput(this, "ApiUrl", {
            value: this.api.url,
        });
    }
}