setupUI();
getPosts();
getUser();

function getCurrentUserId(){
  const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("postid")
    return id
}
function getUser() {
  const id = getCurrentUserId()

  // const urlParams = new URLSearchParams(window.location.search)
  // const id = urlParams.get("postId")
  axios.get(`${baseURL}/users/${id}`).then((response) => {
    // console.log(response);
    user = response.data.data;
    document.getElementById("main-info-image").src= user.profile_image;
    document.getElementById("main-info-email").innerHTML = user.email;
    document.getElementById("main-info-user-name").innerHTML = user.username;
    document.getElementById("post-count").innerHTML = user.posts_count;
    document.getElementById("comment-count").innerHTML = user.comments_count;
    document.getElementById("main-info-name").innerHTML = user.name;
    // document.getElementById("user-name-posts").innerHTML = user.name
    // document.getElementById("post-profile-image").innerHTML = user.profile_image

    // document.getElementById("post-user-name").innerHTML = user.username
    // document.getElementById("post-image").innerHTML = user.image
    // document.getElementById("post-created-at").innerHTML = user.created_at
    // document.getElementById("post-title").innerHTML = user.title
    // document.getElementById("post-body").innerHTML = user.body
    // document.getElementById("post-comments-count").innerHTML = user.comments_count
  });
}

function getPosts() {
  // const id = "16287";
  const id = getCurrentUserId()
  // toggleLoader(true)
  
  axios.get(`${baseURL}/users/${id}/posts`)
  .then((response) => {
    // console.log(response);
    // toggleLoader(false)
    
    const posts = response.data.data;
    document.getElementById("container-profile").innerHTML = ""

    for (post of posts) {
      //  console.log(post)
      let user = getCurrentUser();
      let isMyPost = user != null && post.author.id == user.id;
      let editButtonCntent = ``;
      if (isMyPost) {
        editButtonCntent = `
        <button class="btn btn-danger deleteBtn" onclick="deletePostButtonClick('${encodeURIComponent(
          JSON.stringify(post)
        )}')">Delete</button>

        
        <button class="btn editBtn" onclick="editPostButtonClick('${encodeURIComponent(
                  JSON.stringify(post)
                )}')">Edit</button>
                
                
                
                `;
      }

      // lcard = document.getElementById("card");

      let card = `
        <div class="card" id="card">
      

    
              <div class="header-card">
                <a href="/profile.html"><img src="${post.author.profile_image}" alt="" /></a>
                <b id="h">@${post.author.username}</b>
                <!--  هنا واجهت كشكله عدم ظهور المنشور والسبب ما حطيت هذه العلامه في البدايه عند كنابه جافاسكربت$ -->
              
                  ${editButtonCntent}
                  
              </div>
              <div class="content" onclick="cardClick(${post.id})">
                <img src="${post.image}" alt="" />
                <h6>Posted at: ${post.created_at}</h6>\
                <h4>${post.title}</h4>
                <p>${post.body}</p>
                <hr />
                <div class="end-card">
                  <span class="pen">🖊</span>
                  <span class="comment"> Comment (${post.comments_count})

                    <span id="tags" > 
                  </span>
                  
                </div>
              </div>
        </div>
            `;

      // container.appendChild(card);
      document.getElementById("container-profile").innerHTML += card
      //document.getElementById("tags").innerHTML = ""
      // function showUserInfo() {
      //   let sidebar = document.querySelector(".sidebar");
      // }
      // showUserInfo();
    }
  });
}
