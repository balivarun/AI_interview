FROM gradle:8.14.3-jdk21 AS build
WORKDIR /home/gradle/project
COPY --chown=gradle:gradle build.gradle settings.gradle gradlew ./
COPY --chown=gradle:gradle gradle ./gradle
RUN gradle dependencies --no-daemon
COPY --chown=gradle:gradle src ./src
RUN gradle bootJar --no-daemon

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /home/gradle/project/build/libs/interviewai-backend-0.1.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]