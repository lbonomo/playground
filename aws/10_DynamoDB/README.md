# DynamoDB

## Target
 - Learn about DynamoDB.

## 

```
aws --profile terraform dynamodb list-tables
```

```
aws --profile terraform dynamodb describe-table --table-name GameScores
```

```
aws --profile terraform dynamodb put-item --table-name GameScores --item '{ "id": {"S": "c5070b52-bb93-4ece-898d-29fc4c5f408c"}, "username": {"S": "lbonomo"} }'
```

```
aws  --profile terraform dynamodb scan --table-name GameScores
```

## Terraform

`terraform init`

