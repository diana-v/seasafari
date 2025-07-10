const RuTemplate = (ref: string, email: string, amount: string, validFrom: string, validTo: string): string => {
    return `
<!DOCTYPE html>
<html lang="ru">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Подтверждение покупки подарочной карты</title>
<style>
    body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    background-color: #f9f9f9;
    margin: 0;
    padding: 0;
}
    .container {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    background-color: #f1f1f1;
    padding: 20px;
}
    .header {
    background-color: #f1f1f1;
    padding: 20px 0;
    text-align: center;
}
    .title {
    text-align: center;
    font-weight: 600;
    color: #15496b;
    font-size: 24px;
}
    .title a {
    color: #15496b; /* Same color as title */
    text-decoration: none;
}
    .logo {
    max-width: 150px;
    height: auto;
    margin-bottom: 20px;
}
    .content {
    background-color: #ffffff;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
    .content p {
    font-size: 14px;
}
    .data-fields-container {
    border-left: 1px solid #ccc;
    margin: 15px 0;
    padding-left: 10px;
    margin-left: 10px;
}
    .data-fields-container p {
    margin-top: 0;
    margin-bottom: 10px;
}
    .greeting, .closing {
    margin-top: 20px;
    margin-bottom: 20px;
}
    .footer {
    text-align: center;
    font-size: 12px;
    color: #777777;
    margin-top: 20px;
}

    /* Media Queries */
    @media only screen and (max-width: 600px) {
    .container {
    padding: 10px 0;
}
    .title {
    font-size: 16px;
}
    .logo {
    max-width: 120px;
}
    .content {
    padding: 10px;
}
    .data-fields-container {
    margin: 10px 0;
    padding-left: 5px;
    margin-left: 5px;
}
    .data-fields-container p {
    font-size: 12px;
}
    .greeting, .closing {
    font-size: 12px;
}
    .footer {
    font-size: 10px;
}
    .content p {
    font-size: 12px;
}
}
</style>
</head>
<body>
<div class="container">
    <div class="header">
        <img class="logo" src="www.seasafari.lt/images/logo.png" alt="logo" />
    </div>
    <div class="content">
        <h1 class="title"><a href="#" style="color: inherit;">Подтверждение покупки подарочной карты</a></h1>
        <p class="greeting">Уважаемый клиент,</p>
        <p>Спасибо за вашу покупку! Ниже приведены данные вашей подарочной карты:</p>
        <div class="data-fields-container">
            <p><strong>Номер ссылки:</strong> <span class="data-field">${ref}</span></p>
            <p><strong>Email получателя:</strong> <span class="data-field">${email}</span></p>
            <p><strong>Сумма подарочной карты:</strong> <span class="data-field">€${amount}</span></p>
            <p><strong>Действует с:</strong> <span class="data-field">${validFrom}</span></p>
            <p><strong>Действует до:</strong> <span class="data-field">${validTo}</span></p>
        </div>
        <p>Обратите внимание, что для использования этой подарочной карты требуется предварительная запись.</p>
        <p>Эта подарочная карта действительна в течение одного года с даты покупки.</p>
        <p>Если у вас есть какие-либо вопросы, не стесняйтесь связаться с нами по электронной почте <a href="mailto:info@seasafari.lt" style="color: inherit;">info@seasafari.lt</a> или позвонить по телефону <a href="tel:+37067572133" style="color: inherit;">+37067572133</a>.</p>
        <p class="closing">С наилучшими пожеланиями,<br>Команда SeaSafari</p>
    </div>
    <div class="footer">
        <p>&copy; 2025 SeaSafari. Все права защищены.</p>
        <p>SeaSafari, Danės g. 5, Клайпеда</p>
    </div>
</div>
</body>
</html>`;
};

export default RuTemplate;
