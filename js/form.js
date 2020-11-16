"use strict"

document.addEventListener('DOMContentLoaded', function () {
	const form1 = document.getElementById('form1');
	const form2 = document.getElementById('form2');

	form1.addEventListener('submit', (e) => formSend(e, form1));
	form2.addEventListener('submit', (e) => formSend(e, form2));


	async function formSend(e, form) {
		e.preventDefault();

		let formData = new FormData(form);

		form.classList.add('_sending');

		let response = await fetch('sendmail.php', {
			method: 'POST',
			body: formData
		});
		if (response.ok) {
			let result = await response.json();
			alert(result.message);
			form.reset();
			form.classList.remove('_sending');
		} else {
			alert("Что-то пошло не так... Попробуйте снова");
			form.classList.remove('_sending');
			form.classList.remove('_sending');
		}

	}
});