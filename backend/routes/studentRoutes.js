const express = require("express");

const router = express.Router();

const Student = require("../models/Student");

const upload = require("../middleware/multer");

const authMiddleware = require("../middleware/authMiddleware");

const adminMiddleware = require("../middleware/adminMiddleware");


// ============================
// CREATE STUDENT
// ============================

router.post(
  "/create",

  authMiddleware,
adminMiddleware,
upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 }
  ]),

  async (req, res) => {

    try {

      const student = await Student.create({

        name: req.body.name,

        email: req.body.email,

        age: req.body.age,

        image: req.files.image
          ? req.files.image[0].filename
          : "",

        pdf: req.files.pdf
          ? req.files.pdf[0].filename
          : ""

      });

      res.json(student);

    } catch (err) {

      res.status(500).json({
        message: "Failed to create student",
        error: err.message
      });

    }

  }
);


// ============================
// READ STUDENTS
// ============================

router.get(
  "/",

  authMiddleware,

  async (req, res) => {

    try {

      const students = await Student.find();

      res.json(students);

    } catch (err) {

      res.status(500).json(err);

    }

  }
);


// ============================
// UPDATE STUDENT
// ============================

router.put(
  "/update/:id",

  authMiddleware,
adminMiddleware,

upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 }
  ]),

  async (req, res) => {

    try {

      let updateData = {

        name: req.body.name,

        email: req.body.email,

        age: req.body.age

      };

      if (req.files.image) {

        updateData.image =
          req.files.image[0].filename;

      }

      if (req.files.pdf) {

        updateData.pdf =
          req.files.pdf[0].filename;

      }

      const student =
        await Student.findByIdAndUpdate(

          req.params.id,

          updateData,

          {
            returnDocument: "after"
          }

        );

      res.json(student);

    } catch (err) {

      res.status(500).json({

        message: "Failed to update student",

        error: err.message

      });

    }

  }
);


// ============================
// DELETE STUDENT
// ============================

router.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);

      if (!student) {
        return res.status(404).json({
          message: "Student not found"
        });
      }

      await Student.findByIdAndDelete(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Student deleted successfully"
      });

    } catch (error) {
      console.log("Delete Error:", error);

      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);


module.exports = router;