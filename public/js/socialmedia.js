const homeContent = document.querySelector('.home');
const messageContent = document.querySelector('.messengerButton');
const profileContent = document.querySelector('.Profile');
const flashContent=document.querySelector('.flashCard')
const changePassword=document.querySelector('.changePassword')
const CommunityChat=document.querySelector('.CommunityChat') 
const postcontent=document.querySelector('.post-container')
const tick4=document.querySelector('.tick4')
const changetheme=document.querySelector('.changeTheme')
const changepass=(e)=>{
  e.preventDefault()
  changePassword.style.display='flex'
}
const tick=(e)=>{
  const icontTick=document.querySelector('#tick')
  changePassword.style.display='none'
}
const content1=(e)=>{
    e.preventDefault()
    homeContent.style.display='flex'
    messageContent.style.display='none'
    profileContent.style.display = 'none';
    flashContent.style.display='none'
    CommunityChat.style.display='none'
}
const content2=(e)=>{
    e.preventDefault()
    homeContent.style.display='none'
    messageContent.style.display='block'
    profileContent.style.display = 'none';
    flashContent.style.display='none'
    CommunityChat.style.display='none'
}
// // TODO Testing purpose
// content2({
//   preventDefault: () => {},
// })


const content3=(e)=>{
    e.preventDefault()
    homeContent.style.display='none'
    messageContent.style.display='none'
    profileContent.style.display = 'block';
    flashContent.style.display='none'
    CommunityChat.style.display='none'
}
const content4=(e)=>{
  e.preventDefault()
  postcontent.style.display='block'
}
tick4.addEventListener('click',()=>{
  postcontent.style.display='none'
})
const content5=(e)=>{
    e.preventDefault()
    flashContent.style.display='block'
    homeContent.style.display='none'
    messageContent.style.display='none'
    profileContent.style.display = 'none';
    CommunityChat.style.display='none'
}
const content6=(e)=>{
  e.preventDefault();
  CommunityChat.style.display='block'
  flashContent.style.display='none'
  homeContent.style.display='none'
  messageContent.style.display='none'
  profileContent.style.display = 'none';
}
const changeTheme=(e)=>{
  e.preventDefault();
  changetheme.classList.add='lighttheme'
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
closeBtn.addEventListener("click",(hidenQuestion = () => {
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
    let tempQuestion = question.value.trim();
    let tempAnswer = answer.value.trim();
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
  div.innerHTML += `<p class="question-div">${question.value}</p>`;
  var displayAnswer = document.createElement("p");
  displayAnswer.classList.add("answer-div", "hide");
  displayAnswer.innerText = answer.value;
  var link = document.createElement("a");
  link.setAttribute("href", "#");
  link.setAttribute("class", "show-hide-btn");
  link.innerHTML = "Show/Hide";
  link.addEventListener("click", () => {
    displayAnswer.classList.toggle("hide");
  });

  div.appendChild(link);
  div.appendChild(displayAnswer);

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
//load ten trang
const getNameFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Không có token trong localStorage');
    return;
  }
  
  fetch(`/api/getname?token=${ encodeURIComponent(token)}`, {
    method: 'get', 
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Lỗi khi lấy tên người dùng');
    }
    return response.json();
  })
  .then(data => {
    console.log(data) 
    const username = data.username;
    document.getElementById('usernameDisplay').innerText = username;
    document.querySelector('.user-id').innerText=username;
    console.log(username)
  })
  .catch(error => {
    console.error('Lỗi:', error);
  });
};
getNameFromToken();
//profile
let loveCount = localStorage.getItem('loveCount') || 0;
let dislike=localStorage.getItem('dislikecount')||0;
const follow=(e)=>{
  e.preventDefault();
  const follows=document.querySelector('.user-plus .followButton')
  follows.textContent  ='followed';
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
function createFeed(e) {
  e.preventDefault();
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Không có token trong localStorage');
    return;
  }
  const input = document.querySelector('.tweetBox__input input');
  const content = input.value;
  if (content) {
    fetch(`/create_feeds?token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: content
      })
    }).then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    }).then(data => {
      showFeeds();
      input.value = ""; 
      console.log(data);
    }).catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      console.error(error.stack);
    });
  }
}
async function showFeeds() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Không có token trong localStorage');
      return;
    }

    const response = await fetch(`/feeds?token=${encodeURIComponent(token)}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch the list of posts');
    }

    const data = await response.json();
    const postUl = document.querySelector('.post');

    postUl.insertAdjacentHTML('afterbegin', `
      <li class="post">
        <div class="Userthis">
          <img class="postUser" src="data:image/gif;base64,${data[data.length - 1].image}" alt="Avatar">
          <h3 class="postname">${data[data.length - 1].username}</h3>
        </div>
        <p class="postcontent">${data[data.length - 1].content}</p>
        <div class="postIcon">
          <div>
              <i class="fa-regular fa-heart iconC" onclick="loveButton(event)"></i>
              <span class="numberIcon">0</span>
          </div>
          <div>
              <i class="fa-solid fa-thumbs-down iconC" onclick="dislikeButton(event)"></i>
              <span class="dislike">0</span>
          </div>
        </div>
      </li>
    `);
  } catch (error) {
    console.error('Error:', error);
  }
}
document.querySelector('.tweetBox__button').addEventListener('click', async (event) => {
  event.preventDefault();
  
  try {
    await createFeed(event);
  } catch (error) {
    console.error('Error creating or showing feeds:', error);
  }
});

async function loadAndDisplayPosts() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Không có token trong localStorage');
      return;
    }

    const response = await fetch(`/feeds?token=${encodeURIComponent(token)}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch the list of posts');
    }
    const data = await response.json();
    const postUl = document.querySelector('.post');
    data.forEach(element => {
      const li = document.createElement('li');
      li.classList.add('post');
      li.innerHTML = `
        <div class="Userthis">
          <img class="postUser" src="data:image/gif;base64,${element.image}" alt="Avatar">
          <h3 class="postname">${element.username}</h3>
        </div>
        <p class="postcontent">${element.content}</p>
        <div class="postIcon">
        <div>
            <i class="fa-regular fa-heart iconC" onclick="loveButton(event)"></i>
            <span class="numberIcon">0</span>
        </div>
        <div>
            <i class="fa-solid fa-thumbs-down iconC" onclick="dislikeButton(event)"></i>
            <span class="dislike">0</span>
        </div>
      </div>
      `;
      const firstChild = postUl.firstChild;
      postUl.insertBefore(li, firstChild);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}
document.addEventListener('DOMContentLoaded', loadAndDisplayPosts);
async function showAvartar64() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found in localStorage');
      return;
    }
    const response = await fetch(`/api/getImg?token=${encodeURIComponent(token)}`, {
      method: 'GET',
    });
    if (!response.ok) {
      if (response.status === 404) {
        console.error('Image not found');
        return;
      }
      throw new Error(`Failed to fetch the image: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    if (!data?.length) {
      throw new Error('Image data not found in the response');
    }

    const imageElement = document.querySelector('.logo');
    const imagesTwitet=document.querySelector('.tweetBox__input img')
    imageElement.src = `data:image/gif;base64, ${data}`;
    imagesTwitet.src=`data:image/gif;base64, ${data}`
  } catch (error) {
    console.error('Error fetching and displaying image:', error);
    console.error('Error stack:', error.stack);
  }
}
document.addEventListener('DOMContentLoaded', showAvartar64);
async function showAvartar65() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found in localStorage');
      return;
    }
    const response = await fetch(`/api/getAvartar?token=${encodeURIComponent(token)}`, {
      method: 'GET',
    });
    if (!response.ok) {
      if (response.status === 404) {
        console.error('Image not found');
        return;
      }
      throw new Error(`Failed to fetch the image: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    if (!data?.length) {
      throw new Error('Image data not found in the response');
    }

    const imageElement = document.querySelector('.imgprofile');
    imageElement.src = `data:image/gif;base64, ${data}`;
  } catch (error) {
    console.error('Error fetching and displaying image:', error);
    console.error('Error stack:', error.stack);
  }
}
document.addEventListener('DOMContentLoaded', showAvartar65);
function imgUpload() {
  const imgAvarter = document.querySelector('.logo');
  const inputImage = document.querySelector('#inputImg');
  inputImage.addEventListener('change', async (e) => {
    const formData = new FormData();
    formData.append('picture', e.target.files[0]);

    const response = await fetch(`/uploadphoto?token=${encodeURIComponent(localStorage.getItem('token'))}`, {
      method: 'POST',
      body: formData,
    });
    console.log(response.ok)
    if (!response.ok) {
      console.error(`Failed to upload photo: ${response.status} - ${response.statusText}`);
      return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
      imgAvarter.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
  });
  inputImage.click();
}
function uploadAvartar() {
  const imgAvarter = document.querySelector('.imgprofile');
  const inputCover = document.querySelector('#inputCover');
  inputCover.addEventListener('change', async (e) => {
    const formData = new FormData();
    formData.append('picture', e.target.files[0]);
    const response = await fetch(`/uploadAvartar?token=${encodeURIComponent(localStorage.getItem('token'))}`, {
      method: 'POST',
      body: formData,
    });
    console.log(response.ok)
    if (!response.ok) {
      console.error(`Failed to upload photo: ${response.status} - ${response.statusText}`);
      return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
      imgAvarter.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
  });
  inputCover.click();
}
const inputBox = document.querySelector('.tweetBox__input input');
//
const hell = async (e) => {
  e.preventDefault();
  if (e.key !== 'Enter') {
    return;
  }
  const username = e.target.value.trim();
  if (username === '') {
    return;
  }
  try {
    const response = await fetch(`/api/searchUser?name=${encodeURIComponent(username)}`);
    const data = await response.json();
    const userList = document.querySelector('.user-list');
    if (!response.ok) {
      const itemsHtml = `
      <div class='userProfileFound'>
        <i class="fa-solid fa-xmark"  id="tickNone"></i>
        <h1>Error to find user</h1>
      </div>
    `;
    userList.innerHTML = itemsHtml;
    return
    }
    displayUserProfile(data);
    const itemsHtml = `
      <div class='userProfileFound'>
        <i class="fa-solid fa-xmark"  id="tickNone"></i>
        <h1>Information User</h1>
        <img src="data:image/gif;base64, ${data.image}"/>
        <img src="data:image/gif;base64, ${data.userAvartar}"/>
        <h3>${data.username}</h3>
      </div>
    `
;
    userList.innerHTML = itemsHtml;
    document.querySelector('#tickNone').addEventListener('click', () => {
      const userProfileFound = document.querySelector('.userProfileFound');
      userProfileFound.style.display = 'none';
    });
  } catch (error) {
    console.error(`Error sending user search request: ${error}`);
  }
}
function displayUserProfile(user) {
    console.log('Thông tin người dùng:', user);
}
//feed Picture
const feedPicture = async () => {
  const inputCoverfeed = document.querySelector('#inputCoverfeed');
  const imgAvartar = document.querySelector(".content img");
  const feedButton = document.querySelector('.buttonPicture');

  feedButton.addEventListener('click', () => {
    inputCoverfeed.click(); 
  });

  inputCoverfeed.addEventListener('change', async () => {
    const formData = new FormData();
    formData.append('picture', inputCoverfeed.files[0]);
    const token = localStorage.getItem('token');
    const response = await fetch(`/create_feedPictures?token=${encodeURIComponent(token)}`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      console.error(`Failed to upload photo: ${response.status} - ${response.statusText}`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (imgAvartar) {
        imgAvartar.classList.add('imageUpload');
      }
      imgAvartar.src = event.target.result;
    };
    reader.readAsDataURL(inputCoverfeed.files[0]);
    
  });
}
feedPicture()
async function uploadFeed(e) {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Không có token trong localStorage');
      return;
    }

    const response = await fetch(`/feedPictures?token=${encodeURIComponent(token)}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch the list of posts');
    }

    const data = await response.json();
    const postUl = document.querySelector('.post');
    console.log(data[data.length - 1].picture)
    postUl.insertAdjacentHTML('afterbegin', `
      <li class="post">
        <div class="Userthis">
          <img class="postUser" src="data:image/gif;base64,${data[data.length - 1].image}" alt="Avatar">
          <h3 class="postname">${data[data.length - 1].username}</h3>
        </div>
        <img class="postpic" src="data:image/gif;base64,${data[data.length - 1].picture}" alt="dfdf">
        <div class="postIcon">
          <div>
              <i class="fa-regular fa-heart iconC" onclick="loveButton(event)"></i>
              <span class="numberIcon">0</span>
          </div>
          <div>
              <i class="fa-solid fa-thumbs-down iconC" onclick="dislikeButton(event)"></i>
              <span class="dislike">0</span>
          </div>
        </div>
      </li>
    `);
  } catch (error) {
    console.error('Error:', error);
  }
}
async function loadAndDisplayPicture() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Không có token trong localStorage');
      return;
    }

    const response = await fetch(`/feedPictures?token=${encodeURIComponent(token)}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch the list of posts');
    }
    const data = await response.json();
    const postUl = document.querySelector('.post');
    data.forEach(element => {
      const li = document.createElement('li');
      li.classList.add('post');
      li.innerHTML = `
        <div class="Userthis">
        <img class="postUser" src="data:image/gif;base64,${element.image}" alt="Avatar">
        <h3 class="postname">${element.username}</h3>
        </div>
        <img class="postpic" src="data:image/gif;base64,${element.picture}" alt="dfdf">
        <div class="postIcon">
        <div>
            <i class="fa-regular fa-heart iconC" onclick="loveButton(event)"></i>
            <span class="numberIcon">0</span>
        </div>
        <div>
            <i class="fa-solid fa-thumbs-down iconC" onclick="dislikeButton(event)"></i>
            <span class="dislike">0</span>
        </div>
      </div>
      `;
      const firstChild = postUl.firstChild;
      postUl.insertBefore(li, firstChild);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}
document.addEventListener('DOMContentLoaded', loadAndDisplayPicture);
document.querySelector('.feed-button').addEventListener('click', async (event) => {
  event.preventDefault();
  try {
    await feedPicture();
    uploadFeed(event);
  } catch (error) {
    console.error('Error creating or showing feeds:', error);
  }
});
// document.addEventListener('DOMContentLoaded', loadAndDisplayPostss);
//change password
const changePasswordApi = async () => {
  const token = localStorage.getItem('token');
  const NotificationOl = document.querySelector('.NotificationOl');
  NotificationOl.innerText='';
  if (!token) {
    console.error('Token not found in localStorage');
    NotificationOl.innerText = 'Error changing password: Token not found in localStorage';
    return;
  }

  const passwordInput = document.querySelector(".changePassword input[type=password]");
  const newPassword = passwordInput.value.trim();
  if (newPassword === '') {
    console.error('Please enter a new password');
    NotificationOl.innerText = 'Error changing password: Please enter a new password';
    return;
  }

  try {
    const response = await fetch(`/api/change-password?token=${encodeURIComponent(token)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword }),
    }); 
    if (!response.ok) {
      const { error } = await response.json();
      NotificationOl.innerText = `Error changing password: ${error}`;
      return;
    }
    passwordInput.value = '';
    NotificationOl.innerText = "Password successfully changed";
  } catch (error) {
    NotificationOl.innerText=`Error sending password change request: ${error}`;
  }
};

