using AuthService.Data;

var builder = WebApplication.CreateBuilder(args);

// =====================
// Add services
// =====================

// Log connection string for debugging
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
Console.WriteLine($"[AuthService] Connection String: {connectionString}");

// Repository
builder.Services.AddScoped<IAccountRepository, AccountRepository>();

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
