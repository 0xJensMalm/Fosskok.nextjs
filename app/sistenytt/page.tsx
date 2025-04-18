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
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Utility: slugify a title for URLs
function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9æøå]+/gi, '-') // Allow Norwegian chars
    .replace(/^-+|-+$/g, '')         // Trim hyphens
    .replace(/--+/g, '-');           // Collapse multiple hyphens
}

// Utility: generate a unique slug
function uniqueSlugify(title: string, existingSlugs: string[]) {
  let base = slugify(title);
  let slug = base;
  let i = 1;
  while (existingSlugs.includes(slug)) {
    slug = `${base}-${i++}`;
  }
  return slug;
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

    // Fetch all existing slugs for uniqueness
    let existingSlugs: string[] = [];
    try {
      const res = await fetch('/api/blog');
      if (res.ok) {
        const posts = await res.json();
        existingSlugs = posts.map((p: any) => p.slug);
      }
    } catch {}
    const slug = uniqueSlugify(title, existingSlugs);

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

  // --- Tiptap Toolbar ---
  function TiptapToolbar({ editor }: { editor: any }) {
    if (!editor) return null;
    const isActive = (fn: () => boolean) => fn() ? 'active' : '';
    return (
      <div className={styles.tiptapToolbar}>
        <button type="button" className={isActive(() => editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} title="Fet">B</button>
        <button type="button" className={isActive(() => editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} title="Kursiv">I</button>
        <button type="button" className={isActive(() => editor.isActive('underline'))} onClick={() => editor.chain().focus().toggleUnderline().run()} disabled={!editor.can().chain().focus().toggleUnderline().run()} title="Understreket">U</button>
        <span className="toolbar-sep" />
        <button type="button" className={isActive(() => editor.isActive('heading', { level: 1 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Overskrift 1">H1</button>
        <button type="button" className={isActive(() => editor.isActive('heading', { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Overskrift 2">H2</button>
        <button type="button" className={isActive(() => editor.isActive('heading', { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Overskrift 3">H3</button>
        <span className="toolbar-sep" />
        <button type="button" className={isActive(() => editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Punktliste">•</button>
        <button type="button" className={isActive(() => editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Nummerert liste">1.</button>
        <span className="toolbar-sep" />
        <button type="button" className={isActive(() => editor.isActive({ textAlign: 'left' }))} onClick={() => editor.chain().focus().setTextAlign('left').run()} title="Venstrejuster">⯇</button>
        <button type="button" className={isActive(() => editor.isActive({ textAlign: 'center' }))} onClick={() => editor.chain().focus().setTextAlign('center').run()} title="Senter">≡</button>
        <button type="button" className={isActive(() => editor.isActive({ textAlign: 'right' }))} onClick={() => editor.chain().focus().setTextAlign('right').run()} title="Høyrejuster">⯈</button>
        <span className="toolbar-sep" />
        <button type="button" onClick={() => {
          const url = prompt('Lim inn lenke:');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }} title="Lenke">🔗</button>
        <button type="button" onClick={() => {
          const url = prompt('Lim inn bilde-URL:');
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }} title="Bilde fra URL">🖼️</button>
        <span className="toolbar-sep" />
        <button type="button" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Fjern formatering">✕</button>
      </div>
    );
  }

  // --- Image Preview, Move, and Crop ---
  function ImageCropper({ src, onCrop }: { src: string, onCrop: (croppedUrl: string) => void }) {
    const [crop, setCrop] = useState<Crop>({ unit: '%', width: 80, aspect: 16/9 });
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
    const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

    // When cropping is done, create a cropped image and pass URL to parent
    useEffect(() => {
      if (!completedCrop || !imageRef) return;
      const canvas = document.createElement('canvas');
      const scaleX = imageRef.naturalWidth / imageRef.width;
      const scaleY = imageRef.naturalHeight / imageRef.height;
      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(
          imageRef,
          completedCrop.x * scaleX,
          completedCrop.y * scaleY,
          completedCrop.width * scaleX,
          completedCrop.height * scaleY,
          0,
          0,
          completedCrop.width,
          completedCrop.height
        );
        canvas.toBlob(blob => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            onCrop(url);
          }
        }, 'image/jpeg');
      }
    }, [completedCrop, imageRef, onCrop]);

    return (
      <div className={styles.imageCropperContainer}>
        <div className={styles.cropperBox}>
          <ReactCrop
            crop={crop}
            onChange={c => setCrop(c)}
            onComplete={c => setCompletedCrop(c)}
            aspect={16/9}
          >
            <img
              ref={setImageRef}
              src={src}
              alt="Crop preview"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          </ReactCrop>
        </div>
        <div className={styles.cropperControls}>
          <button type="button" onClick={() => setCrop({ unit: '%', width: 100, aspect: 16/9 })}>Full bredde</button>
          <button type="button" onClick={() => setCrop({ unit: '%', width: 60, aspect: 1 })}>Kvadrat</button>
          <button type="button" onClick={() => setCrop({ unit: '%', width: 80, aspect: 4/3 })}>4:3</button>
        </div>
      </div>
    );
  }

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
            <>
              <ImageCropper src={image} onCrop={url => setImage(url)} />
            </>
          )}
          <TiptapToolbar editor={editor} />
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
