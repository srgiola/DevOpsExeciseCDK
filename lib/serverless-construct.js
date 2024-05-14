const { Construct } = require("constructs");
const lambda = require("aws-cdk-lib/aws-lambda");
const iam = require("aws-cdk-lib/aws-iam");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const dynamodb = require("aws-cdk-lib/aws-dynamodb");

class ServerlessConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id);

    // Crear la tabla DynamoDB 'test-execersiste'
    const testTable = new dynamodb.Table(this, "TestExecersisteTable", {
      tableName: "test-execersiste",
      partitionKey: { name: "id_request", type: dynamodb.AttributeType.STRING },
    });

    // Crear un rol IAM para la función Lambda
    const lambdaRole = new iam.Role(this, "lambda-role-devops-exercise", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      description: "Rol que permite a la función Lambda interactuar con otros servicios AWS.",
    });

    // Agregar políticas al rol para permitir la invocación de la función y el acceso a DynamoDB
    lambdaRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        "lambda:InvokeFunction",
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
      ],
      resources: ["*"],
    }));

    lambdaRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:Query",
        "dynamodb:Scan",
      ],
      resources: [testTable.tableArn],
    }));

    // Define la función Lambda
    this.miFuncionLambda = new lambda.Function(this, "lambda-devops-exercise", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("lambda"),
      role: lambdaRole, // Asigna el rol creado a la función Lambda
    });

    // Crear API Gateway de tipo REST
    const api = new apigateway.RestApi(this, "api-gateway-v2-devops-exercise", {
      restApiName: "ServerlessApi",
    });

    // Definir integración Lambda para el API Gateway
    const lambdaIntegration = new apigateway.LambdaIntegration(this.miFuncionLambda);
    
    // Crear recurso y método GET para la ruta /chuck
    const chuckResource = api.root.addResource("chuck");
    chuckResource.addMethod("GET", lambdaIntegration);

    // Permite que API Gateway invoque la función Lambda
    this.miFuncionLambda.addPermission("ApiGatewayInvoke", {
      principal: new iam.ServicePrincipal("apigateway.amazonaws.com"),
      sourceArn: api.arnForExecuteApi(),
    });
  }
}

module.exports = { ServerlessConstruct };
