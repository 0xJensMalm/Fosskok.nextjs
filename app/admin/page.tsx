"use client";

import React, { useState } from 'react';
import styles from './page.module.css';
import AdminNavbar from '../../src/components/admin/AdminNavbar';
import MembersPanel from '../../src/components/admin/MembersPanel';
import EventsPanel from '../../src/components/admin/EventsPanel';
import BlogPanel from '../../src/components/admin/BlogPanel';
import FeatureFlagsPanel from '../../src/components/admin/FeatureFlagsPanel';
import GrytaPanel from '../../src/components/admin/GrytaPanel';

export default function AdminPage() {
  const [activePanel, setActivePanel] = useState<'members' | 'events' | 'blog' | 'featureFlags' | 'gryta'>('members');

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.adminTitle}>Fosskok Admin</h1>
      
      <AdminNavbar activePanel={activePanel} setActivePanel={setActivePanel} />
      
      <div className={styles.adminContent}>
        {activePanel === 'members' && <MembersPanel />}
        {activePanel === 'events' && <EventsPanel />}
        {activePanel === 'blog' && <BlogPanel />}
        {activePanel === 'featureFlags' && <FeatureFlagsPanel />}
        {activePanel === 'gryta' && <GrytaPanel />}
      </div>
    </div>
  );
}
