"use client";

import React, { useState, useEffect } from 'react';
import ContentContainer from '../../src/components/ContentContainer';
import { createClient } from '../../utils/supabase/client';
import GrytaGrid from './components/GrytaGrid';
import styles from './page.module.css';

interface GrytaItem {
  id: string;
  image_url: string;
  thumbnail_url: string;
  description: string;
  member_id?: string;
  member_name?: string;
  created_at: string;
}

export default function Gryta() {
  const [items, setItems] = useState<GrytaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrytaItems = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        
        const { data, error } = await supabase
          .from('gryta_items')
          .select('*, members:member_id(name)')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // Format the data
        const formattedItems = data.map((item: any) => ({
          id: item.id,
          image_url: item.image_url,
          thumbnail_url: item.thumbnail_url,
          description: item.description,
          member_id: item.member_id,
          member_name: item.members?.name,
          created_at: item.created_at,
        }));
        
        setItems(formattedItems);
      } catch (err) {
        console.error('Error fetching Gryta items:', err);
        setError('Kunne ikke laste inn Gryta-innhold. Vennligst prøv igjen senere.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGrytaItems();
  }, []);

  return (
    <ContentContainer>
      <div className={styles.container}>
        <h1 className={styles.title}>Gryta</h1>
        <p className={styles.description}>
          En samling av kreative bidrag fra Fosskok-fellesskapet. Utforsk, zoom og klikk på bildene for å se detaljer.
        </p>
        
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loader}></div>
            <p>Laster inn Gryta...</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p>{error}</p>
            <button 
              className={styles.retryButton}
              onClick={() => window.location.reload()}
            >
              Prøv igjen
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className={styles.emptyContainer}>
            <p>Ingen innhold i Gryta ennå. Kom tilbake senere!</p>
          </div>
        ) : (
          <GrytaGrid items={items} />
        )}
      </div>
    </ContentContainer>
  );
}
