using DaiLyService.Data;
using DaiLyService.Services;

var builder = WebApplication.CreateBuilder(args);

// ====================
// DEPENDENCY INJECTION
// ====================

// Đăng ký Repository
builder.Services.AddScoped<IDaiLyRepository, DaiLyRepository>();
builder.Services.AddScoped<IKiemDinhRepository, KiemDinhRepository>();
builder.Services.AddScoped<IKhoRepository, KhoRepository>();
builder.Services.AddScoped<IDonHangDaiLyRepository, DonHangDaiLyRepository>();
builder.Services.AddScoped<IDonHangSieuThiRepository, DonHangSieuThiRepository>();

// Đăng ký Service
builder.Services.AddScoped<IDaiLyService, DaiLyBusinessService>();
builder.Services.AddScoped<IKiemDinhService, KiemDinhService>();
builder.Services.AddScoped<IKhoService, KhoService>();
builder.Services.AddScoped<IDonHangDaiLyService, DonHangDaiLyService>();
builder.Services.AddScoped<IDonHangSieuThiService, DonHangSieuThiService>();


// ====================
// SERVICES
// ====================

// Controllers
builder.Services.AddControllers();

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "DaiLy Service API",
        Version = "v1",
        Description = "Microservice quản lý Đại lý"
    });
});

// CORS cho Microservices
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// ====================
// BUILD & MIDDLEWARE
// ====================

var app = builder.Build();

// Swagger (Development & Production)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "DaiLy Service API v1");
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();