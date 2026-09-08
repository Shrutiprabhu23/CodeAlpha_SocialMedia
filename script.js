```javascript
// ==================== PROFILE ====================

function loadProfile() {

    fetch("/api/users/1")
        .then(res => res.json())
        .then(user => {

            if (user.error) return;

            document.getElementById("profileName").innerText = user.name;

            document.getElementById("profileBio").innerText =
                user.bio || "Welcome to my Connect profile 💜";

            document.getElementById("profileAvatar").innerText =
                user.name.charAt(0).toUpperCase();
        });

    loadProfileStats();
}


function loadProfileStats() {

    fetch("/api/posts")
        .then(res => res.json())
        .then(posts => {

            const myPosts = posts.filter(post => post.user_id == 1);

            document.getElementById("postCount").innerText =
                myPosts.length;
        });

    fetch("/api/users/1/followers")
        .then(res => res.json())
        .then(data => {

            document.getElementById("followerCount").innerText =
                data.length;
        });

    fetch("/api/users/1/following")
        .then(res => res.json())
        .then(data => {

            document.getElementById("followingCount").innerText =
                data.length;
        });
}


// EDIT PROFILE

function editProfile() {

    const newName = prompt(
        "Enter your new name:"
    );

    if (!newName || !newName.trim()) {
        return;
    }

    const newBio = prompt(
        "Enter your new bio:"
    );

    fetch("/api/users/1", {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            name: newName.trim(),
            bio: newBio || ""
        })
    })

    .then(res => res.json())

    .then(data => {

        alert(data.message || data.error);

        loadProfile();
        loadPosts();
    });
}


// ==================== REGISTER ====================

function registerUser() {

    const name =
        document.getElementById("newName").value.trim();

    const email =
        document.getElementById("newEmail").value.trim();

    const password =
        document.getElementById("newPassword").value.trim();

    const bio =
        document.getElementById("newBio").value.trim();


    if (!name || !email || !password) {

        alert("Please fill name, email and password!");

        return;
    }


    fetch("/api/users", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            bio: bio
        })
    })

    .then(res => res.json())

    .then(data => {

        alert(data.message || data.error);

        if (data.userId) {

            document.getElementById("newName").value = "";
            document.getElementById("newEmail").value = "";
            document.getElementById("newPassword").value = "";
            document.getElementById("newBio").value = "";
        }
    });
}


// ==================== CREATE POST ====================

function createPost() {

    const content =
        document.getElementById("postContent").value.trim();


    if (!content) {

        alert("Write something first!");

        return;
    }


    fetch("/api/posts", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            user_id: 1,
            content: content
        })
    })

    .then(res => res.json())

    .then(data => {

        alert(data.message || data.error);

        document.getElementById("postContent").value = "";

        loadPosts();
        loadProfileStats();
    });
}


// ==================== LOAD POSTS ====================

function loadPosts() {

    fetch("/api/posts")

        .then(res => res.json())

        .then(posts => {

            const container =
                document.getElementById("posts");

            container.innerHTML = "";


            if (posts.length === 0) {

                container.innerHTML =
                    `<div class="empty">
                        No posts yet ✨ Be the first to post!
                    </div>`;

                return;
            }


            posts.forEach(post => {

                const firstLetter =
                    (post.name || "S").charAt(0).toUpperCase();


                container.innerHTML += `

                    <div class="post">

                        <div class="profile">

                            <div class="avatar">
                                ${firstLetter}
                            </div>

                            <div>

                                <div class="username">
                                    ${post.name || "User"}
                                </div>

                                <small>
                                    Connect member ✨
                                </small>

                            </div>

                        </div>


                        <div class="post-content">
                            ${post.content}
                        </div>


                        <div class="actions">

                            <button onclick="likePost(${post.id})">
                                ❤️ ${post.likes || 0} Like
                            </button>


                            <button onclick="showComments(${post.id})">
                                💬 Comment
                            </button>


                            <button onclick="followUser(${post.user_id})">
                                ➕ Follow
                            </button>

                        </div>


                        <div
                            class="comment-box"
                            id="commentBox${post.id}"
                        >

                            <input
                                id="commentInput${post.id}"
                                placeholder="Write a comment..."
                            >


                            <button onclick="addComment(${post.id})">
                                Send
                            </button>


                            <div
                                class="comments"
                                id="comments${post.id}"
                            ></div>

                        </div>

                    </div>
                `;
            });
        });
}


// ==================== LIKE ====================

function likePost(postId) {

    fetch("/api/likes", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            post_id: postId,
            user_id: 1
        })
    })

    .then(res => res.json())

    .then(data => {

        loadPosts();
    });
}


// ==================== COMMENTS ====================

function showComments(postId) {

    const box =
        document.getElementById(`commentBox${postId}`);


    if (box.style.display === "block") {

        box.style.display = "none";

        return;
    }


    box.style.display = "block";

    loadComments(postId);
}


function addComment(postId) {

    const input =
        document.getElementById(`commentInput${postId}`);

    const content =
        input.value.trim();


    if (!content) {

        alert("Write a comment!");

        return;
    }


    fetch("/api/comments", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            post_id: postId,
            user_id: 1,
            content: content
        })
    })

    .then(res => res.json())

    .then(data => {

        input.value = "";

        loadComments(postId);
    });
}


function loadComments(postId) {

    fetch(`/api/comments/${postId}`)

        .then(res => res.json())

        .then(comments => {

            const container =
                document.getElementById(`comments${postId}`);

            container.innerHTML = "";


            comments.forEach(comment => {

                container.innerHTML += `

                    <div class="comment">

                        <b>
                            ${comment.name || "User"}:
                        </b>

                        ${comment.content}

                    </div>

                `;
            });
        });
}


// ==================== FOLLOW ====================

function followUser(userId) {

    if (!userId) {

        alert("User not available!");

        return;
    }


    fetch("/api/follow", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            follower_id: 1,
            following_id: userId
        })
    })

    .then(res => res.json())

    .then(data => {

        alert(data.message || data.error);

        loadProfileStats();
    });
}


// ==================== PAGE LOAD ====================

loadProfile();

loadPosts();
```
