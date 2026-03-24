using NongDanService.Data;
using NongDanService.Services;

var builder = WebApplication.CreateBuilder(args);

// =====================
// Add services
// =====================

// Log connection string for debugging
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
Console.WriteLine($"[NongDanService] Connection String: {connectionString}");

// Repository
builder.Services.AddScoped<ISanPhamRepository, SanPhamRepository>();
builder.Services.AddScoped<INongDanRepository, NongDanRepository>();
builder.Services.AddScoped<ITrangTraiRepository, TrangTraiRepository>();
builder.Services.AddScoped<ILoNongSanRepository, LoNongSanRepository>();
builder.Services.AddScoped<IDonHangDaiLyRepository, DonHangDaiLyRepository>();

// Service
builder.Services.AddScoped<ISanPhamService, SanPhamService>();
builder.Services.AddScoped<INongDanService, NongDanService.Services.NongDanService>();
builder.Services.AddScoped<ITrangTraiService, TrangTraiService>();
builder.Services.AddScoped<ILoNongSanService, LoNongSanService>();
builder.Services.AddScoped<IDonHangDaiLyService, DonHangDaiLyService>();

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
