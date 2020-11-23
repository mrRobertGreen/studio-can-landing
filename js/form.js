"use strict"

document.addEventListener('DOMContentLoaded', function () {

	const form1 = document.getElementById('form1');
	const form2 = document.getElementById('form2');

	form1.addEventListener('submit', (e) => formSend(e, form1));
	form2.addEventListener('submit', (e) => formSend(e, form2));


	async function formSend(e, form) {
		e.preventDefault();

		let formData = new FormData(form);
		let error = formValidate(form);

		if (error === 0) {
			form.classList.add('_sending');
			let response = await fetch('sendmail.php', {
				method: 'POST',
				body: formData
			});
			if (response.ok) {
				let result = await response.json();
				showSuccessModal()
				form.reset();
				form.classList.remove('_sending');
			} else {
				alert("Что-то пошло не так... Попробуйте снова");
				form.classList.remove('_sending');
			}
		} else {
			// ...
		}
	}
});

const showSuccessModal = () => {
	// показ и автозакрытие попапа с сообщением об успехе
	if ($("div.success").hasClass("visible")) {
		// ...
	} else {
		$("div.success").addClass("visible")
		$("div.success").removeClass("hidden")
		setTimeout(() => {
			$("div.success").removeClass("visible")
			$("div.success").addClass("hidden")
		}, 2500)
	}
}

function formValidate(form) {
	// валидация формы
	let error = 0; // количество ошибок
	let formReq = document.querySelectorAll('._req'); // обязательные поля ввода

	for (let index = 0; index < formReq.length; index++) {
		const input = formReq[index];

		if (!isChild(form, input)) continue; // если это поле не из этой формы, то пропускаем

		formRemoveError(input); // очищаем прошлые ошибки, на всякий случай

		if (input.getAttribute("type") === "checkbox" && input.checked === false) {
			// если это чекбокс и он пустой
			formAddError(input);
			error++;
			input.addEventListener("change", () => {
				// убираем ошибку, если пользователь ставит галочку
				formRemoveError(input)
			})
			break; // выходим, т.к. хотим показывать ошибки по очереди, а не все сразу
		} else {
			// если это просто input
			if (input.value === '') {
				formAddError(input);
				error++;
				input.addEventListener("keyup", () => {
					// убираем ошибку, если пользователь начинает что-то вводить
					formRemoveError(input)
				})
				break;
			}
		}
	}
	return error;
}

function formAddError(input) {
	input.parentElement.classList.add('_error');
}

function formRemoveError(input) {
	input.parentElement.classList.remove('_error');
}

function isChild(parent, child) {
	// проверяет на наличие дочернего элемента child у parent
	if (parent.contains(child)) return true;
	return false;
}