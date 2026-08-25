/* ==========================================================================
   ROYAL BITES — Reusable validation helpers
   ========================================================================== */

const Validate = {
    name: function (value) {
        return value.trim().length >= 3 && /^[a-zA-Z\s.'-]+$/.test(value.trim());
    },
    email: function (value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    },
    phone: function (value) {
        return /^[6-9]\d{9}$/.test(value.trim());
    },
    pincode: function (value) {
        return /^\d{6}$/.test(value.trim());
    },
    address: function (value) {
        return value.trim().length >= 10;
    },
    notEmpty: function (value) {
        return value.trim().length > 0;
    },
    minLength: function (value, len) {
        return value.trim().length >= len;
    }
};

function setFieldState(input, isValid, message) {
    const feedback = input.parentElement.querySelector(".invalid-feedback");
    if (isValid) {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        if (feedback && message) {
            feedback.textContent = message;
        }
    }
    return isValid;
}
