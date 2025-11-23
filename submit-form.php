<?php
// submit-form.php
header('Content-Type: application/json; charset=utf-8');

// Подключаем конфиг с настройками БД
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Получаем данные из формы
        $name = trim($_POST['name'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $service_type = trim($_POST['service'] ?? ($_POST['object-type'] ?? ''));
        $object_type = trim($_POST['object-type'] ?? '');
        $area = trim($_POST['area'] ?? '');
        $deadline = trim($_POST['deadline'] ?? '');
        $message = trim($_POST['message'] ?? '');
        $form_type = trim($_POST['form_type'] ?? 'service');

        // Валидация
        if (empty($name) || empty($phone) || empty($email)) {
            throw new Exception('Пожалуйста, заполните все обязательные поля');
        }

        // Валидация телефона (теперь принимаем 8XXXXXXXXXX)
        if (!preg_match('/^8[0-9]{10}$/', $phone)) {
            throw new Exception('Пожалуйста, введите корректный номер телефона');
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Пожалуйста, введите корректный email адрес');
        }

        // Сохраняем в базу данных
        $sql = "INSERT INTO contact_requests 
                (name, phone, email, service_type, object_type, area, deadline, message, form_type) 
                VALUES 
                (:name, :phone, :email, :service_type, :object_type, :area, :deadline, :message, :form_type)";

        $stmt = $pdo->prepare($sql);
        
        $stmt->execute([
            ':name' => $name,
            ':phone' => $phone, // Теперь сохраняется как 8XXXXXXXXXX
            ':email' => $email,
            ':service_type' => $service_type, // Теперь сохраняется русское название
            ':object_type' => $object_type,
            ':area' => $area,
            ':deadline' => $deadline,
            ':message' => $message,
            ':form_type' => $form_type
        ]);

        // Успешный ответ
        echo json_encode([
            'success' => true, 
            'message' => 'Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.'
        ]);

    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'success' => false, 
            'message' => $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false, 
        'message' => 'Неверный метод запроса'
    ]);
}
?>
