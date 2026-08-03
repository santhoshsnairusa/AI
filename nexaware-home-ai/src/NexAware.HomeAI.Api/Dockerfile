FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/NexAware.HomeAI.Api/NexAware.HomeAI.Api.csproj", "src/NexAware.HomeAI.Api/"]
COPY ["src/NexAware.HomeAI.Application/NexAware.HomeAI.Application.csproj", "src/NexAware.HomeAI.Application/"]
COPY ["src/NexAware.HomeAI.Domain/NexAware.HomeAI.Domain.csproj", "src/NexAware.HomeAI.Domain/"]
COPY ["src/NexAware.HomeAI.Infrastructure/NexAware.HomeAI.Infrastructure.csproj", "src/NexAware.HomeAI.Infrastructure/"]
COPY ["src/NexAware.HomeAI.Rag/NexAware.HomeAI.Rag.csproj", "src/NexAware.HomeAI.Rag/"]
COPY ["src/NexAware.HomeAI.Worker/NexAware.HomeAI.Worker.csproj", "src/NexAware.HomeAI.Worker/"]
RUN dotnet restore "./src/NexAware.HomeAI.Api/NexAware.HomeAI.Api.csproj"
COPY . .
WORKDIR "/src/src/NexAware.HomeAI.Api"
RUN dotnet build "./NexAware.HomeAI.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./NexAware.HomeAI.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "NexAware.HomeAI.Api.dll"]
