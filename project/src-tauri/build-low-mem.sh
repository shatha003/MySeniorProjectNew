#!/bin/bash
# Build script with memory constraints for low-RAM systems

# Set memory-efficient Rust compiler options
export CARGO_BUILD_JOBS=1
export RUSTFLAGS="-C opt-level=1 -C debug-assertions=no"

# Clean previous build attempts
cargo clean

# Build with single codegen unit to reduce memory usage
echo "Starting memory-efficient build..."
echo "This may take longer but uses less RAM"

cargo build --release --package project
