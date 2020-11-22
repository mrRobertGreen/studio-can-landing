"use strict"

document.addEventListener('DOMContentLoaded', function () {


	// $(".button").click(() => {
	// 	console.log('click');
	// 	if ($("div.success").hasClass("visible")) {
	// 		// ...
	// 	} else {
	// 		$("div.success").addClass("visible")
	// 		$("div.success").removeClass("hidden")
	// 		setTimeout(() => {
	// 			$("div.success").removeClass("visible")
	// 			$("div.success").addClass("hidden")
	// 		}, 3000)
	// 	}
	// })


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
			showSuccessModal()
			form.reset();
			form.classList.remove('_sending');
		} else {
			showSuccessModal()
			// alert("Что-то пошло не так... Попробуйте снова");
			form.classList.remove('_sending');
			form.classList.remove('_sending');
		}
	}
});

const showSuccessModal = () => {
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