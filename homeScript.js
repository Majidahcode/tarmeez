let currentPage = 1;
let lastPage = 1;
const container = document.querySelector(".container");

window.addEventListener("scroll", function () {
  const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
  

  if (endOfPage && currentPage < lastPage) {
    currentPage = currentPage + 1;
    getPosts(false, currentPage);
  }
});


setupUI();

console.log("Loading posts...");
getPosts();

function getPosts(reload = true, page = 1) {
  toggleLoader(true);
  axios.get(`${baseURL}/posts?limit=8&page=${page}`).then((response) => {
    toggleLoader(false);
    const posts = response.data.data;
    lastPage = response.data.meta.last_page;

    if (reload) {
      container.innerHTML = "";
    }

    for (const post of posts) {
      let user = getCurrentUser();
      let isMyPost = user != null && post.author.id == user.id;
      let editButtonCntent = ``;
      if (isMyPost) {
        editButtonCntent = `
          <button class="btn btn-danger deleteBtn">Delete</button>
          <button class="btn editBtn">Edit</button>
        `;
      }

      // إنشاء البطاقة
      let card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <div class="header-card">
          <span style="cursor: pointer;" class="user-click" onclick="userClickd(${post.author.id})" >
            <img src="${post.author.profile_image}" alt="" />
            <b>@${post.author.username}</b>
          </span>
          ${editButtonCntent}
        </div>
        <div class="content">
          <img src="${post.image}" alt="" />
          <h6>Posted at: ${post.created_at}</h6>
          <h4>${post.title}</h4>
          <p>${post.body}</p>
          <hr />
          <div class="end-card">
            <span class="pen">🖊</span>
            <span class="comment" onclick="cardClick(${post.id})"> Comment (${post.comments_count})</span>
          </div>
        </div>
      `;

    

      // إضافة مستمعي الأحداث
      card.querySelector(".user-click").addEventListener("click", function (event) {
        event.stopPropagation();  // منع تمرير النقر إلى .content
        // userClickd(post.author.id);
      });

      card.querySelector(".content").addEventListener("click", function (event) {
        if (!event.target.closest(".user-click")) {
          cardClick(post.id);
        }
      });

      container.appendChild(card);
    }
  }).catch((error) => {
    console.error("Error fetching posts:", error);
  });
}
function userClickd(postId) {
  console.log(`Navigating to profile for user ${postId}`);
  window.location = `profile.html?postid=${postId}`;
}

function cardClick(postId) {
  console.log(`Navigating to post details for post ${postId}`);
  window.location = `postDetails.html?postId=${postId}`;
}


function addBtnCleiked(){


  document.getElementById("post-id-input").value = ""
  document.getElementById("postModalTitle").innerHTML = "Creat A New Post";
  document.getElementById("post-modal-submit-btn").innerHTML = "نشر";
  document.getElementById("add-title-input").value = "";
  document.getElementById("add-post-input").value = "";
  let postModal = new bootstrap.Modal(
    document.getElementById("addPodtModal"),
    {}
  );
  postModal.toggle();
  
}
//window.location.reload();
