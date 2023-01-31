build:
	cargo build --release

test: build
	cargo test
