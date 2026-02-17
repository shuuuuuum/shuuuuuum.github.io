// js/form-handler.js
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация масок для телефонов
    initPhoneMasks();
    
    // Главная форма
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitForm(this);
        });
    }
    
    // Формы услуг
    const serviceForm = document.getElementById('service-form');
    if (serviceForm) {
        serviceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitForm(this);
        });
    }
});

// Функция для инициализации масок телефонов
function initPhoneMasks() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        // Устанавливаем placeholder
        input.placeholder = '+7 (___) ___-__-__';
        
        // Обработчик ввода
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Форматируем номер
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
        
        // Обработчик фокуса
        input.addEventListener('focus', function(e) {
            if (!e.target.value) {
                e.target.value = '+7 (';
            }
        });
        
        // Обработчик потери фокуса
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
    
    // Преобразуем номер телефона перед отправкой (+7 меняем на 8)
    const formData = new FormData(form);
    const phoneInput = form.querySelector('input[type="tel"]');
    if (phoneInput) {
        let phoneValue = phoneInput.value.replace(/\D/g, '');
        // Заменяем +7 на 8 для хранения в БД
        if (phoneValue.startsWith('7')) {
            phoneValue = '8' + phoneValue.substring(1);
        }
        formData.set('phone', phoneValue);
    }
    
    // Преобразуем значение услуги в русское название (для главной формы)
    const serviceSelect = form.querySelector('select[name="service"]');
    if (serviceSelect && serviceSelect.value) {
        const serviceName = getServiceName(serviceSelect.value);
        formData.set('service', serviceName);
    }
    
    fetch(form.action, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            form.reset();
            
            // Сбрасываем placeholder для форм услуг
            const serviceMessage = document.getElementById('service-message');
            if (serviceMessage) {
                serviceMessage.placeholder = 'Опишите ваши пожелания...';
            }
        } else {
            alert('Ошибка: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.');
    })
    .finally(() => {
        button.textContent = originalText;
        button.disabled = false;
    });
}
