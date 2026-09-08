const express = require("express");
const db = require("./database");

const app = express();

app.use(express.json());
app.use(express.static("."));


// ==================== HOME ====================

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/../index.html");
});


// ==================== USER PROFILE ====================

// Create User / Register
app.post("/api/users", (req, res) => {

    const { name, email, password, bio } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            error: "Name, email and password are required"
        });
    }

    db.run(
        `INSERT INTO users (name, email, password, bio)
         VALUES (?, ?, ?, ?)`,
        [name, email, password, bio || ""],
        function (err) {

            if (err) {
                return res.status(400).json({
                    error: "Email already exists"
                });
            }

            res.json({
                message: "User registered successfully!",
                userId: this.lastID
            });
        }
    );
});


// Get Profile
app.get("/api/users/:id", (req, res) => {

    db.get(
        `SELECT id, name, email, bio
         FROM users
         WHERE id = ?`,
        [req.params.id],
        (err, user) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (!user) {
                return res.status(404).json({
                    error: "User not found"
                });
            }

            res.json(user);
        }
    );
});


// Update Profile
app.put("/api/users/:id", (req, res) => {

    const { name, bio } = req.body;

    db.run(
        `UPDATE users
         SET name = ?, bio = ?
         WHERE id = ?`,
        [name, bio, req.params.id],
        function (err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Profile updated successfully!"
            });
        }
    );
});


// ==================== POSTS ====================

// Create Post
app.post("/api/posts", (req, res) => {

    const { user_id, content } = req.body;

    if (!content || !content.trim()) {
        return res.status(400).json({
            error: "Post cannot be empty"
        });
    }

    db.run(
        `INSERT INTO posts (user_id, content)
         VALUES (?, ?)`,
        [user_id || 1, content.trim()],
        function (err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Post created successfully!",
                postId: this.lastID
            });
        }
    );
});


// Get All Posts
app.get("/api/posts", (req, res) => {

    db.all(
        `SELECT
            posts.id,
            posts.user_id,
            posts.content,
            posts.created_at,
            users.name,

            (SELECT COUNT(*)
             FROM likes
             WHERE likes.post_id = posts.id) AS likes

         FROM posts

         LEFT JOIN users
         ON posts.user_id = users.id

         ORDER BY posts.id DESC`,

        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(rows);
        }
    );
});


// ==================== COMMENTS ====================

// Add Comment
app.post("/api/comments", (req, res) => {

    const { post_id, user_id, content } = req.body;

    if (!content || !content.trim()) {
        return res.status(400).json({
            error: "Comment cannot be empty"
        });
    }

    db.run(
        `INSERT INTO comments
         (post_id, user_id, content)
         VALUES (?, ?, ?)`,
        [post_id, user_id || 1, content.trim()],
        function (err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Comment added successfully!",
                commentId: this.lastID
            });
        }
    );
});


// Get Comments
app.get("/api/comments/:post_id", (req, res) => {

    db.all(
        `SELECT
            comments.id,
            comments.content,
            comments.created_at,
            users.name

         FROM comments

         LEFT JOIN users
         ON comments.user_id = users.id

         WHERE comments.post_id = ?

         ORDER BY comments.id ASC`,

        [req.params.post_id],

        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(rows);
        }
    );
});


// ==================== LIKES ====================

// Like Post
app.post("/api/likes", (req, res) => {

    const { post_id, user_id } = req.body;

    const currentUser = user_id || 1;

    db.get(
        `SELECT *
         FROM likes
         WHERE post_id = ?
         AND user_id = ?`,

        [post_id, currentUser],

        (err, row) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (row) {
                return res.json({
                    message: "Already liked!"
                });
            }

            db.run(
                `INSERT INTO likes
                 (post_id, user_id)
                 VALUES (?, ?)`,

                [post_id, currentUser],

                function (err) {

                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    res.json({
                        message: "Post liked!"
                    });
                }
            );
        }
    );
});


// ==================== FOLLOW ====================

// Follow User
app.post("/api/follow", (req, res) => {

    const { follower_id, following_id } = req.body;

    const follower = follower_id || 1;

    if (!following_id) {
        return res.status(400).json({
            error: "User ID required"
        });
    }

    if (follower == following_id) {
        return res.json({
            message: "You cannot follow yourself!"
        });
    }

    db.get(
        `SELECT *
         FROM followers
         WHERE follower_id = ?
         AND following_id = ?`,

        [follower, following_id],

        (err, row) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (row) {
                return res.json({
                    message: "Already following!"
                });
            }

            db.run(
                `INSERT INTO followers
                 (follower_id, following_id)
                 VALUES (?, ?)`,

                [follower, following_id],

                function (err) {

                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    res.json({
                        message: "User followed successfully!"
                    });
                }
            );
        }
    );
});


// ==================== FOLLOWERS ====================

// Get Followers
app.get("/api/users/:id/followers", (req, res) => {

    db.all(
        `SELECT users.id, users.name, users.bio

         FROM followers

         JOIN users
         ON followers.follower_id = users.id

         WHERE followers.following_id = ?`,

        [req.params.id],

        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(rows);
        }
    );
});


// Get Following
app.get("/api/users/:id/following", (req, res) => {

    db.all(
        `SELECT users.id, users.name, users.bio

         FROM followers

         JOIN users
         ON followers.following_id = users.id

         WHERE followers.follower_id = ?`,

        [req.params.id],

        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(rows);
        }
    );
});


// ==================== SERVER ====================

app.listen(3000, () => {

    console.log("================================");
    console.log("✨ Connect Social Media Started");
    console.log("🌐 http://localhost:3000");
    console.log("================================");

});