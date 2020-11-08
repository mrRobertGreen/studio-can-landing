<?php

//An array of HTTP methods that
//we want to allow.
$allowedMethods = array(
    'POST'
);

//The current request type.
$requestMethod = strtoupper($_SERVER['REQUEST_METHOD']);


//If the request method isn't in our
//list of allowed methods.
if (!in_array($requestMethod, $allowedMethods)) {
    //Send a 405 Method Not Allowed header.
    header($_SERVER["SERVER_PROTOCOL"] . " 405 Method Not Allowed", true, 405);
    //Halt the script's execution.
    exit;
}

$name = $_POST['name'];
$phone = $_POST['phone'];
$desc = $_POST['description'];

$name = htmlspecialchars($name);
$phone = htmlspecialchars($phone);
$desc = htmlspecialchars($desc);

$name = urldecode($name);
$phone = urldecode($phone);
$desc = urldecode($desc);

$name = trim($name);
$phone = trim($phone);
$desc = trim($desc);


$mes = "Имя заказчика: $name \nТелефон, почта или мессенджер: $phone \nКомментарий: $desc";

if (mail("mrrobertgreen17@gmail.com", "Новая заявка StudentCan", $mes, "Content-type:text/plain; charset = UTF-8\r\nFrom:example@gmail.com")) {
    echo "сообщение успешно отправлено";
} else {
    echo "при отправке сообщения возникли ошибки";
}

?>
