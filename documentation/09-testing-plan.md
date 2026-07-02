# 09-testing-plan

## Purpose
- Menyediakan checklist pengujian minimal agar setiap perubahan tidak merusak alur utama.

## Test areas
- **Unit-like checks**: path validation, state transitions, config merge logic.
- **Integration**: start/stop runtime di mesin lokal dan pembacaan endpoint.
- **UI smoke**: flow utama dari dashboard dan error state handling.
- **Config write**: preview, confirm, dan rollback manual.

## Manual test cases
- Start dengan workspace valid -> process start success.
- Start dengan path invalid -> should fail before runtime command.
- Simulate runtime error -> status error muncul dan logs readable.
- Run stop while running -> process terminated and state reset.

## Acceptance criteria
- Tidak ada regresi pada flow utama.
- Setiap test case memiliki expected output yang jelas.
