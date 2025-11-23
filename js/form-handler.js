// js/form-handler.js
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация масок для телефонов
    initPhoneMasks();
    
    // Обработчики для всех форм
    const forms = document.querySelectorAll('form[data-form-type]');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitForm(this);
        });
    });
});

// Функция для инициализации масок телефонов
function initPhoneMasks() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.placeholder = '+7 (___) ___-__-__';
        
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                let formattedValue = '';
                
                if (value.length > 0) formattedValue = '+7 ';
                if (value.length > 1) formattedValue += '(' + value.substring(1, 4);
                if (value.length > 4) formattedValue += ') ' + value.substring(4, 7);
                if (value.length > 7) formattedValue += '-' + value.substring(7, 9);
                if (value.length > 9) formattedValue += '-' + value.substring(9, 11);
                
                e.target.value = formattedValue;
            }
        });
        
        input.addEventListener('focus', function(e) {
            if (!e.target.value) {
                e.target.value = '+7 (';
            }
        });
        
        input.addEventListener('blur', function(e) {
            if (e.target.value === '+7 (') {
                e.target.value = '';
            }
        });
    });
}

// Функция для преобразования значения услуги в русское название
function getServiceName(serviceValue) {
    const serviceMap = {
        'design': 'Проектирование',
        'construction': 'Возведение зданий и сооружений',
        'municipal': 'Ремонт муниципальных объектов',
        'engineering': 'Монтаж инженерных сетей',
        'private': 'Строительство частного домовладения',
        'legal': 'Юридическое сопровождение',
        'examination': 'Строительная экспертиза',
        'restoration': 'Реставрационные работы'
    };
    
    return serviceMap[serviceValue] || serviceValue;
}

function submitForm(form) {
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    
    // Блокируем повторную отправку
    if (button.disabled) {
        return;
    }
    
    button.textContent = 'Отправка...';
    button.disabled = true;
    
    // Собираем данные формы
    const formData = new FormData(form);
    const data = {};
    
    // Преобразуем FormData в объект
    for (let [key, value] of formData.entries()) {
        data[key] = value.trim();
    }
    
    // Обрабатываем телефон
    const phoneInput = form.querySelector('input[type="tel"]');
    if (phoneInput) {
        let phoneValue = phoneInput.value.replace(/\D/g, '');
        if (phoneValue.startsWith('7')) {
            phoneValue = '8' + phoneValue.substring(1);
        }
        data['phone'] = phoneValue;
    }
    
    // Преобразуем значение услуги
    if (data.service) {
        data.service = getServiceName(data.service);
    }
    
    // Добавляем тип формы, если его нет
    if (!data.form_type) {
        data.form_type = form.dataset.formType || 'contact';
    }
    
    // Отправляем запрос
    fetch('submit-form.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            showMessage(data.message, 'success');
            form.reset();
        } else {
            showMessage('Ошибка: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.', 'error');
    })
    .finally(() => {
        button.textContent = originalText;
        button.disabled = false;
    });
}

// Функция для показа сообщений
function showMessage(message, type) {
    // Создаем или находим контейнер для сообщений
    let messageContainer = document.getElementById('form-messages');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'form-messages';
        messageContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 300px;
        `;
        document.body.appendChild(messageContainer);
    }
    
    // Создаем сообщение
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.cssText = `
        padding: 15px;
        margin-bottom: 10px;
        border-radius: 5px;
        color: white;
        font-family: Arial, sans-serif;
        font-size: 14px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    
    if (type === 'success') {
        messageElement.style.backgroundColor = '#4CAF50';
    } else {
        messageElement.style.backgroundColor = '#f44336';
    }
    
    messageContainer.appendChild(messageElement);
    
    // Удаляем сообщение через 5 секунд
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}
