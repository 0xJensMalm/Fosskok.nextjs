"use client";

import React, { useState, useEffect } from "react";
import styles from "./sistenytt.module.css";
import ImageUploader from "../../src/components/admin/ImageUploader";
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TiptapImage from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Heading from '@tiptap/extension-heading';

// Utility: slugify a title for URLs
function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9æøå]+/gi, '-') // Allow Norwegian chars
    .replace(/^-+|-+$/g, '')         // Trim hyphens
    .replace(/--+/g, '-');           // Collapse multiple hyphens
}

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
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TiptapImage,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Heading.configure({ levels: [1, 2, 3] })
    ],
    content: '',
  });

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
    const slug = slugify(title);
    const res = await fetch('/api/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        content,
        image,
        author: 'admin',
        is_published: true,
        slug
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
        <h1 style={{ fontSize: '2.1rem', marginBottom: 0 }}>Siste nytt</h1>
        {!loggedIn && (
          <div className={styles.loginCorner}>
            <LoginBox onLogin={handleLogin} error={loginError} />
          </div>
        )}
        {loggedIn && !showEditor && (
          <button className={styles.addPostButton} onClick={() => setShowEditor(true)}>
            + Nytt innlegg
          </button>
        )}
      </div>
      {/* Blog List View */}
      {!showEditor ? (
        <div className={styles.blogList}>
          {loading ? <div>Laster...</div> : blogPosts.map(post => (
            <div key={post.id} className={styles.blogPost}>
              {post.image && (
                <img src={post.image} alt="Blogg bilde" className={styles.blogPostImage} />
              )}
              <div className={styles.blogPostContent} dangerouslySetInnerHTML={{ __html: post.content }} />
              <div className={styles.blogPostMeta}>
                {post.author} • {new Date(post.created_at).toLocaleDateString('no-NO', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Editor View
        <form className={styles.blogForm} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            placeholder="Tittel på blogginnlegg"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            style={{ fontSize: '1.15rem', fontWeight: 600 }}
          />
          <ImageUploader onImageUploaded={handleImageUploaded} />
          {image && (
            <div className={styles.imagePreview}>
              <img src={image} alt="Forhåndsvisning" />
            </div>
          )}
          <div style={{ border: '1px solid #eee', borderRadius: 8, background: '#fff', minHeight: 180, padding: 8 }}>
            <EditorContent editor={editor} />
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button className={styles.submitButton} type="submit" disabled={submitting}>
              {submitting ? 'Lagrer...' : 'Publiser'}
            </button>
            <button type="button" style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }} onClick={() => setShowEditor(false)}>
              Avbryt
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
