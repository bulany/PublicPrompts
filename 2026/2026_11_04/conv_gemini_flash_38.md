# Public Prompt: CLI Tool Naming — `dirstat` vs. `ds`

## Prompt
> When building a lightweight macOS/Unix disk-usage inspection tool aimed at muscle-memory use (similar to `ls`), should the project and command be named `ds` or `dirstat`? What are the namespace collision risks on Unix/macOS, discoverability trade-offs, and best practices for balancing speed with clarity?

## Response

### 1. Collision & Portability Risks
* **macOS / POSIX Base:** Neither standard POSIX nor macOS BSD defaults ship an executable named `ds`. (macOS uses `dscl` and `DirectoryService` daemons, leaving `ds` free).
* **Third-Party / Shell Conflicts:** 
  * `ds` is one of the most common user-defined shell aliases (often mapped to `docker stop`, `docker service`, or zsh `dirs -v`).
  * In enterprise Linux environments, `ds` or `dsctl` sometimes overlaps with 389 Directory Server tools.
* **PyPI / Git Discoverability:** Two-letter names (`ds`) are impossible to search on GitHub, are typically claimed or squatted on PyPI, and communicate zero context about the tool's purpose.

### 2. The Recommended Pattern: Named Package, Dual Binary Entrypoints
Follow the pattern used by tools like `ripgrep` (command: `rg`), `bat` (command: `bat`), and `fd-find` (command: `fd`):

1. **Repo / Package Name:** Use `dirstat` (or `py-dirstat`). It immediately signals heritage (`WinDirStat`, `KDirStat`), purpose (directory statistics), and functions well in web searches and README headings.
2. **CLI Executables:** In `pyproject.toml`, register *both* names under `project.scripts`:
   ```toml
   [project.scripts]
   dirstat = "dirstat.cli:main"
   ds = "dirstat.cli:main"
   ```
3. **Shell Convenience:** For the creator's personal environment, invoking `ds` satisfies `ls`-like muscle memory, while keeping `dirstat` fully qualified for scripts, automation, and non-conflicting environments.

### 3. Unix Philosophy & Architectural Considerations
* **Piping & Parsing:** Human-formatted flags (`du -h`, `sort -h`) are great for human eyes, but terrible for downstream pipe tools or LLM context ingestion. If `ds` is intended to provide markdown trees for LLMs, separate the raw data retrieval (byte integers) from the presentation layer (KiB/MiB/GiB formatting).
* **Subshell Security:** Direct pipeline string execution (`subprocess.run(..., shell=True)`) is convenient for prototype scripts, but breaks on paths with special characters or newlines. Long-term, prefer structured iteration (`os.scandir`) or chaining subprocesses without the subshell wrapper.