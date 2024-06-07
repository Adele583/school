import { auth, googleProvider, signInWithPopup, createUserWithEmailAndPassword } from '../firebase-config.js';

const signupForm = document.getElementById("signupForm"),
    email = document.getElementById("email"),
    password = document.getElementById("password"),
    confirmPassword = document.getElementById("confirmPassword"),
    emailError = document.getElementById("emailError"),
    passwordError = document.getElementById("passwordError"),
    confirmPasswordError = document.getElementById("confirmPasswordError"),
    googleSignup = document.querySelector(".google"),
    pwShowHide = document.querySelectorAll(".eye-icon");

// Password visibility toggle
pwShowHide.forEach(eyeIcon => {
    eyeIcon.addEventListener("click", () => {
        let pwFields = eyeIcon.parentElement.querySelectorAll(".password");

        pwFields.forEach(password => {
            if (password.type === "password") {
                password.type = "text";
                eyeIcon.classList.replace("bx-hide", "bx-show");
            } else {
                password.type = "password";
                eyeIcon.classList.replace("bx-show", "bx-hide");
            }
        });
    });
});

signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let valid = true;

    emailError.style.display = 'none';
    passwordError.style.display = 'none';
    confirmPasswordError.style.display = 'none';

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email.value)) {
        emailError.textContent = "Please enter a valid email address";
        emailError.style.display = 'block';
        valid = false;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{11,}$/;
    if (!passwordPattern.test(password.value)) {
        passwordError.textContent = "Error: Password format should be like A1@63502973a";
        passwordError.style.display = 'block';
        valid = false;
    }

    if (password.value !== confirmPassword.value) {
        confirmPasswordError.textContent = "Passwords do not match";
        confirmPasswordError.style.display = 'block';
        valid = false;
    }

    if (valid) {
        try {
            console.log("Creating user with email:", email.value);
            const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
            console.log("User created:", userCredential.user);

            const idToken = await userCredential.user.getIdToken();
            console.log("ID Token obtained:", idToken);

            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({ email: email.value, password: password.value })
            });

            const data = await response.json();
            console.log("Backend response:", data);

            if (response.ok) {
                localStorage.setItem('token', data.token);
                alert("Signup successful!");
                window.location.href = '../dashboard/dashboard.html';
            } else {
                if (data.error === "auth/email-already-in-use") {
                    emailError.textContent = "Email already in use. Please use a different email.";
                    emailError.style.display = 'block';
                } else {
                    alert(data.error);
                }
            }
        } catch (error) {
            console.error("Error during signup:", error);
            if (error.code === "auth/email-already-in-use") {
                emailError.textContent = "Email already in use. Please use a different email.";
                emailError.style.display = 'block';
            } else {
                alert(error.message);
            }
        }
    }
});

googleSignup.addEventListener("click", async () => {
    try {
        console.log("Initiating Google sign-in");
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log("Google sign-in successful:", user);

        const idToken = await user.getIdToken();
        console.log("ID Token obtained:", idToken);

        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            }
        });

        const data = await response.json();
        console.log("Backend response:", data);

        if (response.ok) {
            localStorage.setItem('token', data.token);
            alert(`Welcome, ${user.displayName}`);
            window.location.href = '../dashboard/dashboard.html';
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("Error during Google sign-in:", error);
        alert(error.message);
    }
});
