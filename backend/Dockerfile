# 1. 빌드 단계 (JDK 17 이미지 사용 - Eclipse Temurin 사용)
FROM eclipse-temurin:17-jdk-jammy AS builder
WORKDIR /app
COPY . .
# 윈도우에서 만든 프로젝트라면 mvnw 실행 권한 문제 방지 및 실행
RUN chmod +x ./mvnw
RUN ./mvnw clean package -DskipTests

# 2. 실행 단계 (가벼운 이미지로 갈아타기 - JRE만 포함)
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# 빌드 단계에서 만들어진 jar 파일만 쏙 가져오기
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 4000
ENTRYPOINT ["java", "-jar", "app.jar"]