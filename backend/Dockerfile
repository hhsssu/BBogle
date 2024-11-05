# 빌드 스테이지
FROM amazoncorretto:21-alpine AS build

WORKDIR /app

# 의존성 설치 및 빌드
COPY build.gradle settings.gradle gradlew ./
COPY gradle ./gradle
COPY src ./src
RUN ./gradlew build --no-daemon

# 실행 스테이지
FROM amazoncorretto:21-alpine

WORKDIR /app

# 빌드 결과물 복사
COPY --from=build /app/build/libs/bbogle-0.0.1-SNAPSHOT.jar /app/bbogle-0.0.1-SNAPSHOT.jar

# 애플리케이션 실행
CMD ["java", "-jar", "/app/bbogle-0.0.1-SNAPSHOT.jar"]
