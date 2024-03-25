
const homeContent = document.querySelector('.home');
const messageContent = document.querySelector('.messengerButton');
const profileContent = document.querySelector('.Profile');
const content1=(e)=>{
    e.preventDefault()
    homeContent.style.display='block'
    messageContent.style.display='none'
    profileContent.style.display = 'none';
}
const content2=(e)=>{
    e.preventDefault()
    homeContent.style.display='none'
    messageContent.style.display='block'
    profileContent.style.display = 'none';
}
const content3=(e)=>{
    e.preventDefault()
    homeContent.style.display='none'
    messageContent.style.display='none'
    profileContent.style.display = 'block';
}

const imgAvarter=document.querySelector('.logo')
const inputImage=document.querySelector('#inputImg')
function imgUpload(){
    inputImage.click()

}
