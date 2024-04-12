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
    inputList.forEach(input => {
        let inputValue = input.value.trim();
        if (!inputValue ) {
            console.log(inputValue);
            showError(input, "Không được để trống");
        } else {
            showSuccess(input);
        }
    });
}
const checkEmail = (input) => {
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    const inputValue = input.value.trim();
    const isValidEmail = emailRegex.test(inputValue);

    if (!isValidEmail) {
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
    input.value = input.value.trim();
    cfpassword.value = cfpassword.value.trim();
    if (input.value !== cfpassword.value) {
        showError(cfpassword, "Mật khẩu không trùng khớp");
        return true;
    } else {
        return false;
    }
};
const signUp = (e) => {
    e.preventDefault();
    const isValidEmail = checkEmail(email);
    const isPasswordMatch = !checkPassword(password, formCheck);
    const isNotEmpty = !checkEmptyInvalid([username, email, password, formCheck]);
    const isPasswordValid = !checkLength(password, 6, 20);

    if (isValidEmail && isPasswordMatch && isNotEmpty && isPasswordValid) {
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
                if (res.status == 200) {
                    console.log("hello")
                    showNotification.style.display = 'block';
                    model.innerText = 'Registration Successful';
                } else {
                    model.innerText = 'Registration Error';
                    showNotification.style.display = 'block';
                }
                checkIcon.addEventListener('click', (e) => {
                    e.preventDefault();
                    showNotification.style.display = 'none';
                })
                return res.text();
            }
        ).then(
            data => {
                console.log(data)
            }
        )
    }
}

const loginUp = () => {
    const isValidEmail = checkEmail(emailLogin);
    const isNotEmpty = !checkEmptyInvalid([emailLogin, Passwordlogin]);
    // const isPasswordValid = !checkLength(Passwordlogin, 6, 20);
    if (isValidEmail  && isNotEmpty ){
        let user = {
            email: emailLogin.value,
            password: Passwordlogin.value,
          };
        
          var json = JSON.stringify(user);
          
          fetch("/api/login", {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: json,
          }).then(
            res => {
              return res.text();
            }
          ).then(
            data => {
              console.log(data)
              localStorage.setItem('token', data);
              window.location.href = '/';
            }
          ).catch(error => {
            console.error('Lỗi khi đăng nhập:', error);
          });
        };
    }
//client post
// Function để đăng bài viết
// function postContent(content, username) {
//     const xhr = new XMLHttpRequest();
//     const url = '/api/post';
  
//     xhr.open('POST', url, true);
//     xhr.setRequestHeader('Content-Type', 'application/json');
//     xhr.onreadystatechange = function () {
//       if (xhr.readyState === XMLHttpRequest.DONE) {
//         if (xhr.status === 201) {
//           console.log('Bài viết đã được đăng thành công');
//         } else {
//           console.error('Lỗi khi đăng bài viết:', xhr.responseText);
//         }
//       }
//     };
  
//     const data = JSON.stringify({ content: content, username: username });
//     xhr.send(data);
//   }
  
//   // Function để đăng video
  
//   // Gọi function để đăng bài viết
//   const content = 'Nội dung bài viết';
//   const username = 'ID của người dùng';
//   postContent(content, username);
  
form.addEventListener('submit', function (e) {
    e.preventDefault();
    checkEmptyInvalid([username, email, password,formCheck]);
    checkEmail(email)
    checkLength(username,5,10)
    checkLength(password,6,17)
    checkPassword(password,formCheck)
    signUp(e)
});
loginForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    loginUp()
})