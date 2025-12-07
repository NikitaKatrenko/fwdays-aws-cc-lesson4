import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

export default function App() {
    const API_BASE = "https://nm3ap7fmwj.execute-api.eu-central-1.amazonaws.com/prod";

    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const load = () => {
        fetch(`${API_BASE}/notes`)
            .then(r => r.json())
            .then(setNotes);
    };

    useEffect(load, []);

    const create = async () => {
        await fetch(`${API_BASE}/notes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content })
        });

        setTitle("");
        setContent("");
        load();
    };

    return (
        <div className="app-wrapper">
            <div className="card">
                <img
                    src="https://fwdays.com/build/img/logo_header.svg"
                    alt="Fwdays Logo"
                    className="mx-auto mb-6 w-40"
                />
                <h1>Notes App — AWS Serverless Demo</h1>

                <div className="form">
                    <input
                        placeholder="Заголовок"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <textarea
                        placeholder="Нотатка з підтримкою Markdown"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                    />

                    <button onClick={create}>Створити</button>
                </div>

                <div className="notes">
                    {notes.map((n: any) => (
                        <div className="note" key={n.id}>
                            <h3>{n.title}</h3>
                            <small>{new Date(Number(n.createdAt)).toLocaleString()}</small>
                            <ReactMarkdown>{n.content}</ReactMarkdown>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
