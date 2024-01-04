# Use the official Microsoft .NET Core runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0

# Set the working directory in the container
WORKDIR /app

# Copy the output of the build stage into the app directory
COPY ./bin/Release/net8.0/publish/ .

# Set the ASP.NET Core URLS environment variable
ENV ASPNETCORE_URLS=http://+:80

# Expose port 80 for the application
EXPOSE 80

# Configure the container to run your application by default
ENTRYPOINT ["dotnet", "YourApplication.dll"]