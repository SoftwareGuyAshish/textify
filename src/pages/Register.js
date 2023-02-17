import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { FcAddImage } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase";

const Register = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const avatar = e.target[3].files[0];

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const storageRef = ref(storage, email);

      // the first async-await solves the problem that object was unavailable while getting downloadURL
      uploadBytes(storageRef, avatar).then(async (snapshot) => {
        await getDownloadURL(snapshot.ref).then(async (downloadURL) => {
          await updateProfile(res.user, {
            displayName,
            photoURL: downloadURL,
          });

          await setDoc(doc(db, "users", res.user.uid), {
            uid: res.user.uid,
            displayName,
            email,
            photoURL: downloadURL,
          });

          await setDoc(doc(db, "userChats", res.user.uid), {});

          navigate("/");
        });
      });
    } catch (err) {
      setErr(true);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <p className="logo">Textify</p>
        <p className="title">Register</p>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <input style={{ display: "none" }} type="file" id="avatar" />
          <label htmlFor="avatar">
            <FcAddImage size={40} className="react-icon" />
            <span>Add an avatar</span>
          </label>
          <button>Register</button>
        </form>
        {err && <span style={{ color: "red" }}>Something went wrong</span>}
        <p>Already have an account? {<Link to="../login">Login</Link>}</p>
      </div>
    </div>
  );
};

export default Register;
