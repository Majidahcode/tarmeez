// MAIN URL
const baseURL = "https://tarmeezacademy.com/api/v1";

// *********** POSTS REQESTS/*********** */
function AddPostButton() {
  console.log("انشاء منشور جديد قيد التنفيذ...");
  let postId = document.getElementById("post-id-input").value;
  let isCreate = postId == null || postId == "";

  const title = document.getElementById("add-title-input").value;
  const body = document.getElementById("add-post-input").value;
  const image = document.getElementById("add-image-input").files[0];
  const token = localStorage.getItem("token");

  let formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  formData.append("image", image);
  //  const param = {"title": title, "body": body,};
  let url = ``
  const headers = {
    "Content-Type": "multipart/form-data",
    authorization: ` Bearer ${token}`,
  };
  //FOR CREATE NEW POST
  if (isCreate) {
    url = `${baseURL}/posts`;
    
    //FOR EDIT THE POST
  } else {
    formData.append("_method", "put")
    url = `${baseURL}/posts/${postId}`;
    
  }
  // toggleLoader(true)
  axios
      .post(url, formData, {
        headers: headers,
      })
      .then((response) => {
        // toggleLoader(false)
        console.log(response);
        const modal = document.getElementById("addPodtModal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
        setupUI(); 
        showAlert("تم اضافه منشور جديد", "success");
        getPosts();
        // إعادة تحميل الصفحة للتأكد من تحديث الواجهة
      })
      .catch((error) => {
        console.error("حدث خطأ ما! تأكد من حجم الصوره", error);
        showAlert(
          "  حدث خطأ ما ! تأكد من حجم الصوره او من ان الملف صحيح",
          "danger"
        );
      });
  //const token = localStorage.getItem("token")
}

function deletePostButtonClick(postOpject) {
  let post = JSON.parse(decodeURIComponent(postOpject));
  console.log(post);

  document.getElementById("delete-post-id-input").value = post.id

  
  let postModal = new bootstrap.Modal(
    document.getElementById("deletePostModal"),
    {}
  );
  postModal.toggle();
}



function editPostButtonClick(postOpject) {
  let post = JSON.parse(decodeURIComponent(postOpject));
  console.log(post);

  document.getElementById("post-id-input").value = post.id;
  document.getElementById("postModalTitle").innerHTML = "Edit Post";
  document.getElementById("post-modal-submit-btn").innerHTML = "تعديل";
  document.getElementById("add-title-input").value = post.title;
  document.getElementById("add-post-input").value = post.body;
  let postModal = new bootstrap.Modal(
    document.getElementById("addPodtModal"),
    {}
  );
  postModal.toggle();
}

function confirmBtn(){
    // alert("Delete")
  const token = localStorage.getItem("token");
  postId = document.getElementById("delete-post-id-input").value 
  const url = `${baseURL}/posts/${postId}`;

  const headers = {
    "Content-Type": "multipart/form-data",
    authorization: ` Bearer ${token}`,
  };
  toggleLoader(true)
  axios
    .delete(url,{
      headers: headers,
    } )
    .then((response) => {
      toggleLoader(false)
      console.log(response);
      const modal = document.getElementById("deletePostModal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      //setupUI(); // تحديث الواجهة
      showAlert("تم حذف المنشور", "success");
      getPosts();
    })
    .catch((error) => {
      const message = error.response.data.message
      showAlert(message, "danger");
    });
}
// *********** POSTS REQESTS/*********** */

// ********** SETUP UI FUNCTION**********//
function profileClicked(){
  const user = getCurrentUser() 
  postId = user.id
  window.location = `profile.html?postid=${postId}` 
}


function setupUI() {
  loginBtn = document.getElementById("loginBtn");
  regesterBtn = document.getElementById("regesterBtn");
  logOutBtn = document.getElementById("logOutBtn");
  addPostButton = document.getElementById("add-post-button");
//  PostUsername = document.getElementById("Post-Username-Div")

  sidebar = document.getElementById("sidebar");

  let token = window.localStorage.getItem("token");
  console.log("التوكن المخزن في localStorage:", token); // التحقق من أن التوكن مخزن بشكل صحيح
  if (token == null) {
    loginBtn.style.display = "block"; // إظهار زر تسجيل الدخول
    regesterBtn.style.display = "block"; // إظهار زر التسجيل
    logOutBtn.style.display = "none"; // إخفاء زر تسجيل الخروج
  //  PostUsername.style.display = "none"; // إخفاء زر تسجيل الخروج
  if(addPostButton != null){
      addPostButton.style.display = "none";
  }
  
    sidebar.style.display = "none";
  } else {
    loginBtn.style.display = "none"; // إخفاء زر تسجيل الدخول
    regesterBtn.style.display = "none"; // إخفاء زر التسجيل
    logOutBtn.style.display = "block"; // إظهار زر تسجيل الخروج

    //PostUsername.style.display = "block"; // إخفاء زر تسجيل الخروج

    if(addPostButton != null){
      addPostButton.style.display = "block";
  }
  
    sidebar.style.display = "flex";
    const user = getCurrentUser();
    document.getElementById("sidebar-username").innerHTML = user.username;
  //  document.getElementById("Post-Username").innerHTML = user.username;
    const email = getCurrentUser();
    document.getElementById("sidebar-email").innerHTML = email.username;
    //const image = getCurrentUser()
    document.getElementById("sidebar-image").src = user.profile_image;
    //userName.innerText = user.username;
    //userImage.src = user.profile_image || "default-avatar.png";
  }
}
// ********** SETUP UI FUNCTION**********//

// ********** TOGGEL LOADING FUNCTION**********//

function toggleLoader(show = true)
{
    if(show)
    {
        document.getElementById("loader").style.visibility = 'visible'
    }else {
        document.getElementById("loader").style.visibility = 'hidden'
    }
}
// ********** TOGGEL LOADING FUNCTION**********//



///////////AUTH FUNCTION///////////////


// ********* LOGIN FUNCTION**********//
function loginbuttonclick() {
  console.log("تسجيل الدخول قيد التنفيذ...");
  let username = document.getElementById("input1").value;
  let password = document.getElementById("input2").value;
  const param = { username: username, password: password };
  // toggleLoader(true)
  const url = `${baseURL}/login`;
  axios
    .post(url, param)
    .then((response) => {
      // toggleLoader(false)

      window.localStorage.setItem("token", response.data.token);
      window.localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      // إغلاق المودال بعد تسجيل الدخول
      const modal = document.getElementById("loginModal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      setupUI(); // تحديث الواجهة
      showAlert("logged in successfully", "success");
      // إعادة تحميل الصفحة للتأكد من تحديث الواجهة
      //  window.location.reload();
    })
    .catch((error) => {
      console.error("حدث خطأ أثناء تسجيل الدخول:", error);
    });
}
// ********* END LOGIN FUNCTION**********//



// **********REGITSER FUNCTION**********//
function regesterbuttonclick() {
  const name = document.getElementById("regesterNameInput").value;
  const username = document.getElementById("regesterUserNameInput").value;
  const password = document.getElementById("regesterPassInput2").value;
  const image = document.getElementById("register-image-input").files[0];

  let formData = new FormData();
  formData.append("name", name);
  formData.append("username", username);
  formData.append("password", password);
  formData.append("image", image);

  const headers = {
    "Content-Type": "multipart/form-data",
  };
  

  const url = `${baseURL}/register`; // تأكد من تغيير هذا إلى عنوان API الصحيح
  // toggleLoader(true)
  axios
    .post(url, formData)
    .then((response) => {
      // toggleLoader(false)
      window.localStorage.setItem("token", response.data.token);
      window.localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );
      const modal = document.getElementById("regesterModal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      showAlert("logged in successfully", "success");
      setupUI(); // تحديث الواجهة
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    });
}
// **********END REGITSER FUNCTION**********//


// **********LOGOUT FUNCTION**********//
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  //todo: hide alert
  showAlert("logged out successfully", "danger");
  //alert("are you sure you want deleteig?");
  setupUI();
}
// **********END LOGOUT FUNCTION**********//


// **********GET CURRENT USEER FUNCTION**********//
function getCurrentUser() {
  let user = null;
  const storgeUser = localStorage.getItem("user");
  if (storgeUser != null) {
    user = JSON.parse(storgeUser);
  }
  return user;
}
// **********END GET CURRENT USEER FUNCTION**********//


// ********** SHOW ALERT FUNCTION**********//


function showAlert(custumMessage, type) {
  const alertPlaceholder = document.getElementById("AlertPlaceholder");

  // تأكد من وجود العنصر قبل محاولة استخدامه
  if (!alertPlaceholder) {
    console.error("Alert placeholder element not found");
    return;
  }

  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper); // append لن يعمل إذا كان alertPlaceholder غير موجود
  };

  appendAlert(custumMessage, type);

  //setTimeout(() => {
  //  const alert = bootstrap.Alert.getOrCreateInstance("#AlertPlaceholder");
  //  alert.close();
  //}, 3000);
}
// **********END SHOW ALERT FUNCTION**********//
