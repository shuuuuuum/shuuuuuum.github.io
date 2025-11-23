<?php
// submit-form.php

// Включаем обработку CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Обрабатываем preflight OPTIONS запрос
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Подключаем конфиг с настройками БД
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Получаем raw data для обработки JSON
        $input = file_get_contents('php://input');
        
        // Пробуем получить данные из JSON
        $json_data = json_decode($input, true);
        
        // Если это JSON запрос, используем эти данные
        if (json_last_error() === JSON_ERROR_NONE && !empty($json_data)) {
            $name = trim($json_data['name'] ?? '');
            $phone = trim($json_data['phone'] ?? '');
            $email = trim($json_data['email'] ?? '');
            $service_type = trim($json_data['service'] ?? ($json_data['object-type'] ?? ''));
            $object_type = trim($json_data['object-type'] ?? '');
            $area = trim($json_data['area'] ?? '');
            $deadline = trim($json_data['deadline'] ?? '');
            $message = trim($json_data['message'] ?? '');
            $form_type = trim($json_data['form_type'] ?? 'service');
        } else {
            // Иначе используем обычные POST данные
            $name = trim($_POST['name'] ?? '');
            $phone = trim($_POST['phone'] ?? '');
            $email = trim($_POST['email'] ?? '');
            $service_type = trim($_POST['service'] ?? ($_POST['object-type'] ?? ''));
            $object_type = trim($_POST['object-type'] ?? '');
            $area = trim($_POST['area'] ?? '');
            $deadline = trim($_POST['deadline'] ?? '');
            $message = trim($_POST['message'] ?? '');
            $form_type = trim($_POST['form_type'] ?? 'service');
        }

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
            ':phone' => $phone,
            ':email' => $email,
            ':service_type' => $service_type,
            ':object_type' => $object_type,
            ':area' => $area,
            ':deadline' => $deadline,
            ':message' => $message,
            ':form_type' => $form_type
        ]);

        // Отправка email уведомления
        sendEmailNotification([
            'name' => $name,
            'phone' => $phone,
            'email' => $email,
            'service_type' => $service_type,
            'object_type' => $object_type,
            'area' => $area,
            'deadline' => $deadline,
            'message' => $message,
            'form_type' => $form_type
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
        'message' => 'Неверный метод запроса. Используйте POST.'
    ]);
}

// Функция для отправки email уведомления
function sendEmailNotification($data) {
    $to = 'lera_shumbasova@mail.ru';
    $subject = 'Новая заявка с сайта';
    
    // Формируем тело письма
    $email_body = "Новая заявка с сайта:\n\n";
    $email_body .= "Имя: " . $data['name'] . "\n";
    $email_body .= "Телефон: " . $data['phone'] . "\n";
    $email_body .= "Email: " . $data['email'] . "\n";
    $email_body .= "Тип услуги: " . $data['service_type'] . "\n";
    $email_body .= "Тип объекта: " . $data['object_type'] . "\n";
    $email_body .= "Площадь: " . $data['area'] . "\n";
    $email_body .= "Сроки: " . $data['deadline'] . "\n";
    $email_body .= "Сообщение: " . $data['message'] . "\n";
    $email_body .= "Тип формы: " . $data['form_type'] . "\n";
    $email_body .= "\nДата отправки: " . date('d.m.Y H:i:s') . "\n";
    
    $headers = "From: no-reply@" . $_SERVER['HTTP_HOST'] . "\r\n";
    $headers .= "Reply-To: " . $data['email'] . "\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";
    
    // Отправляем письмо
    return mail($to, $subject, $email_body, $headers);
}
?>
