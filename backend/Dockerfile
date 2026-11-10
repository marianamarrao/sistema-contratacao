# Estágio 1 — Build
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw && ./mvnw -B -q dependency:go-offline
COPY src/ src/
RUN ./mvnw -B -q -DskipTests package

# Estágio 2 — Runtime
FROM eclipse-temurin:17-jre
WORKDIR /app
RUN useradd --system --no-create-home app
COPY --from=build /app/target/*.jar app.jar
USER app
EXPOSE 8080
# DATABASE_* , DATABASE_SSLMODE e CORS_ALLOWED_ORIGINS vêm do ambiente (Render)
ENTRYPOINT ["java", "-jar", "app.jar"]
