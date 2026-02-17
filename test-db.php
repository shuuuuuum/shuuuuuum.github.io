<!DOCTYPE html>
<html>
<head>
    <title>Test Form</title>
</head>
<body>
    <form id="test-form" action="submit-form.php" method="POST">
        <input type="text" name="name" value="Тестовое Имя" required>
        <input type="tel" name="phone" value="+79101234567" required>
        <input type="email" name="email" value="test@example.com" required>
        <input type="hidden" name="form_type" value="test">
        <button type="submit">Тест отправки</button>
    </form>
    
    <script>
        document.getElementById('test-form').addEventListener('submit', function(e) {
            e.preventDefault();
            fetch(this.action, {
                method: 'POST',
                body: new FormData(this)
            })
            .then(r => r.json())
            .then(data => alert(data.message))
            .catch(err => alert('Error: ' + err));
        });
    </script>
</body>
</html>