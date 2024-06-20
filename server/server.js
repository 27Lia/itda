const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

// SQLite 데이터베이스 설정 (파일 저장)
const db = new sqlite3.Database("./notes.db", (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to the notes database.");
  }
});

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, content TEXT)",
    (err) => {
      if (err) {
        console.error("Table creation error:", err.message);
      } else {
        console.log("Notes table created or already exists.");
      }
    }
  );
});

// 메모 리스트 가져오기
app.get("/api/notes", (req, res) => {
  db.all("SELECT * FROM notes", (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(rows);
    }
  });
});

// 메모 추가하기
app.post("/api/notes", (req, res) => {
  const content = req.body.note;
  db.run("INSERT INTO notes (content) VALUES (?)", content, function (err) {
    if (err) {
      res.status(500).send(err);
    } else {
      console.log(`Inserted note with ID: ${this.lastID}`);
      res.status(201).json({ id: this.lastID, content });
    }
  });
});

// 메모 수정하기
app.put("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  const content = req.body.note;
  db.run(
    "UPDATE notes SET content = ? WHERE id = ?",
    [content, id],
    function (err) {
      if (err) {
        res.status(500).send(err);
      } else {
        console.log(`Updated note with ID: ${id}`);
        res.status(200).json({ id, content });
      }
    }
  );
});

// 메모 삭제하기
app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM notes WHERE id = ?", id, function (err) {
    if (err) {
      res.status(500).send(err);
    } else {
      console.log(`Deleted note with ID: ${id}`);
      res.status(200).json({ id });
    }
  });
});

// 기본 경로 핸들러 추가
app.get("/", (req, res) => {
  res.send("Hello, this is the backend server for the Todo List App!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
