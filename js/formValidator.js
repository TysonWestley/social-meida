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
let formCheck=document.getElementById('password_11')
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
const checkEmail=(input)=>{
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]{2,4}$/;
    input.value=input.value.trim()
    if(emailRegex.test(input.value)){
        showSuccess(input)
    }
    else{
        showError(input,'Email invalid')
    }
    return emailRegex.test(input.value)
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
form.addEventListener('submit', function (e) {
    e.preventDefault();
    checkEmptyInvalid([username, email, password,formCheck]);
    checkEmail(email)
    checkLength(username,5,10)
    checkLength(password,6,17)
    checkPassword(password,formCheck)
});
const signUp= (e) =>{    
    var user= {
        username:username,
        Email:Email,
        password:password,
    }
    var json=JSON.stringify(user);
    localStorage.setItem('UserData',json)
    alert('thong bao thanh cong');
}