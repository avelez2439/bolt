# CLAUDE.md — BoltDB Codebase Guide

This file provides guidance for AI assistants working on the BoltDB codebase.

## Project Overview

BoltDB is a pure Go, embedded key-value store based on LMDB. It uses a B+tree data structure with fully serializable ACID transactions, lock-free MVCC (multiple readers, single writer), and memory-mapped files for zero-copy reads.

- **Package:** `github.com/boltdb/bolt`
- **Version:** 1.2.1 (stable, maintenance mode)
- **License:** MIT

## Repository Structure

```
bolt/
├── cmd/bolt/
│   ├── main.go          # CLI tool for database inspection/manipulation
│   └── main_test.go     # CLI tests
├── bolt_*.go            # Architecture/OS-specific implementations
│   ├── bolt_386.go      # i386
│   ├── bolt_amd64.go    # amd64
│   ├── bolt_arm.go      # ARM
│   ├── bolt_arm64.go    # ARM64
│   ├── bolt_ppc*.go     # PowerPC variants
│   ├── bolt_s390x.go    # IBM s390x
│   ├── bolt_windows.go  # Windows OS
│   ├── bolt_linux.go    # Linux OS
│   ├── bolt_openbsd.go  # OpenBSD OS
│   ├── bolt_unix.go     # Unix generic
│   ├── bolt_unix_solaris.go  # Solaris
│   └── boltsync_unix.go # Unix fsync
├── db.go                # Main DB type: open, close, transactions, mmapping
├── bucket.go            # Bucket type: key-value collections, nested buckets
├── cursor.go            # Cursor type: sequential iteration over bucket keys
├── tx.go                # Tx type: read-only and read-write transactions
├── node.go              # Internal B+tree node operations
├── page.go              # On-disk page representation and layout
├── freelist.go          # Free page tracking
├── errors.go            # Exported error variables
├── doc.go               # Package-level documentation comment
├── *_test.go            # Tests for each core module
├── Makefile             # Build and test targets
├── README.md            # User-facing documentation
└── appveyor.yml         # Windows CI configuration
```

## Core Types and Architecture

| Type | File | Role |
|------|------|------|
| `DB` | `db.go` | Database instance; manages mmap, transactions, batch writes |
| `Tx` | `tx.go` | Transaction; read-only or read-write, holds a consistent snapshot |
| `Bucket` | `bucket.go` | Named collection of key-value pairs; wraps private `bucket` type |
| `Cursor` | `cursor.go` | Iterator; walks B+tree leaves in key order |
| `node` | `node.go` | In-memory B+tree node; serializes to/from pages |
| `page` | `page.go` | On-disk page layout (branch, leaf, meta, freelist) |
| `freelist` | `freelist.go` | Tracks free and pending-free pages across transactions |

**Key design constraints:**
- A single file-level write lock (`flock`) ensures only one process opens a DB in read-write mode.
- Read-only transactions are lock-free via MVCC.
- Keys and values returned from `Get`/`Cursor` are only valid for the lifetime of the owning transaction — callers must copy if they need to persist beyond `Tx.Rollback`/`Tx.Commit`.
- Maximum key size: 32,768 bytes. Maximum value size: 2^31 − 2 bytes.

## Development Commands

```bash
# Build
make build          # or: make

# Run all tests
make test           # runs: go test -v -cover . && go test -v ./cmd/bolt

# Race-condition tests (uses simulation benchmarks)
make race

# Check for unhandled errors
make errcheck
```

> There are no external dependencies. `go get` is only needed for the `errcheck` tool.

## Testing Conventions

- **Framework:** Go's standard `testing` package
- **Property-based tests:** `testing/quick` (see `quick_test.go`)
- **Simulation/fuzz tests:** `simulation_test.go` — randomized black-box testing of the full API
- **Race detection:** run simulation benchmarks with `-race` via `make race`
- Each core file has a corresponding `_test.go` at the package level (white-box testing)
- CLI tests live in `cmd/bolt/main_test.go`

When adding new features, follow the existing pattern: unit tests in the matching `*_test.go` file, integration scenarios in `simulation_test.go` if appropriate.

## Code Conventions

### Naming
- **Package name:** `bolt` (single lowercase word)
- **Exported types:** PascalCase — `DB`, `Tx`, `Bucket`, `Cursor`
- **Internal types:** lowercase — `bucket`, `page`, `node`, `freelist`
- **Constants:** PascalCase for exported (`MaxKeySize`, `DefaultFillPercent`), all-caps with underscores are not used
- **Platform-specific files:** use build-tag filename suffixes (`_amd64`, `_windows`, `_unix`, etc.)

### Error Handling
- All exported errors are package-level `var` declarations in `errors.go` (e.g., `ErrDatabaseOpen`, `ErrInvalid`)
- Functions return `error`; never panic in library code
- The CLI tool defines its own error variables (e.g., `ErrUsage`, `ErrCorrupt`) in `cmd/bolt/main.go`

### Transactions
- Always pair `db.Begin` / `db.View` / `db.Update` calls with a deferred `tx.Rollback()` for read-only, or check the return of `tx.Commit()` for read-write
- Batch writes use `db.Batch(fn)` which coalesces multiple goroutine calls

### Platform Abstraction
- Architecture differences (page size, pointer size) are handled through filename-based Go build constraints, not `//go:build` tags in most files
- Do not introduce `runtime.GOARCH` switches inside shared files; add a new platform file instead

## CI/CD

- **Windows:** AppVeyor runs `go test -v ./...` on Windows Server 2012 R2 (see `appveyor.yml`)
- **No GitHub Actions** workflows exist; contributions can add them if needed
- The Makefile embeds git branch and commit hash into CLI binaries via `-ldflags`

## Important Caveats (for AI Assistants)

1. **No external dependencies** — do not add `go.mod`/`go.sum` or third-party imports without explicit discussion.
2. **Stability focus** — this project is in maintenance mode. Prefer bug fixes and small, safe improvements over feature additions.
3. **Memory-mapped I/O** — page/node data returned from the DB is backed by mmap; copying is required before the transaction closes.
4. **Single-writer model** — never suggest patterns that allow concurrent write transactions; they will deadlock.
5. **Cross-platform correctness** — any change touching low-level page layout or mmap must be verified on all supported architectures/OSes.
