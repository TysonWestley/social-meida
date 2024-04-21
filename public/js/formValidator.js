function toggleForm(e) {
  e.preventDefault()
  var loginForm = document.getElementById('loginForm');
  var registerForm = document.getElementById('registerForm');
  if (loginForm.style.display === 'block') {
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
  } else {
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
  }
} 
let username = document.getElementById('User');
let email = document.getElementById('Email');
let password = document.getElementById('password_00');
let form = document.getElementById('registerForm');
let formCheck=document.getElementById('password_11');
let buttomRegister=document.querySelector('#registerForm-sign_in');
let showNotification=document.querySelector('.showNotification')
let model=document.querySelector('#model')
let checkIcon=document.querySelector('.xicon-button')
let loginForm = document.getElementById('loginForm');
let emailLogin=document.getElementById('Email-login')
let Passwordlogin=document.getElementById('Password-login')
let nameUser=document.querySelector('.user-id')
function showError(input, message) {
  let parent =input.parentElement
  let error = parent.querySelector('span');
  parent.classList.add("invalid");
  error.innerText = message;
}
function showSuccess(input) {
  let parent =input.parentElement
  let error = parent.querySelector('span');
  parent.classList.remove("invalid");
  error.innerText = "";
}

const checkEmptyInvalid = (inputList) => {
    let isEmptyError = false;
    inputList.forEach(input => {
      input.value = input.value.trim();
      if (!input.value ) {
        isEmptyError=true;
        showError(input, "Không được để trống");
    } else {
        showSuccess(input);
      }
});
  return isEmptyError
}
const checkEmail = (input) => {
  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  input.value = input.value.trim();
  let isValidEmail = !emailRegex.test(input.value);
  if (!emailRegex.test(input.value)) {
      showError(input, 'Email invalid'); 
  } else {
      showSuccess(input);
  }

  return isValidEmail;
}
const checkLength=(input,min,max)=>{
  input.value=input.value.trim()
  if( input.value.length<min){
      showError(input,`phải có ít nhất ${min} ký tự`)
      return true
  }
  if(input.value.length>max){
      showError(input,`phai có nhiều nhất ${max} ký tự`)
      return true
  }
  return false
}
const checkPassword = (input, cfpassword) => {
  if (input.value !== cfpassword.value) {
      showError(cfpassword, "Mật khẩu không trùng khớp");
      return true;
  } else {
      return false;
  }
};
const signUp = (e) => {
  e.preventDefault();
  let user = {
    email: email.value,
    password: password.value,
    username: username.value,
}
  var json = JSON.stringify(user);

  fetch("/api/register", {
    method: "POST",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: json,
  }).then(
    res => {
        console.log(res.status)
        if (res.status == 200) {
            showNotification.style.display = 'block';
            model.innerText = 'Registration Successful';
        } else {
            model.innerText = 'Registration Error';
            showNotification.style.display = 'block';
        }
        checkIcon.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification.style.display = 'none';
            loginForm.style.display='block'
            form.style.display='none'
        })
        return res.text();
    }
  ).then(
    data => {
        console.log(data)
    }
)
}
const loginUp = () => {
  const isValidEmail = checkEmail(emailLogin);
  const isNotEmpty = checkEmptyInvalid([emailLogin, Passwordlogin]);

  if (!isValidEmail &&!isNotEmpty) {
    const user = {
      email: emailLogin.value,
      password: Passwordlogin.value,
    };

    const json = JSON.stringify(user);

    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: json,
    })
      .then((res) => {
        if (!res.ok) {
          const loginError=document.querySelector('.loginError')
          loginError.innerHTML='Wrong email or password'
          throw new Error("Lỗi đăng nhập");
        }
        return res.text();
      })
      .then((data) => {
        localStorage.setItem("token", data);
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Lỗi khi đăng nhập:", error);
      });
    }
  }
form.addEventListener('submit', function (e) {
  e.preventDefault();
  let empytyError=checkEmptyInvalid([username, email, password,formCheck]);
  let emptyEmail=checkEmail(email)
  let usernameLengthError= checkLength(username,5,10)
  let passwordLengthError= checkLength(password,6,17)
  let isMatchError= checkPassword(password,formCheck)
  if(empytyError||emptyEmail||usernameLengthError||passwordLengthError||isMatchError){
    
  }
  else{
    signUp(e)
  }

});

loginForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  loginUp()
})