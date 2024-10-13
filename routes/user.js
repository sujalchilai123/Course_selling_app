const { Router } = require("express");
const userMiddleware = require("../middleware/user");
const { Admin, User, Course } = require("../db");
const { JWT_SECRET } = require("../config");
const router = Router();
const jwt = require("jsonwebtoken");
// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;
    await User.create({
        username, password
    })
    res.status(200).json({
        msg: "User created sucessfully"
    })
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.find({
        username, password
    })
    if (user) {
        const token = jwt.sign({
            username
        }, JWT_SECRET);
        res.json({
            token
        })
    }
    else {
        res.status(411).json({
            msg: "incorrect email and password"
        })
    }

});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    const response = await Course.find({})
    res.json({
        Course: response
    })
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const username = req.username;

    const courseId = req.params.courseId;
    await User.updateOne({
        username: username
    }, {
        $push: {
            purchasedCourses: courseId
        }
    })
    res.json({
        message: "Purchase complete!"
    })


});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const username = req.username;
    const user = await User.findOne({
        username: username
    });

    const courses = await Course.find({
        _id: {
            "$in": user.purchasedCourses
        }
    });
    let sum = 0;
    for (let i = 0; i < courses.length; i++) {
        sum = courses[i]["price"] + sum;
    }
    res.json({
        courses: courses,
        TotalCartValue: sum
    })

});

module.exports = router