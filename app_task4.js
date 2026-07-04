/**
 * DecodeLabs - Task 4: Form Design and Validation
 * Pure Vanilla JavaScript implementation of real-time validation,
 * safe text injection (preventing XSS), and decoupling design standards.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // DOM REFERENCES (Using strict js- prefix naming convention)
    // ==========================================================================
    const form = document.querySelector('.js-form');
    
    const inputName = document.querySelector('.js-input-name');
    const inputEmail = document.querySelector('.js-input-email');
    const inputPhone = document.querySelector('.js-input-phone');
    const inputPassword = document.querySelector('.js-input-password');
    const inputConfirm = document.querySelector('.js-input-confirm');
    const inputTerms = document.querySelector('.js-input-terms');

    const errorName = document.querySelector('.js-error-name');
    const errorEmail = document.querySelector('.js-error-email');
    const errorPhone = document.querySelector('.js-error-phone');
    const errorPassword = document.querySelector('.js-error-password');
    const errorConfirm = document.querySelector('.js-error-confirm');
    const errorTerms = document.querySelector('.js-error-terms');

    const successModal = document.querySelector('.js-success-modal');
    const successEmailLabel = document.querySelector('.js-success-email');
    const closeModalBtn = document.querySelector('.js-close-modal');

    // ==========================================================================
    // REGEX VALIDATION PATTERNS
    // ==========================================================================
    // Email standard regex matcher
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // 10 digit phone number matcher
    const phoneRegex = /^\d{10}$/;
    // Password criteria: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\[{\]};:<>|./?,-]).{8,}$/;
    // Name criteria: letters and spaces only, minimum 3 characters
    const nameRegex = /^[a-zA-Z\s]{3,}$/;

    // ==========================================================================
    // VALIDATION UTILITY ACTIONS (Input -> Process -> Output)
    // ==========================================================================

    // OUTPUT: Displays invalid visual state (is-invalid) and safe error label
    const showError = (inputEl, errorEl, message) => {
        inputEl.classList.add('is-invalid');
        inputEl.classList.remove('is-valid');
        
        // SAFE TEXT MUTATION: Assign error string using textContent
        errorEl.textContent = message;
        errorEl.classList.add('is-visible');
    };

    // OUTPUT: Displays valid visual state (is-valid) and removes error label
    const showSuccess = (inputEl, errorEl) => {
        inputEl.classList.remove('is-invalid');
        inputEl.classList.add('is-valid');
        
        errorEl.textContent = '';
        errorEl.classList.remove('is-visible');
    };

    // ==========================================================================
    // INDIVIDUAL VALIDATION MODULES
    // ==========================================================================

    const validateName = () => {
        const value = inputName.value.trim();
        if (value === '') {
            showError(inputName, errorName, 'Full name is required.');
            return false;
        }
        if (!nameRegex.test(value)) {
            showError(inputName, errorName, 'Name must be at least 3 letters and contain only alphabets.');
            return false;
        }
        showSuccess(inputName, errorName);
        return true;
    };

    const validateEmail = () => {
        const value = inputEmail.value.trim();
        if (value === '') {
            showError(inputEmail, errorEmail, 'Email address is required.');
            return false;
        }
        if (!emailRegex.test(value)) {
            showError(inputEmail, errorEmail, 'Please enter a valid email address (e.g. name@domain.com).');
            return false;
        }
        showSuccess(inputEmail, errorEmail);
        return true;
    };

    const validatePhone = () => {
        const value = inputPhone.value.trim();
        if (value === '') {
            showError(inputPhone, errorPhone, 'Phone number is required.');
            return false;
        }
        if (!phoneRegex.test(value)) {
            showError(inputPhone, errorPhone, 'Please enter a valid 10-digit mobile number.');
            return false;
        }
        showSuccess(inputPhone, errorPhone);
        return true;
    };

    const validatePassword = () => {
        const value = inputPassword.value;
        if (value === '') {
            showError(inputPassword, errorPassword, 'Password is required.');
            return false;
        }
        if (!passwordRegex.test(value)) {
            showError(inputPassword, errorPassword, 'Password must be at least 8 characters long, containing 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special symbol.');
            return false;
        }
        showSuccess(inputPassword, errorPassword);
        
        // Re-validate confirm password if it already has value
        if (inputConfirm.value !== '') {
            validateConfirmPassword();
        }
        return true;
    };

    const validateConfirmPassword = () => {
        const value = inputConfirm.value;
        const passwordValue = inputPassword.value;
        if (value === '') {
            showError(inputConfirm, errorConfirm, 'Please confirm your password.');
            return false;
        }
        if (value !== passwordValue) {
            showError(inputConfirm, errorConfirm, 'Passwords do not match.');
            return false;
        }
        showSuccess(inputConfirm, errorConfirm);
        return true;
    };

    const validateTerms = () => {
        if (!inputTerms.checked) {
            // Checkbox inputs use class toggle on container or label
            inputTerms.classList.add('is-invalid');
            errorTerms.textContent = 'You must agree to the Terms of Service to register.';
            errorTerms.classList.add('is-visible');
            return false;
        }
        inputTerms.classList.remove('is-invalid');
        errorTerms.textContent = '';
        errorTerms.classList.remove('is-visible');
        return true;
    };

    // ==========================================================================
    // REAL-TIME INPUT EVENT LISTENERS
    // ==========================================================================
    inputName.addEventListener('input', validateName);
    inputEmail.addEventListener('input', validateEmail);
    inputPhone.addEventListener('input', validatePhone);
    inputPassword.addEventListener('input', validatePassword);
    inputConfirm.addEventListener('input', validateConfirmPassword);
    inputTerms.addEventListener('change', validateTerms);

    // ==========================================================================
    // FORM SUBMISSION HANDLER
    // ==========================================================================
    if (form) {
        form.addEventListener('submit', (event) => {
            // Prevent standard HTTP form post
            event.preventDefault();
            
            // Run all field validations
            const isNameValid = validateName();
            const isEmailValid = validateEmail();
            const isPhoneValid = validatePhone();
            const isPasswordValid = validatePassword();
            const isConfirmValid = validateConfirmPassword();
            const isTermsValid = validateTerms();
            
            // Validate entire form integrity
            const isFormValid = isNameValid && 
                                isEmailValid && 
                                isPhoneValid && 
                                isPasswordValid && 
                                isConfirmValid && 
                                isTermsValid;
                                
            if (isFormValid) {
                // PROCESS: Mutate local storage with registration data
                const userData = {
                    name: inputName.value.trim(),
                    email: inputEmail.value.trim(),
                    phone: inputPhone.value.trim()
                };
                localStorage.setItem('decodelabs_user', JSON.stringify(userData));
                
                // OUTPUT: Display success modal
                successEmailLabel.textContent = userData.email;
                successModal.classList.remove('is-hidden');
            } else {
                // Focus on the first invalid field
                const firstInvalid = document.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            }
        });
    }

    // ==========================================================================
    // MODAL TEARDOWN HANDLERS
    // ==========================================================================
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            // Hide Success overlay modal
            successModal.classList.add('is-hidden');
            
            // Reset the form and clear validation classes
            form.reset();
            const inputs = [inputName, inputEmail, inputPhone, inputPassword, inputConfirm, inputTerms];
            inputs.forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
            });
            const errors = [errorName, errorEmail, errorPhone, errorPassword, errorConfirm, errorTerms];
            errors.forEach(err => {
                err.textContent = '';
                err.classList.remove('is-visible');
            });
        });
    }

});
