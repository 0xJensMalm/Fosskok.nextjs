"use client";

import React, { useState } from "react";
import styles from "./sistenytt.module.css";
import ImageUploader from "../../src/components/admin/ImageUploader";
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const USERNAME = "admin";
const PASSWORD = "fosskok2025";

export default function SisteNyttPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Tiptap editor instance
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
  });

  // Simple local login (replace with API call for real auth)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (username === USERNAME && password === PASSWORD) {
      setLoggedIn(true);
    } else {
      setError("Feil brukernavn eller passord");
    }
  };

  const handleImageUploaded = (url: string) => {
    setImage(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // TODO: API call to save blog post
    setTimeout(() => {
      setSubmitting(false);
      alert("Blogginnlegg lagret (mock)");
      setTitle("");
      editor?.commands.setContent('');
      setImage("");
    }, 1200);
  };

  if (!loggedIn) {
    return (
      <div className={styles.loginPrompt}>
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <h2>Siste Nytt – Logg inn</h2>
          <input
            type="text"
            placeholder="Brukernavn"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className={styles.input}
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Passord"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={styles.input}
            autoComplete="current-password"
          />
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.loginButton}>Logg inn</button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.blogEditorContainer}>
      <h1>Siste Nytt – Nytt Blogginnlegg</h1>
      <form onSubmit={handleSubmit} className={styles.blogForm}>
        <input
          type="text"
          placeholder="Tittel på innlegget"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className={styles.input}
          required
        />
        <div className={styles.formGroup}>
          <label>Innhold</label>
          <div className={styles.tiptapEditor}>
            <EditorContent editor={editor} />
          </div>
        </div>
        <ImageUploader onImageUploaded={handleImageUploaded} folder="blog" />
        {image && (
          <div className={styles.imagePreview}>
            <img src={image} alt="Blogg-bilde" />
          </div>
        )}
        <button type="submit" className={styles.submitButton} disabled={submitting}>
          {submitting ? "Lagrer..." : "Publiser innlegg"}
        </button>
      </form>
    </div>
  );
}
