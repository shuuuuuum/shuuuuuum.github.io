# ООО "Гилона" - Веб-ресурс

![Логотип](images/logo.svg)

## Системные требования (Windows)
- Windows 10/11 (64-bit)
- [WSL 2](https://aka.ms/wsl2) (для нативного выполнения bash-команд)
- [XAMPP](https://www.apachefriends.org/) или [OpenServer](https://ospanel.io/)
- PHP 7.4+ (включен в XAMPP)
- MySQL 5.7+ (включен в XAMPP)
- Git for Windows (опционально)

## Установка на Windows

### 1. Установка необходимого ПО
1. Установите XAMPP: https://www.apachefriends.org/
2. Установите Git: https://git-scm.com/download/win
3. Включите WSL (для bash-команд):
   ```powershell
   wsl --install

## Дополнительные рекомендации для Windows

1. **Использование WSL**:
   - Для полной совместимости с Linux-командами из README.md
   - После установки WSL выполните:
     ```powershell
     wsl --set-default-version 2
     wsl --install -d Ubuntu
     ```

2. **Работа с путями**:
   - В PowerShell используйте двойные кавычки для путей с пробелами
   - Заменяйте слеши:
     ```powershell
     cd "C:\xampp\htdocs\Gilona"
     ```

3. **Сервисы**:
   - Для управления службами используйте:
     ```powershell
     Get-Service Apache* | Start-Service
     Get-Service MySQL* | Start-Service
     ```

Этот README.md полностью адаптирован для пользователей Windows и содержит все необходимые инструкции для развертывания проекта.
