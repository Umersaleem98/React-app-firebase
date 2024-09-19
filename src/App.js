import { useState, useEffect } from "react";
import { db } from './firebase-config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newImage, setNewImage] = useState(""); // To store image URL
  const [editingPersonId, setEditingPersonId] = useState(null);
  const [error, setError] = useState(""); 
  const personCollectionRef = collection(db, "persons");

  useEffect(() => {
    const getPersons = async () => {
      const data = await getDocs(personCollectionRef);
      setPersons(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getPersons();
  }, []);

  // Function to create or update a person
  const createPerson = async () => {
    if (!newName || !newEmail || !newPhone || !newImage) {
      setError("Please enter all the fields.");
      return;
    }
    setError(""); 

    if (editingPersonId) {
      updatePerson(editingPersonId); 
    } else {
      const newPersonDoc = await addDoc(personCollectionRef, {
        name: newName,
        email: newEmail,
        phone: newPhone,
        image: newImage
      });
      setPersons([...persons, {
        id: newPersonDoc.id,
        name: newName,
        email: newEmail,
        phone: newPhone,
        image: newImage
      }]); // Update state without page reload
    }

    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setNewImage("");
    setEditingPersonId(null); 
  };

  // Function to delete a person
  const deletePerson = async (id) => {
    const personDoc = doc(db, "persons", id);
    await deleteDoc(personDoc);
    setPersons(persons.filter((person) => person.id !== id)); // Update the state
  };

  // Function to update a person
  const updatePerson = async (id) => {
    const personDoc = doc(db, "persons", id);
    await updateDoc(personDoc, {
      name: newName,
      email: newEmail,
      phone: newPhone,
      image: newImage
    });
    setPersons(persons.map((person) => (
      person.id === id ? { ...person, name: newName, email: newEmail, phone: newPhone, image: newImage } : person
    ))); // Update state
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setNewImage("");
    setEditingPersonId(null); 
  };

  // Function to populate form with selected person's data for editing
  const editPerson = (person) => {
    setNewName(person.name);
    setNewEmail(person.email);
    setNewPhone(person.phone);
    setNewImage(person.image);
    setEditingPersonId(person.id); 
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Person Management</h2>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="mb-4"
      >
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Enter name"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              required
            />
          </div>
          <div className="col">
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={newEmail}
              onChange={(event) => setNewEmail(event.target.value)}
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Enter phone"
              value={newPhone}
              onChange={(event) => setNewPhone(event.target.value)}
              required
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Enter image URL"
              value={newImage}
              onChange={(event) => setNewImage(event.target.value)}
              required
            />
          </div>
        </div>
        <button className="btn btn-primary" onClick={createPerson}>
          {editingPersonId ? "Update Person" : "Create Person"}
        </button>

        {error && <p className="text-danger">{error}</p>}
      </form>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {persons.map((person) => (
            <tr key={person.id}>
              <td>{person.name}</td>
              <td>{person.email}</td>
              <td>{person.phone}</td>
              <td><img src={person.image} alt={person.name} style={{ width: "50px", height: "50px" }} /></td>
              <td>
                <button className="btn btn-warning me-2" onClick={() => editPerson(person)}>
                  Update
                </button>
                <button className="btn btn-danger" onClick={() => deletePerson(person.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
