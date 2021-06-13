//SIGNUP MODAL----------------------------------------------
const modal = document.querySelector('.modal')
const registerBtn = document.querySelector('.register-btn') //opens modal
const closeModal = document.querySelector('.close')

registerBtn.onclick = function() {
    modal.style.visibility = "visible";
}

closeModal.onclick = function() {
    modal.style.visibility = "hidden"
}

window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.visibility = "hidden";
    }
}

//HTTP REQUESTS---------------------------------------------------
const formLogin = document.querySelector('.form-login')
const formSignup = document.querySelector('.signup-form')

//Login
formLogin.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = formLogin.elements.email.value
    const password = formLogin.elements.password.value
    request(email, password)
})

//Sign up
formSignup.addEventListener('submit', (e) => {
    e.preventDefault()
    const name = formSignup.elements.name.value
    const email = formSignup.elements.email.value
    const password = formSignup.elements.password.value
    request(email, password, name)
})

const request = async (email, password, name) => {
    const url = 'https://marin-task-manager.herokuapp.com/'
    
    fetch(url + (name ? '/users': '/users/login'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password,
            name: name
        })
    }).then((res) => {

        if (name && (res.status !== 201)) {
            const signupError = document.querySelector('.signup-error')
            signupError.textContent = "Make sure your email is correct. Your password must be at least 8 characters long."
            throw new Error()
        }

        if (!name && (res.status !== 200)) {
            const message = document.querySelector('.login-error')
            message.textContent = 'Unable to login. Try again.'
            throw new Error()
        }

        localStorage.setItem('jwt_token', res.headers.get('Authorization'))
        window.location.replace(url + '/app.html')
    })
    .catch((err) => {
        console.log(err)
    })

}