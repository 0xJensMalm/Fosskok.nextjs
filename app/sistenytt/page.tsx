"use client";

import React, { useState, useEffect } from "react";
import styles from "./sistenytt.module.css";
import ImageUploader from "../../src/components/admin/ImageUploader";
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

function LoginBox({ onLogin, error }: { onLogin: (username: string, password: string) => void; error: string }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className={styles.loginBox}>
      <form
        onSubmit={e => {
          e.preventDefault();
          onLogin(username, password);
        }}
        className={styles.loginFormCompact}
      >
        <input
          type="text"
          placeholder="Brukernavn"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Passord"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.loginButton}>
          Logg inn
        </button>
        {error && <div className={styles.error}>{error}</div>}
      </form>
    </div>
  );
}

export default function SisteNyttPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const editor = useEditor({ extensions: [StarterKit], content: '' });

  useEffect(() => {
    fetch('/api/blog')
      .then(res => res.json())
      .then(data => {
        setBlogPosts(data);
        setLoading(false);
      });
  }, [showEditor]);

  const handleLogin = async (username: string, password: string) => {
    setLoginError("");
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      setLoggedIn(true);
      setShowEditor(true);
    } else {
      const data = await res.json();
      setLoginError(data?.message || 'Innlogging feilet');
    }
  };

  const handleImageUploaded = (url: string) => {
    setImage(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const content = editor?.getHTML() || '';
    const res = await fetch('/api/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        content,
        image,
        author: 'admin',
        is_published: true
      })
    });
    setSubmitting(false);
    if (res.ok) {
      setTitle("");
      editor?.commands.setContent('');
      setImage("");
      setShowEditor(false);
      setLoggedIn(false);
      setLoginError("");
      // Refresh posts
      setLoading(true);
      fetch('/api/blog')
        .then(res => res.json())
        .then(data => {
          setBlogPosts(data);
          setLoading(false);
        });
    } else {
      alert('Kunne ikke lagre blogginnlegg');
    }
  };

  return (
    <div className={styles.blogViewContainer}>
      <div className={styles.blogHeader}>
        <h1>Siste Nytt</h1>
        {!loggedIn && !showEditor && (
          <div className={styles.loginCorner}><LoginBox onLogin={handleLogin} error={loginError} /></div>
        )}
        {loggedIn && !showEditor && (
          <button className={styles.addPostButton} onClick={() => setShowEditor(true)}>Ny bloggpost</button>
        )}
      </div>
      {showEditor ? (
        <form onSubmit={handleSubmit} className={styles.blogEditorForm}>
          <h2>Ny Bloggpost</h2>
          <div className={styles.formGroup}>
            <label htmlFor="title">Tittel</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Innhold</label>
            <div className={styles.tiptapEditor}>
              <EditorContent editor={editor} />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Bilde</label>
            <ImageUploader onImageUploaded={handleImageUploaded} folder="blog" />
            {image && (
              <div className={styles.imagePreview}>
                <img src={image} alt="Preview" />
              </div>
            )}
          </div>
          <button type="submit" disabled={submitting} className={styles.submitButton}>
            {submitting ? "Lagrer..." : "Lagre Bloggpost"}
          </button>
        </form>
      ) : (
        <div className={styles.blogList}>
          {loading ? (
            <div>Laster innlegg...</div>
          ) : blogPosts.length === 0 ? (
            <div>Ingen blogginnlegg enda.</div>
          ) : (
            blogPosts.map(post => (
              <div key={post.id} className={styles.blogPost}>
                {post.image && <img src={post.image} alt="Blogg bilde" className={styles.blogPostImage} />}
                <h2>{post.title}</h2>
                <div className={styles.blogPostContent} dangerouslySetInnerHTML={{ __html: post.content }} />
                <div className={styles.blogPostMeta}>{new Date(post.created_at).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
