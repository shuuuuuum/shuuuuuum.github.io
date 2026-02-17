<?php
// Альтернативные настройки для XAMPP
$db_host = 'localhost';
$db_name = 'gilona_db';
$db_user = 'root';
$db_pass = '';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Пробуем подключиться без выбора базы данных для диагностики
    try {
        $pdo_temp = new PDO("mysql:host=$db_host;charset=utf8mb4", $db_user, $db_pass);
        echo "Подключение к серверу MySQL есть, но проблема с базой '$db_name'";
        // Создаем базу если не существует
        $pdo_temp->exec("CREATE DATABASE IF NOT EXISTS $db_name");
        $pdo_temp = null;
        
        // Пробуем снова
        $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    } catch (PDOException $e2) {
        die("Критическая ошибка подключения: " . $e2->getMessage());
    }
}

// Стартуем сессию
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>