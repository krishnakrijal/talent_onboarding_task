using Microsoft.EntityFrameworkCore;
using talent_onboarding.Server.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Get the connection string from configuration
var connectionString = builder.Configuration.GetConnectionString("DefaultConnectionString");


builder.Services.AddDbContext<IndustyConnectWeek2Context>(options =>
     options.UseSqlServer(connectionString, sqlOptions =>
     {
         sqlOptions.EnableRetryOnFailure(
             maxRetryCount: 3,           // Maximum number of retries
             maxRetryDelay: TimeSpan.FromSeconds(5), // Delay between retries
             errorNumbersToAdd: null);   // Specify any specific SQL error codes if needed
     }));


var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
