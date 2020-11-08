$(document).ready(function() {
	$("#form1").submit(
		function () {
			let body = {
				name: $("#userName1").val(),
				phone: $("#userPhone1").val(),
			};

			console.log(body);
			fetch("../send.php", {
				method: "POST",
				body: JSON.stringify(body),
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				}
			}).then(
				() => {
					alert("Благодарим Вас за оставленную заявку! Мы свяжемся с Вами в ближайшее время.");
					$("#data").val("");
					$("#userPhone").val("");
					$("#userName").val("");
				},
				() => alert("Ой, что-то пошло не так...")
			);
			return false
		}
    )
    
	$("#form2").submit(
		function () {
			let body = {
				name: $("#userName2").val(),
				phone: $("#userPhone2").val(),
				description: $("#textarea").val(),
			};

			console.log(body);
			fetch("../send.php", {
				method: "POST",
				body: JSON.stringify(body),
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				}
			}).then(
				() => {
					alert("Благодарим Вас за оставленную заявку! Мы свяжемся с Вами в ближайшее время.");
					$("#data").val("");
					$("#userPhone").val("");
					$("#userName").val("");
				},
				() => alert("Ой, что-то пошло не так...")
			);
			return false
		}
	)
});