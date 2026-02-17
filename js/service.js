// Дополнительный JavaScript для страницы услуги
document.addEventListener('DOMContentLoaded', function() {
    // Плавная прокрутка к форме при клике на кнопки "Заказать проект"
    document.querySelectorAll('a[href="#service-contact"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Динамическое изменение placeholder для текстового поля сообщения
    const serviceTypeSelect = document.getElementById('service-type');
    const serviceMessage = document.getElementById('service-message');
    
    if (serviceTypeSelect && serviceMessage) {
        serviceTypeSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex].text;
            serviceMessage.placeholder = `Опишите ваши пожелания к проекту ${selectedOption.toLowerCase()}...`;
        });
    }
});