/**
 * LambdaStack
 * ------------
 * Створює 2 Lambda-функції:
 * - getNotes
 * - createNote
 *
 * Передає їм NOTES_TABLE у середовище
 * і дає права читання/запису в DynamoDB.
 */

import { Stack, StackProps, Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import * as path from "path";

export interface LambdaStackProps extends StackProps {
    notesTable: Table;
}

export class LambdaStack extends Stack {
    public readonly getNotesFn: NodejsFunction;
    public readonly createNoteFn: NodejsFunction;

    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props);

        this.getNotesFn = new NodejsFunction(this, "GetNotesFn", {
            entry: path.join(__dirname, "../../lambdas/getNotes.ts"),
            handler: "handler",
            runtime: Runtime.NODEJS_20_X,
            timeout: Duration.seconds(10),
            environment: {
                NOTES_TABLE: props.notesTable.tableName,
            },
        });

        this.createNoteFn = new NodejsFunction(this, "CreateNoteFn", {
            entry: path.join(__dirname, "../../lambdas/createNote.ts"),
            handler: "handler",
            runtime: Runtime.NODEJS_20_X,
            timeout: Duration.seconds(10),
            environment: {
                NOTES_TABLE: props.notesTable.tableName,
            },
        });

        // Права доступу
        props.notesTable.grantReadData(this.getNotesFn);
        props.notesTable.grantReadWriteData(this.createNoteFn);
    }
}
