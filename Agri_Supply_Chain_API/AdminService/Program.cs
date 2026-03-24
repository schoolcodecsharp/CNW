using AdminService.Data;
using AdminService.Services;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// =====================
// Add services
// =====================

// Log connection string for debugging
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
Console.WriteLine($"[AdminService] Connection String: {connectionString}");

// Repository
builder.Services.AddScoped<IAdminRepository, AdminRepository>();

// Service
builder.Services.AddScoped<IAdminService, AdminService.Services.AdminService>();

// Controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// =====================
// Middleware
// =====================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
