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
const imgAvarter=document.querySelector('.logo')
const inputImage=document.querySelector('#inputImg')
function imgUpload(){
    inputImage.click()
    inputImage.addEventListener('change', async(e) => {
        const formData  = new FormData();

        formData.append("picture", e.target.files[0]);
        console.log(formData)
        await fetch("/uploadphoto?token=" + localStorage.getItem("token"), {
            method: 'POST',
            body: formData
        })
    })
}
imgUpload()
