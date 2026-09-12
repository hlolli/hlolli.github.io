#!/usr/bin/env bash
set -euo pipefail

site_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
sdk_path="$site_root/.local-packages/wasi-sdk-33.0"
if [[ -x "$sdk_path/bin/clang" && -x "$sdk_path/bin/wasm-ld" ]]; then
  exit 0
fi

case "$(uname -s)-$(uname -m)" in
  Darwin-arm64)
    archive=wasi-sdk-33.0-arm64-macos.tar.gz
    checksum=85c997a2665ead91673b5bb88b7d0df3fc8900df3bfa244f720d478187bbdc78
    ;;
  Linux-x86_64)
    archive=wasi-sdk-33.0-x86_64-linux.tar.gz
    checksum=0ba8b5bfaeb2adf3f29bab5841d76cf5318ab8e1642ea195f88baba1abd47bce
    ;;
  *)
    echo 'Set WASI_SDK_PATH to an installed WASI SDK on this platform.' >&2
    exit 1
    ;;
esac

mkdir -p "$site_root/.local-packages"
staging="$(mktemp -d "$site_root/.local-packages/wasi-download.XXXXXX")"
trap 'rm -rf "$staging"' EXIT
curl --fail --location --retry 3 --output "$staging/$archive" \
  "https://github.com/WebAssembly/wasi-sdk/releases/download/wasi-sdk-33/$archive"
printf '%s  %s\n' "$checksum" "$staging/$archive" | shasum -a 256 --check
mkdir "$staging/sdk"
tar -xzf "$staging/$archive" -C "$staging/sdk" --strip-components=1
mv "$staging/sdk" "$sdk_path"
