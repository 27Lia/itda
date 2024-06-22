import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import logo from "./assets/logo.svg";
const API_URL =
  "http://ec2-3-38-91-234.ap-northeast-2.compute.amazonaws.com:3001";

function App() {
  const [note, setCurrentNote] = useState("");
  const [noteList, setNoteList] = useState([]);
  const [editNoteId, setEditNoteId] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch(`${API_URL}/api/notes`);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setNoteList(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!note) {
      alert("내용을 입력해주세요.");
      inputRef.current.focus();
      return;
    }

    try {
      const response = await fetch(
        editNoteId
          ? `${API_URL}/api/notes/${editNoteId}`
          : `${API_URL}/api/notes`,
        {
          method: editNoteId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ note }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const newNote = await response.json();
      setNoteList(
        editNoteId
          ? noteList.map((n) => (n.id === editNoteId ? newNote : n))
          : [...noteList, newNote]
      );
      setEditNoteId(null);
      setCurrentNote("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/notes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setNoteList(noteList.filter((note) => note.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (note) => {
    setEditNoteId(note.id);
    setCurrentNote(note.content);
    inputRef.current.focus();
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4 overflow-hidden">
      <main className="bg-customGray rounded-lg  p-6 w-full max-w-md ">
        <header className="text-center mb-6">
          <img src={logo} alt="Logo" className="mx-auto w-16 h-16 mb-4" />
        </header>
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            ref={inputRef}
            value={note}
            onChange={(e) => setCurrentNote(e.target.value)}
            placeholder="내용을 입력해주세요."
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-customPink text-white p-3 rounded-lg hover:bg-customSoftPink transition-colors active:translate-y-1"
          >
            {editNoteId ? "Update" : "Add"}
          </button>
        </form>
        <section>
          <ul className="space-y-3 h-96 overflow-y-auto">
            {noteList.map((note) => (
              <li
                key={note.id}
                className="bg-white p-4 rounded-lg  flex justify-between items-center border h-20 overflow-hidden "
              >
                <div className="flex-grow h-full overflow-auto flex items-center">
                  <span>{note.content}</span>
                </div>
                <div className="space-x-2 flex-shrink-0 ml-4">
                  <button
                    onClick={() => handleEdit(note)}
                    className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors  active:shadow-none active:translate-y-1 border"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors shadow-lg active:shadow-none active:translate-y-1 border"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
