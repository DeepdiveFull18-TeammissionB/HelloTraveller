package com.hellotraveller.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.DynamoDbClientBuilder;
import io.github.cdimascio.dotenv.Dotenv;

@Configuration
public class DynamoDBConfig {

    @Bean
    public DynamoDbClient dynamoDbClient() {
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        String accessKey = dotenv.get("AWS_ACCESS_KEY_ID");
        String secretKey = dotenv.get("AWS_SECRET_ACCESS_KEY");
        String region = dotenv.get("AWS_REGION", "ap-northeast-2"); // Default to Seoul

        DynamoDbClientBuilder builder = DynamoDbClient.builder()
                .region(Region.of(region));
        System.out.println("DynamoDB Config - Region: " + region);
        if (accessKey == null || secretKey == null) {
            System.err.println("DynamoDB Config - WARNING: AWS Credentials not found in .env");
        } else {
            System.out.println("DynamoDB Config - AWS Credentials found.");
        }

        String endpoint = dotenv.get("DYNAMODB_ENDPOINT");
        if (endpoint != null && !endpoint.isEmpty()) {
            builder.endpointOverride(java.net.URI.create(endpoint));
        }

        if (accessKey != null && secretKey != null) {
            builder.credentialsProvider(StaticCredentialsProvider.create(
                    AwsBasicCredentials.create(accessKey, secretKey)));
        }

        return builder.build();
    }

    @Bean
    public DynamoDbEnhancedClient dynamoDbEnhancedClient(DynamoDbClient dynamoDbClient) {
        return DynamoDbEnhancedClient.builder()
                .dynamoDbClient(dynamoDbClient)
                .build();
    }
}
