#!/usr/bin/env bash
set -euo pipefail

ansible --version
ansible-lint --version || true
molecule --version || true

echo "OK"
