const homeContent = document.querySelector('.home');
const messageContent = document.querySelector('.messengerButton');
const profileContent = document.querySelector('.Profile');
const flashContent=document.querySelector('.flashCard')
const content1=(e)=>{
    e.preventDefault()
    homeContent.style.display='flex'
    messageContent.style.display='none'
    profileContent.style.display = 'none';
    flashContent.style.display='none'

}
const content2=(e)=>{
    e.preventDefault()
    homeContent.style.display='none'
    messageContent.style.display='block'
    profileContent.style.display = 'none';
    flashContent.style.display='none'
}
const content3=(e)=>{
    e.preventDefault()
    homeContent.style.display='none'
    messageContent.style.display='none'
    profileContent.style.display = 'block';
    flashContent.style.display='none'
}
const content5=(e)=>{
    e.preventDefault()
    flashContent.style.display='block'
    homeContent.style.display='none'
    messageContent.style.display='none'
    profileContent.style.display = 'none';
}
//js flashcard
const content = document.querySelector(".content");
const addQuestionCard = document.getElementById("add-question-card");
const cardButton = document.getElementById("save-btn");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const errorMessage = document.getElementById("error");
const addQuestion = document.getElementById("add-flashcard");
const closeBtn = document.getElementById("close-btn");
let editBool = false;

//Add question when user clicks 'Add Flashcard' button
addQuestion.addEventListener("click", () => {
    content.classList.add("hide");
    question.value = "";
    answer.value = "";
    addQuestionCard.classList.remove("hide");
});

//Hide Create flashcard Card
closeBtn.addEventListener("click",(hideQuestion = () => {
    content.classList.remove("hide");
    addQuestionCard.classList.add("hide");
    if (editBool) {
      editBool = false;
      submitQuestion();
    }
  })
);

//Submit Question
cardButton.addEventListener("click",(submitQuestion = () => {
    editBool = false;
    tempQuestion = question.value.trim();
    tempAnswer = answer.value.trim();
    if (!tempQuestion || !tempAnswer) {
      errorMessage.classList.remove("hide");
    } else {
        content.classList.remove("hide");
      errorMessage.classList.add("hide");
      viewlist();
      question.value = "";
      answer.value = "";
    }
  })
);

//Card Generate
function viewlist() {
  var listCard = document.getElementsByClassName("card-list-container");
  var div = document.createElement("div");
  div.classList.add("card");
  //Question
  div.innerHTML += `<p class="question-div">${question.value}</p>`;
  //Answer
  var displayAnswer = document.createElement("p");
  displayAnswer.classList.add("answer-div", "hide");
  displayAnswer.innerText = answer.value;

  //Link to show/hide answer
  var link = document.createElement("a");
  link.setAttribute("href", "#");
  link.setAttribute("class", "show-hide-btn");
  link.innerHTML = "Show/Hide";
  link.addEventListener("click", () => {
    displayAnswer.classList.toggle("hide");
  });

  div.appendChild(link);
  div.appendChild(displayAnswer);

  //Edit button
  let buttonsCon = document.createElement("div");
  buttonsCon.classList.add("buttons-con");
  var editButton = document.createElement("button");
  editButton.setAttribute("class", "edit");
  editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
  editButton.addEventListener("click", () => {
    editBool = true;
    modifyElement(editButton, true);
    addQuestionCard.classList.remove("hide");
  });
  buttonsCon.appendChild(editButton);
  disableButtons(false);

  //Delete Button
  var deleteButton = document.createElement("button");
  deleteButton.setAttribute("class", "delete");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  deleteButton.addEventListener("click", () => {
    modifyElement(deleteButton);
  });
  buttonsCon.appendChild(deleteButton);

  div.appendChild(buttonsCon);
  listCard[0].appendChild(div);
  hideQuestion();
}

//Modify Elements
const modifyElement = (element, edit = false) => {
  let parentDiv = element.parentElement.parentElement;
  let parentQuestion = parentDiv.querySelector(".question-div").innerText;
  if (edit) {
    let parentAns = parentDiv.querySelector(".answer-div").innerText;
    answer.value = parentAns;
    question.value = parentQuestion;
    disableButtons(true);
  }
  parentDiv.remove();
};

//Disable edit and delete buttons
const disableButtons = (value) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = value;
  });
};
//profile
let loveCount = localStorage.getItem('loveCount') || 0;
let dislike=localStorage.getItem('dislikecount')||0;
const follow=(e)=>{
  e.preventDefault();
  const follows=document.querySelector('.user-plus .followButton')
  follows.innerHTML ='followed';
}
function loveButton(event) {
  event.preventDefault();
  const listItem = event.target.closest('li');
  const postId = listItem.getAttribute('data-post-id');
  const numberIconElement = listItem.querySelector('.numberIcon');
  
  if (numberIconElement) {
      let numberIcon = parseInt(numberIconElement.innerText);
      numberIcon++;
      localStorage.setItem(`loveCount_${postId}`, numberIcon);
      numberIconElement.innerText = numberIcon;
  }
}

window.onload = () => {
  const numberIconElements = document.querySelectorAll('.numberIcon');
  numberIconElements.forEach((element) => {
      const postId = element.closest('li').getAttribute('data-post-id');
      element.innerText = localStorage.getItem(`loveCount_${postId}`) || 0;
  });
}

const dislikeButton = (e) => {
  e.preventDefault();
  const listItem = e.target.closest('li');
  const numberIconElement = listItem.querySelector('.dislike');
  if (numberIconElement) {
    let numberIcon = parseInt(numberIconElement.innerText);
    numberIcon++;
    numberIconElement.innerText = numberIcon;
  }
}

function imgUpload(){
    const imgAvarter=document.querySelector('.logo')
    const inputImage=document.querySelector('#inputImg')
    inputImage.click()
    inputImage.addEventListener('change', async(e) => {
        const formData  = new FormData();

        formData.append("picture", e.target.files[0]);
        console.log(formData)
        await fetch("/uploadphoto?token=" + localStorage.getItem("token"), {
            method: 'POST',
            body: formData
        })
        const reader = new FileReader();
        reader.onload = function(event) {
            imgAvarter.src = event.target.result;
        };
        reader.readAsDataURL(e.target.files[0]);
    })
  }
const inputBox = document.querySelector('.tweetBox__input input');
const searchResult=document.querySelector('.searchResult')
inputBox.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const username = e.target.value.trim();
        if (username !== '') {
            try {
                const response = await fetch(`/api/searchUser?name=${username}`);
                const data = await response.json();

                if (response.ok) {
                    displayUserProfile(data);
                    searchResult.innerText='data'

                } else {
                    console.error('Lỗi khi tìm kiếm người dùng:', data.message);
                    
                  }
            } catch (error) {
                console.error('Lỗi khi gửi yêu cầu tìm kiếm người dùng:', error);

            }
        }
    }
});

function displayUserProfile(user) {
    console.log('Thông tin người dùng:', user);
}
