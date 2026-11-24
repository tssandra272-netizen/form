
import { useState, useEffect } from "react";

export default function App() {
  const [students, setStudents] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("students"));
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    course: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("students", JSON.stringify(students));
    } catch {
      setMessage("Unable to save student data.");
    }
  }, [students]);

  // Input Styles
  const inputStyle =
    "w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-indigo-200 outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 transition";

  const labelStyle =
    "block text-sm font-semibold text-indigo-100 mb-2";

  const errorStyle =
    "text-red-300 text-xs mt-2 font-medium";

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Phone Number Change
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");

    if (value.length <= 10) {
      setForm((prev) => ({
        ...prev,
        phone: value,
      }));

      setErrors((prev) => ({
        ...prev,
        phone: "",
      }));
    }
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    // Name Validation
    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "Name must contain at least 3 characters";
    } else if (form.name.trim().length > 50) {
      newErrors.name = "Name cannot exceed 50 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(form.name.trim())) {
      newErrors.name = "Only letters and spaces are allowed";
    }

    // Email Validation
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      newErrors.email = "Enter a valid email address";
    } else if (
      students.some(
        (student) =>
          student.email.toLowerCase() ===
          form.email.trim().toLowerCase()
      )
    ) {
      newErrors.email = "Email is already registered";
    }

    // Phone Validation
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9][0-9]{9}$/.test(form.phone)) {
      newErrors.phone =
        "Enter a valid 10-digit Indian mobile number";
    }

    // Gender Validation
    if (!form.gender) {
      newErrors.gender = "Please select gender";
    }

    // DOB Validation
    if (!form.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const birthDate = new Date(`${form.dob}T00:00:00`);
      const today = new Date();

      if (Number.isNaN(birthDate.getTime())) {
        newErrors.dob = "Enter a valid date";
      } else if (birthDate > today) {
        newErrors.dob = "Future dates are not allowed";
      } else {
        let age =
          today.getFullYear() - birthDate.getFullYear();

        const birthdayPending =
          today.getMonth() < birthDate.getMonth() ||
          (today.getMonth() === birthDate.getMonth() &&
            today.getDate() < birthDate.getDate());

        if (birthdayPending) age--;

        if (age < 5) {
          newErrors.dob =
            "Student must be at least 5 years old";
        }
      }
    }

    // Course Validation
    if (!form.course) {
      newErrors.course = "Please select a course";
    }

    // Address Validation
    if (!form.address.trim()) {
      newErrors.address = "Address is required";
    } else if (form.address.trim().length < 10) {
      newErrors.address =
        "Address must contain at least 10 characters";
    } else if (form.address.trim().length > 200) {
      newErrors.address =
        "Address cannot exceed 200 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit Form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage("");
      return;
    }

    const newStudent = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone,
      address: form.address.trim(),
      id: Date.now(),
    };

    setStudents((prev) => [newStudent, ...prev]);

    setForm({
      name: "",
      email: "",
      phone: "",
      gender: "",
      dob: "",
      course: "",
      address: "",
    });

    setErrors({});

    setMessage("Student registered successfully! 🎉");

    setTimeout(() => setMessage(""), 3000);
  };

  // Delete Student
  const deleteStudent = (id) => {
    setStudents((prev) =>
      prev.filter((student) => student.id !== id)
    );
  };

  // Search Students
  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.email} ${student.course}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Reusable Error Message
  const ErrorMessage = ({ error }) =>
    error ? (
      <p className={errorStyle}>⚠️ {error}</p>
    ) : null;

  return (
    <div className="min-h-screen animated-bg p-4 sm:p-8">

      <style>{`
        .animated-bg {
          background: linear-gradient(
            -45deg,
            #0f172a,
            #312e81,
            #701a75,
            #164e63
          );
          background-size: 400% 400%;
          animation: gradientMove 12s ease infinite;
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .glass {
          background: rgba(255,255,255,0.10);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.15);
        }

        .gradient-text {
          background: linear-gradient(
            90deg,
            #67e8f9,
            #c084fc,
            #f0abfc
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .student-card {
          animation: slideUp .4s ease both;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        select option {
          background: #312e81;
          color: white;
        }

        @media (prefers-reduced-motion: reduce) {
          .animated-bg, .student-card {
            animation: none;
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <header className="text-center mb-10">

          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-cyan-200 text-sm mb-5">

            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>

            Student Management Portal

          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white">

            Student{" "}

            <span className="gradient-text">
              Registration
            </span>

          </h1>

          <p className="text-indigo-200 mt-3">
            Register students and manage their information easily.
          </p>

        </header>

        {/* STATISTICS */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

          <div className="glass rounded-2xl p-5 text-center">

            <p className="text-3xl font-bold text-white">
              {students.length}
            </p>

            <p className="text-indigo-200 text-sm mt-1">
              Total Students
            </p>

          </div>

          <div className="glass rounded-2xl p-5 text-center">

            <p className="text-3xl font-bold text-cyan-300">
              {students.filter(
                (s) => s.gender === "Male"
              ).length}
            </p>

            <p className="text-indigo-200 text-sm mt-1">
              Male Students
            </p>

          </div>

          <div className="glass rounded-2xl p-5 text-center">

            <p className="text-3xl font-bold text-pink-300">
              {students.filter(
                (s) => s.gender === "Female"
              ).length}
            </p>

            <p className="text-indigo-200 text-sm mt-1">
              Female Students
            </p>

          </div>

        </div>

        {/* REGISTRATION FORM */}

        <div className="glass rounded-3xl p-5 sm:p-8 mb-10 shadow-2xl">

          <div className="mb-7">

            <h2 className="text-2xl font-bold text-white">
              ✨ Register New Student
            </h2>

            <p className="text-indigo-200 text-sm mt-2">
              Fill in the details below to register.
            </p>

          </div>

          {message && (

            <div
              role="status"
              className="bg-green-400/20 border border-green-300/30 text-green-200 p-4 rounded-xl mb-6"
            >
              {message}
            </div>

          )}

          <form onSubmit={handleSubmit} noValidate>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* NAME */}

              <div>

                <label className={labelStyle}>
                  Full Name *
                </label>

                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  maxLength={50}
                  placeholder="Enter student name"
                  aria-invalid={!!errors.name}
                  className={`${inputStyle} ${
                    errors.name ? "border-red-400" : ""
                  }`}
                />

                <ErrorMessage error={errors.name} />

              </div>

              {/* EMAIL */}

              <div>

                <label className={labelStyle}>
                  Email Address *
                </label>

                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="student@example.com"
                  aria-invalid={!!errors.email}
                  className={`${inputStyle} ${
                    errors.email ? "border-red-400" : ""
                  }`}
                />

                <ErrorMessage error={errors.email} />

              </div>

              {/* PHONE */}

              <div>

                <label className={labelStyle}>
                  Phone Number *
                </label>

                <input
                  required
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handlePhoneChange}
                  maxLength={10}
                  inputMode="numeric"
                  pattern="[6-9][0-9]{9}"
                  placeholder="Enter 10 digit mobile number"
                  aria-invalid={!!errors.phone}
                  className={`${inputStyle} ${
                    errors.phone ? "border-red-400" : ""
                  }`}
                />

                <ErrorMessage error={errors.phone} />

              </div>

              {/* GENDER */}

              <div>

                <label className={labelStyle}>
                  Gender *
                </label>

                <select
                  required
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  aria-invalid={!!errors.gender}
                  className={`${inputStyle} ${
                    errors.gender ? "border-red-400" : ""
                  }`}
                >

                  <option value="">
                    Select Gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

                <ErrorMessage error={errors.gender} />

              </div>

              {/* DOB */}

              <div>

                <label className={labelStyle}>
                  Date of Birth *
                </label>

                <input
                  required
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  max={new Date().toLocaleDateString("en-CA")}
                  aria-invalid={!!errors.dob}
                  className={`${inputStyle} [color-scheme:dark] ${
                    errors.dob ? "border-red-400" : ""
                  }`}
                />

                <ErrorMessage error={errors.dob} />

              </div>

              {/* COURSE */}

              <div>

                <label className={labelStyle}>
                  Select Course *
                </label>

                <select
                  required
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  aria-invalid={!!errors.course}
                  className={`${inputStyle} ${
                    errors.course ? "border-red-400" : ""
                  }`}
                >

                  <option value="">
                    Choose Course
                  </option>

                  <option value="BCA">BCA</option>
                  <option value="BBA">BBA</option>
                  <option value="B.Com">B.Com</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="MCA">MCA</option>
                  <option value="MBA">MBA</option>
                  <option value="M.Sc">M.Sc</option>

                </select>

                <ErrorMessage error={errors.course} />

              </div>

            </div>

            {/* ADDRESS */}

            <div className="mt-5">

              <label className={labelStyle}>
                Address *
              </label>

              <textarea
                required
                name="address"
                value={form.address}
                onChange={handleChange}
                rows="3"
                maxLength={200}
                placeholder="Enter full address"
                aria-invalid={!!errors.address}
                className={`${inputStyle} resize-none ${
                  errors.address ? "border-red-400" : ""
                }`}
              />

              <ErrorMessage error={errors.address} />

              <p className="text-indigo-200 text-xs mt-1 text-right">
                {form.address.length}/200
              </p>

            </div>

            {/* SUBMIT BUTTON */}

            <button
              type="submit"
              className="w-full mt-7 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:scale-[1.02] active:scale-95 shadow-lg shadow-purple-500/30 transition duration-300"
            >
              Register Student →
            </button>

          </form>

        </div>

        {/* STUDENT LIST */}

        <div className="glass rounded-3xl p-5 sm:p-8">

          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-7">

            <div>

              <h2 className="text-2xl font-bold text-white">
                📚 Registered Students
              </h2>

              <p className="text-indigo-200 text-sm mt-2">
                Manage your registered students.
              </p>

            </div>

            <input
              type="search"
              placeholder="🔍 Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputStyle} sm:max-w-xs`}
            />

          </div>

          {filteredStudents.length === 0 ? (

            <div className="text-center py-12">

              <div className="text-5xl mb-4">
                🎓
              </div>

              <h3 className="text-white text-lg font-semibold">
                No students found
              </h3>

              <p className="text-indigo-200 text-sm mt-2">
                Register a student to see the details here.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {filteredStudents.map((student) => (

                <div
                  key={student.id}
                  className="student-card bg-white/10 border border-white/10 rounded-2xl p-5 hover:bg-white/15 transition duration-300"
                >

                  <div className="flex items-start justify-between gap-3 mb-4">

                    <div className="flex items-center gap-3 min-w-0">

                      <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">

                        {student.name.charAt(0).toUpperCase()}

                      </div>

                      <div className="min-w-0">

                        <h3 className="text-white font-bold truncate">
                          {student.name}
                        </h3>

                        <p className="text-indigo-200 text-xs truncate">
                          {student.email}
                        </p>

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() => deleteStudent(student.id)}
                      aria-label={`Delete ${student.name}`}
                      className="text-pink-300 hover:text-red-400 text-xl transition"
                    >
                      🗑️
                    </button>

                  </div>

                  <div className="space-y-2 text-sm text-indigo-100">

                    <p>📞 {student.phone}</p>

                    <p>👤 {student.gender}</p>

                    <p>🎂 {student.dob}</p>

                    <p>🎓 {student.course}</p>

                    <p className="break-words">
                      📍 {student.address}
                    </p>

                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10">

                    <span className="text-xs px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200">
                      {student.course} Student
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* FOOTER */}

        <footer className="text-center text-indigo-200/70 text-sm mt-8">
          Made with 💜 React JS & Tailwind CSS
        </footer>

      </div>

    </div>
  );
}