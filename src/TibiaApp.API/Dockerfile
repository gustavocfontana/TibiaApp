FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY TibiaApp.Domain/TibiaApp.Domain.csproj TibiaApp.Domain/
COPY TibiaApp.Application/TibiaApp.Application.csproj TibiaApp.Application/
COPY TibiaApp.Infrastructure/TibiaApp.Infrastructure.csproj TibiaApp.Infrastructure/
COPY TibiaApp.API/TibiaApp.API.csproj TibiaApp.API/
RUN dotnet restore TibiaApp.API/TibiaApp.API.csproj

COPY . .
RUN dotnet publish TibiaApp.API/TibiaApp.API.csproj -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "TibiaApp.API.dll"]
