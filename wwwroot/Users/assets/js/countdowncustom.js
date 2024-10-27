// Set the date we're counting down to
(function () {
	const second = 1000,
		minute = second * 60,
		hour = minute * 60,
		day = hour * 24;
	let today = new Date(),
		dd = String(today.getDate()).padStart(2, "0"),
		mm = String(today.getMonth() + 1).padStart(2, "0"),
		yyyy = today.getFullYear(),
		nextYear = yyyy + 1,
		dayMonth = "10/20/",
		birthday = dayMonth + yyyy;

	today = mm + "/" + dd + "/" + yyyy;
	if (today > birthday) {
		birthday = dayMonth + nextYear;
	}
	//end

    (function () {
        const countDown = new Date(birthday).getTime();
        const day = 1000 * 60 * 60 * 24;
        const hour = 1000 * 60 * 60;
        const minute = 1000 * 60;
        const second = 1000;

        const x = setInterval(function () {
            const now = new Date().getTime();
            const distance = countDown - now;

            document.getElementById("day").innerText = Math.floor(distance / day);
            document.getElementById("Hours").innerText = Math.floor((distance % day) / hour);
            document.getElementById("Minutes").innerText = Math.floor((distance % hour) / minute);
            document.getElementById("Seconds").innerText = Math.floor((distance % minute) / second);

            //do something later when date is reached
            if (distance < 0) {
                document.getElementById("headline").innerText = "It's my birthday!";
                document.getElementById("countdown").style.display = "none";
                document.getElementById("content").style.display = "block";
                clearInterval(x);
            }
        }, 1000);
    })();

})();
