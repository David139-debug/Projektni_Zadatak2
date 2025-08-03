const config = {
    "email": {
        email: true,
        required: true
    },

    "password": {
        required: true,
        password: true
    },

    "repeatPass": {
        required: true,
        matching: "password"
    }
};

const passwordInput = document.querySelector(".password");
const passwordBtn = document.querySelector(".show1");
let showPass = false;

const repeatPassInput = document.querySelector(".repeatPass");
const repeatPassBtn = document.querySelector(".show2");
let showRepeatPass = false;

passwordBtn.addEventListener("click", (e) => {
    showPass = !showPass;

    passwordInput.type = showPass ? "text" : "password"; 
});

repeatPassBtn.addEventListener("click", (e) => {
    showRepeatPass = !showRepeatPass;

    repeatPassInput.type = showRepeatPass ? "text" : "password"; 
});

const getTime = () => {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const time = `${hours}:${minutes}`;
    return time;
};

const form = document.querySelector(".form");
const validator = new Validator(config);

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const errors = validator.errors;
    let hasErrors = false;

    for (let fieldErrors of Object.values(errors)) {
        if (fieldErrors.length > 0) {
            hasErrors = true;
            break;
        }
    }

    if (hasErrors) {
        const time = getTime();
        const failedNotif = document.querySelector(".failedNotification");
        const failedTime = failedNotif.querySelector(".time");
        failedTime.innerText = time;
        failedNotif.classList.add("animateNotification");
        
        const hideTimeout = setTimeout(() => {
            failedNotif.classList.remove("animateNotification");
        }, [4000])

        failedNotif.querySelector(".closeBtn").addEventListener("click", () => {
            failedNotif.classList.remove("animateNotification");
            clearTimeout(hideTimeout);
        }); 
    } else {
        const generateToken = (length = 32) => {
            const chars = "e150986799c7380ae61b5465f4695c1bdd9f7060a01c587c67793d61afd6f4b1";
            let token = "";

            for (let i = 0; i < length; i++) {
                token += chars.charAt(Math.floor(Math.random() * chars.length));
            }

            return token;
        }
        const token = generateToken();

        localStorage.setItem("token", token);
        const time = getTime();

        const successNotif = document.querySelector(".notification");
        const successTime = successNotif.querySelector(".time");
        successTime.innerText = time;
        successNotif.classList.add("animateNotification");

        const hideTimeout = setTimeout(() => {
            successNotif.classList.remove("animateNotification");
        }, [4000])

        successNotif.querySelector(".closeBtn").addEventListener("click", () => {
            successNotif.classList.remove("animateNotification");
            clearTimeout(hideTimeout);
        });
    }
});

$(document).ready(function () {
    $('#weatherForm').on('submit', function (e) {
        e.preventDefault();

        const city = document.querySelector(".cityInput").value.trim();

        if (!city) {
            alert("Enter the city!");
            return;
        }

        $.ajax({
            url: "https://api.weatherapi.com/v1/current.json",
            method: "GET",
            data: {
                key: "9ca5bb0be5a34e3eaf1211732250208",
                q: city
            },
            success: function (res) {
                const temperature = res.current.temp_c;
                const latitude = res.location.lat;
                const longitude = res.location.lon;

                const mainDiv = document.querySelector(".data");
                mainDiv.innerHTML = `
                    <div>
                        <h1>Temperature</h1>
                        <p>${temperature}°C</p>
                    </div>
                    <div>
                        <h1>Latitude</h1>
                        <p>${latitude}</p>
                    </div>
                    <div>
                        <h1>Longitude</h1>
                        <p>${longitude}</p>
                    </div>`;

                document.querySelector(".cityInput").value = "";
            },
            error: function (err) {
                console.error(err);
                alert("Ajax error.");
            }
        });
    });
});
