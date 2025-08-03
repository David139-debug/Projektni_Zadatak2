class Validator {
    constructor(config) {
        this.elementsConfig = config;
        this.errors = {};
        
        this.inputErrorGenerate();
        this.inputListener();
    }

    inputErrorGenerate() {
        for (let field in this.elementsConfig) {
            this.errors[field] = [];
            
        }
    }

    inputListener() {
        const inputSelector = this.elementsConfig;

        for (let field in inputSelector) {
            const element = document.querySelector(`input[name=${field}]`);
            
            element.addEventListener("input", this.validate.bind(this));
        }
    }

    validate(e) {
        const configFields = this.elementsConfig;

        const field = e.target;
        const fieldName = field.getAttribute("name");
        const fieldValue = field.value;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        this.errors[fieldName] = [];

        if (configFields[fieldName].required) {
            if (fieldValue === "") {
                this.errors[fieldName].push("Field is required.");
            }
        }

        if (configFields[fieldName].email) {
            if (!emailRegex.test(fieldValue)) {
                this.errors[fieldName].push("Invalid email format");
            }
        }

        if (configFields[fieldName].password) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
            if (!passwordRegex.test(fieldValue)) {
                this.errors[fieldName].push("Password must contain at least 1<br> uppercase letter, 1 lowercase letter,<br> and 1 number.");
            }
        }

        if (configFields[fieldName].matching) {
            const matchingEl = document.querySelector(`input[name=${configFields[fieldName].matching}]`);
            if (fieldValue !== matchingEl.value) {
                this.errors[fieldName].push("Passwords do not match.");
            }
        }

        this.generateErrors();
    }

    generateErrors() {
        for (const el of document.querySelectorAll("ul")) {
            el.remove();
        }

        for (let key of Object.keys(this.errors)) {
            if (this.errors[key].length === 0) continue;

            const parentEl = document.querySelector(`input[name=${key}]`).parentElement;
            const ul = document.createElement("ul");
            ul.classList.add("errorDiv");
            parentEl.appendChild(ul);

            this.errors[key].forEach(err => {
                const li = document.createElement("li");
                li.classList.add("errorMsg");
                li.innerHTML = err;
                ul.appendChild(li);
            })
        }
    }
};