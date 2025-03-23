"use client";

import React, { useState, useEffect } from 'react';
import styles from './AdminPanels.module.css';

// Interface for Event type
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  createdAt?: string;
  updatedAt?: string;
}

const EventsPanel: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state for new/edit event
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: ''
  });
  
  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/events', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        
        // Format dates for form input
        const formattedEvents = data.map((event: Event) => ({
          ...event,
          date: new Date(event.date).toISOString().split('T')[0]
        }));
        
        setEvents(formattedEvents);
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location
    });
    setIsEditing(false);
  };
  
  const handleNewEvent = () => {
    setSelectedEvent(null);
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      title: '',
      description: '',
      date: today,
      location: 'Fosskok, Oslo'
    });
    setIsEditing(true);
  };
  
  const handleEditEvent = () => {
    setIsEditing(true);
  };
  
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      if (isEditing && selectedEvent) {
        // Update existing event
        const response = await fetch(`/api/events/${selectedEvent.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update event');
        }
        
        const updatedEvent = await response.json();
        
        // Format date for display
        const formattedEvent = {
          ...updatedEvent,
          date: new Date(updatedEvent.date).toISOString().split('T')[0]
        };
        
        // Update local state
        setEvents(prev => 
          prev.map(e => 
            e.id === selectedEvent.id ? formattedEvent : e
          )
        );
        
        setSelectedEvent(formattedEvent);
      } else if (isEditing) {
        // Create new event
        const response = await fetch('/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create event');
        }
        
        const newEvent = await response.json();
        
        // Format date for display
        const formattedEvent = {
          ...newEvent,
          date: new Date(newEvent.date).toISOString().split('T')[0]
        };
        
        // Update local state
        setEvents(prev => [...prev, formattedEvent]);
        setSelectedEvent(formattedEvent);
      }
      
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Error saving event:', err);
      setError('Failed to save event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!selectedEvent) return;
    
    if (!confirm(`Er du sikker på at du vil slette "${selectedEvent.title}"?`)) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/events/${selectedEvent.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete event');
      }
      
      // Update local state
      setEvents(prev => prev.filter(e => e.id !== selectedEvent.id));
      setSelectedEvent(null);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('no-NO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };
  
  return (
    <div className={styles.panelContainer}>
      <div className={styles.panelHeader}>
        <h2>Administrer Arrangementer</h2>
        <button 
          className={styles.addButton}
          onClick={handleNewEvent}
          disabled={isLoading}
        >
          Legg til arrangement
        </button>
      </div>
      
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      
      <div className={styles.panelContent}>
        <div className={styles.itemsList}>
          {isLoading && events.length === 0 ? (
            <div className={styles.loadingState}>Laster arrangementer...</div>
          ) : events.length === 0 ? (
            <div className={styles.emptyState}>Ingen arrangementer funnet</div>
          ) : (
            events.map(event => (
              <div 
                key={event.id} 
                className={`${styles.itemCard} ${selectedEvent?.id === event.id ? styles.selected : ''}`}
                onClick={() => handleSelectEvent(event)}
              >
                <div className={styles.itemPreview}>
                  <div className={styles.datePreview}>
                    <span className={styles.dateDay}>
                      {new Date(event.date).getDate()}
                    </span>
                    <span className={styles.dateMonth}>
                      {new Date(event.date).toLocaleDateString('no-NO', { month: 'short' })}
                    </span>
                  </div>
                </div>
                <div className={styles.itemInfo}>
                  <h3>{event.title}</h3>
                  <p>{event.location}</p>
                </div>
              </div>
            ))
          )}
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
                    disabled={isLoading}
                  >
                    Rediger
                  </button>
                  <button 
                    className={styles.deleteButton}
                    onClick={handleDelete}
                    disabled={isLoading}
                  >
                    Slett
                  </button>
                </div>
              </div>
              
              <div className={styles.detailsContent}>
                <p><strong>Dato:</strong> {formatDate(selectedEvent.date)}</p>
                <p><strong>Sted:</strong> {selectedEvent.location}</p>
                <div className={styles.eventDescription}>
                  <strong>Beskrivelse:</strong>
                  <div>{selectedEvent.description}</div>
                </div>
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
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="date">Dato</label>
                <input 
                  type="date" 
                  id="date" 
                  name="date" 
                  value={formData.date} 
                  onChange={handleFormChange}
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className={styles.formActions}>
                <button 
                  className={styles.cancelButton}
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  Avbryt
                </button>
                <button 
                  className={styles.saveButton}
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? 'Lagrer...' : 'Lagre'}
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
