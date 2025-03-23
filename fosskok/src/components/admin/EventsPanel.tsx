"use client";

import React, { useState } from 'react';
import styles from './AdminPanels.module.css';

// Mock data for initial UI development
const mockEvents = [
  {
    id: "event1",
    title: "Konsert: August Kann",
    date: "2025-04-15T19:00:00",
    location: "Fosskok, Hammerveien 26",
    description: "August Kann presenterer sitt nye album 'Stille vann' i en intim setting.",
    image: "/images/placeholder-event.jpg",
    ticketLink: "https://ticketco.no/example"
  },
  {
    id: "event2",
    title: "Kunstutstilling: Urbane Landskap",
    date: "2025-05-10T18:00:00",
    location: "Fosskok, Hammerveien 26",
    description: "En gruppeutstilling som utforsker forholdet mellom natur og by i samtidskunsten.",
    image: "/images/placeholder-event.jpg",
    ticketLink: ""
  }
];

const EventsPanel: React.FC = () => {
  const [events, setEvents] = useState(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<typeof mockEvents[0] | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state for new/edit event
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    image: '',
    ticketLink: ''
  });
  
  const handleSelectEvent = (event: typeof mockEvents[0]) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      date: event.date.substring(0, 16), // Format for datetime-local input
      location: event.location,
      description: event.description,
      image: event.image || '',
      ticketLink: event.ticketLink || ''
    });
    setIsEditing(false);
  };
  
  const handleNewEvent = () => {
    setSelectedEvent(null);
    setFormData({
      title: '',
      date: '',
      location: 'Fosskok, Hammerveien 26',
      description: '',
      image: '',
      ticketLink: ''
    });
    setIsEditing(true);
  };
  
  const handleEditEvent = () => {
    setIsEditing(true);
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = () => {
    // This would normally connect to an API
    // For now, we'll just update the UI state
    if (isEditing && selectedEvent) {
      // Editing existing event
      setEvents(prev => 
        prev.map(e => 
          e.id === selectedEvent.id 
            ? { ...e, ...formData } 
            : e
        )
      );
    } else if (isEditing) {
      // Adding new event
      const newEvent = {
        id: `event${Date.now()}`,
        ...formData
      };
      setEvents(prev => [...prev, newEvent]);
    }
    
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    if (selectedEvent) {
      // This would normally connect to an API
      // For now, we'll just update the UI state
      setEvents(prev => prev.filter(e => e.id !== selectedEvent.id));
      setSelectedEvent(null);
      setIsEditing(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('no-NO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className={styles.panelContainer}>
      <div className={styles.panelHeader}>
        <h2>Administrer Arrangementer</h2>
        <button 
          className={styles.addButton}
          onClick={handleNewEvent}
        >
          Legg til arrangement
        </button>
      </div>
      
      <div className={styles.panelContent}>
        <div className={styles.itemsList}>
          {events.map(event => (
            <div 
              key={event.id} 
              className={`${styles.itemCard} ${selectedEvent?.id === event.id ? styles.selected : ''}`}
              onClick={() => handleSelectEvent(event)}
            >
              <div className={styles.itemPreview}>
                {event.image ? (
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className={styles.previewImage}
                  />
                ) : (
                  <div className={styles.previewPlaceholder}>
                    <span>Arrangement</span>
                  </div>
                )}
              </div>
              <div className={styles.itemInfo}>
                <h3>{event.title}</h3>
                <p>{formatDate(event.date)}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.itemDetails}>
          {selectedEvent && !isEditing ? (
            <>
              <div className={styles.detailsHeader}>
                <h3>{selectedEvent.title}</h3>
                <div className={styles.detailsActions}>
                  <button 
                    className={styles.editButton}
                    onClick={handleEditEvent}
                  >
                    Rediger
                  </button>
                  <button 
                    className={styles.deleteButton}
                    onClick={handleDelete}
                  >
                    Slett
                  </button>
                </div>
              </div>
              
              <div className={styles.detailsContent}>
                <p><strong>Dato:</strong> {formatDate(selectedEvent.date)}</p>
                <p><strong>Sted:</strong> {selectedEvent.location}</p>
                <p><strong>Beskrivelse:</strong> {selectedEvent.description}</p>
                
                {selectedEvent.ticketLink && (
                  <p>
                    <strong>Billett-link:</strong>{' '}
                    <a href={selectedEvent.ticketLink} target="_blank" rel="noopener noreferrer">
                      {selectedEvent.ticketLink}
                    </a>
                  </p>
                )}
                
                {selectedEvent.image && (
                  <div className={styles.detailsImage}>
                    <img src={selectedEvent.image} alt={selectedEvent.title} />
                  </div>
                )}
              </div>
            </>
          ) : isEditing ? (
            <div className={styles.editForm}>
              <h3>{selectedEvent ? 'Rediger Arrangement' : 'Legg til Arrangement'}</h3>
              
              <div className={styles.formGroup}>
                <label htmlFor="title">Tittel</label>
                <input 
                  type="text" 
                  id="title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="date">Dato og tid</label>
                <input 
                  type="datetime-local" 
                  id="date" 
                  name="date" 
                  value={formData.date} 
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="location">Sted</label>
                <input 
                  type="text" 
                  id="location" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="description">Beskrivelse</label>
                <textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleFormChange}
                  rows={5}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="image">Bilde URL</label>
                <input 
                  type="text" 
                  id="image" 
                  name="image" 
                  value={formData.image} 
                  onChange={handleFormChange}
                  placeholder="f.eks. /images/event.jpg"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="ticketLink">Billett-link (valgfritt)</label>
                <input 
                  type="url" 
                  id="ticketLink" 
                  name="ticketLink" 
                  value={formData.ticketLink} 
                  onChange={handleFormChange}
                  placeholder="https://..."
                />
              </div>
              
              <div className={styles.formActions}>
                <button 
                  className={styles.cancelButton}
                  onClick={() => setIsEditing(false)}
                >
                  Avbryt
                </button>
                <button 
                  className={styles.saveButton}
                  onClick={handleSave}
                >
                  Lagre
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>Velg et arrangement fra listen eller legg til et nytt arrangement</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPanel;
