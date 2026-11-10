import Register from "./Register";
import Profile from "./Profile";
import Login from "./Login";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  // =========================
  // AUTHENTICATION
  // =========================
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );
  const user = JSON.parse(
  localStorage.getItem("user")
  );

  const [showRegister, setShowRegister] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // =========================
  // STUDENT STATES
  // =========================
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [image, setImage] = useState(null);
  const [pdf, setPdf] = useState(null);

  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  // =========================
  // FETCH STUDENTS
  // =========================
  useEffect(() => {
    if (isLoggedIn) {
      fetchStudents();
    }
  }, [isLoggedIn]);

 const fetchStudents = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:5000/students",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setStudents(res.data);
  } catch (error) {
    console.log(error);
  }
};

  // =========================
  // SEARCH
  // =========================
  const filteredStudents = students.filter((student) => {
    return (
      student.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      student.email
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  });

  // =========================
  // ADD STUDENT
  // =========================
  const addStudent = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("age", age);

      if (image) {
        formData.append("image", image);
      }

      if (pdf) {
        formData.append("pdf", pdf);
      }

      await axios.post(
        "http://localhost:5000/students/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      fetchStudents();

      setName("");
      setEmail("");
      setAge("");
      setImage(null);
      setPdf(null);

      alert("Student Added Successfully");

    } catch (error) {
      console.log(error);
      alert("Failed to Add Student");
    }
  };

  // =========================
  // UPDATE STUDENT
  // =========================
  const updateStudent = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("age", age);

      if (image) {
        formData.append("image", image);
      }

      if (pdf) {
        formData.append("pdf", pdf);
      }

      await axios.put(
        `http://localhost:5000/students/update/${editId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      fetchStudents();

      setEditId(null);
      setName("");
      setEmail("");
      setAge("");
      setImage(null);
      setPdf(null);

      alert("Student Updated Successfully");

    } catch (error) {
      console.log(error);
      alert("Update Failed");
    }
  };

  // =========================
  // DELETE STUDENT
  // =========================
  const deleteStudent = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/students/delete/${id}`
      );

      fetchStudents();

      alert("Student Deleted Successfully");

    } catch (error) {
        console.log("DELETE ERROR:",
      error.response?.data);
        console.log("STATUS:",
      error.response?.status);
        console.log("MESSAGE:", error.message);
        alert(error.response?.data?.message ||
      error.message);

    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setIsLoggedIn(false);
  setShowRegister(false);
  setShowProfile(false);
};

  // =========================
  // REGISTER PAGE
  // =========================
  if (!isLoggedIn && showRegister) {
    return (
      <Register
        onRegister={() => setShowRegister(false)}
      />
    );
  }

  // =========================
  // LOGIN PAGE
  // =========================
  if (!isLoggedIn) {
    return (
      <Login
        onLogin={() => setIsLoggedIn(true)}
        onRegister={() => setShowRegister(true)}
      />
    );
  }
   // =========================
// PROFILE PAGE
// =========================
if (showProfile) {
  return (
    <Profile
      onBack={() => setShowProfile(false)}
    />
  );
}
  // =========================
  // DASHBOARD
  // =========================
  return (
    <div className="app">

      {/* NAVBAR */}
      <div className="navbar">

  <div>
    <h1>
      🎓 Student Management Dashboard
    </h1>

    {user && (
      <p className="welcome-user">
        👋 Welcome, {user.name}
      </p>
    )}
  </div>

  <div className="nav-buttons">

  <button
    className="profile-btn"
    onClick={() => setShowProfile(true)}
  >
    👤 Profile
  </button>

  <button
    className="logout-btn"
    onClick={handleLogout}
  >
    🚪 Logout
  </button>

</div>
</div>

      {/* TOTAL STUDENTS */}
<div className="cards">
  <div className="card blue">
    <h2>{students.length}</h2>
    <p>Total Students</p>
  </div>
</div>

      {/* MAIN CONTAINER */}
      <div className="container">

        {/* FORM */}
        <div className="form-section">

          <h2>
            {editId
              ? "Update Student"
              : "Add Student"}
          </h2>

          <input
            type="text"
            placeholder="Student Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) =>
              setAge(e.target.value)
            }
          />

          {/* IMAGE */}
          <label className="upload-btn">
            📷 Choose Picture

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) =>
                setImage(e.target.files[0])
              }
            />
          </label>

          {image && (
            <p className="file-name">
              {image.name}
            </p>
          )}

          {pdf && (
            <p className="file-name">
              {pdf.name}
            </p>
          )}

          {/* ADD / UPDATE */}
          {editId ? (

            <button
              className="update-btn"
              onClick={updateStudent}
            >
              Update Student
            </button>

          ) : (

            <button
              className="add-btn"
              onClick={addStudent}
            >
              Add Student
            </button>

          )}

        </div>

        {/* TABLE */}
        <div className="table-section">

          <h2>Student Records</h2>

          <input
            type="text"
            placeholder="🔍 Search Student..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="search-box"
          />

          <br />
          <br />

          <table>

            <thead>

              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {filteredStudents.map(
                (student) => (

                  <tr key={student._id}>

                    {/* PHOTO */}
                    <td>

                      {student.image ? (

                        <img
                          src={`http://localhost:5000/uploads/${student.image}`}
                          alt="student"
                          className="student-image"
                        />

                      ) : (

                        <img
                          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          alt="student"
                          className="student-image"
                        />

                      )}

                    </td>

                    {/* NAME */}
                    <td>
                      {student.name}
                    </td>

                    {/* EMAIL */}
                    <td>
                      {student.email}
                    </td>

                    {/* AGE */}
                    <td>
                      {student.age}
                    </td>

                    {/* ACTIONS */}
                    <td>

                      <button
                        className="edit-btn"
                        onClick={() => {

                          setEditId(
                            student._id
                          );

                          setName(
                            student.name
                          );

                          setEmail(
                            student.email
                          );

                          setAge(
                            student.age
                          );

                        }}
                      >
                        ✏ Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteStudent(
                            student._id
                          )
                        }
                      >
                        🗑 Delete
                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default App;