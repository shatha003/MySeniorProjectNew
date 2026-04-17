# Build script with memory constraints for low-RAM systems
# Run this in PowerShell if you have memory issues

# Set memory-efficient Rust compiler options
$env:CARGO_BUILD_JOBS = "1"
$env:RUSTFLAGS = "-C opt-level=1 -C debug-assertions=no"

# Clean previous build attempts
Write-Host "Cleaning previous builds..." -ForegroundColor Yellow
cargo clean

# Build with single job to reduce memory usage
Write-Host "Starting memory-efficient build..." -ForegroundColor Green
Write-Host "This may take longer but uses less RAM" -ForegroundColor Cyan
Write-Host ""

cargo build --release --package project
