"use client";

import React, { useState, useEffect, useRef } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import GridCell from './GridCell';
import styles from './GrytaGrid.module.css';

interface GrytaItem {
  id: string;
  image_url: string;
  thumbnail_url: string;
  description: string;
  member_id?: string;
  member_name?: string;
  created_at: string;
}

interface GrytaGridProps {
  items: GrytaItem[];
}

interface TransformControls {
  zoomIn: (step?: number) => void;
  zoomOut: (step?: number) => void;
  resetTransform: () => void;
}

const GrytaGrid: React.FC<GrytaGridProps> = ({ items }) => {
  const [focusedItem, setFocusedItem] = useState<GrytaItem | null>(null);
  const [gridDimensions, setGridDimensions] = useState({ rows: 0, cols: 0 });
  const [cellSize, setCellSize] = useState(150); // Default cell size
  const gridRef = useRef<HTMLDivElement>(null);
  const transformComponentRef = useRef(null);

  // Calculate grid dimensions based on number of items
  useEffect(() => {
    if (items.length === 0) return;
    
    // Calculate the optimal grid dimensions based on the number of items
    // We want a roughly square grid, so we take the square root of the number of items
    const itemCount = items.length;
    const cols = Math.ceil(Math.sqrt(itemCount));
    const rows = Math.ceil(itemCount / cols);
    
    setGridDimensions({ rows, cols });
  }, [items]);

  // Adjust cell size based on screen width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 600) {
        setCellSize(100);
      } else if (width < 900) {
        setCellSize(120);
      } else if (width < 1200) {
        setCellSize(150);
      } else {
        setCellSize(180);
      }
    };
    
    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle cell click to focus on an item
  const handleCellClick = (item: GrytaItem) => {
    setFocusedItem(item);
  };

  // Close the focused item detail view
  const handleCloseFocus = () => {
    setFocusedItem(null);
  };

  // Generate a position for each cell in the grid
  const getGridPosition = (index: number) => {
    const { cols } = gridDimensions;
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    return { row, col };
  };

  return (
    <div className={styles.gridContainer} ref={gridRef}>
      <TransformWrapper
        ref={transformComponentRef}
        initialScale={1}
        minScale={0.5}
        maxScale={3}
        centerOnInit={true}
        wheel={{ step: 0.05 }}
      >
        {({ zoomIn, zoomOut, resetTransform }: TransformControls) => (
          <>
            <div className={styles.controls}>
              <button onClick={() => zoomIn(0.2)} className={styles.controlButton}>
                +
              </button>
              <button onClick={() => zoomOut(0.2)} className={styles.controlButton}>
                -
              </button>
              <button onClick={() => resetTransform()} className={styles.controlButton}>
                Reset
              </button>
            </div>
            
            <TransformComponent
              wrapperStyle={{
                width: '100%',
                height: '600px',
                maxWidth: '100%',
                overflow: 'hidden',
              }}
            >
              <div 
                className={styles.grid}
                style={{
                  gridTemplateColumns: `repeat(${gridDimensions.cols}, ${cellSize}px)`,
                  gridTemplateRows: `repeat(${gridDimensions.rows}, ${cellSize}px)`,
                  width: `${gridDimensions.cols * cellSize}px`,
                  height: `${gridDimensions.rows * cellSize}px`,
                }}
              >
                {items.map((item, index) => {
                  const { row, col } = getGridPosition(index);
                  return (
                    <GridCell
                      key={item.id}
                      item={item}
                      onClick={() => handleCellClick(item)}
                      cellSize={cellSize}
                      row={row}
                      col={col}
                    />
                  );
                })}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
      
      {focusedItem && (
        <div className={styles.focusedItemOverlay} onClick={handleCloseFocus}>
          <div className={styles.focusedItemContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={handleCloseFocus}>
              ×
            </button>
            
            <div className={styles.focusedItemImage}>
              <img src={focusedItem.image_url} alt={focusedItem.description} />
            </div>
            
            <div className={styles.focusedItemInfo}>
              <p className={styles.focusedItemDescription}>{focusedItem.description}</p>
              <p className={styles.focusedItemMeta}>
                {focusedItem.member_name && (
                  <span className={styles.focusedItemMember}>
                    Av: {focusedItem.member_name}
                  </span>
                )}
                <span className={styles.focusedItemDate}>
                  {new Date(focusedItem.created_at).toLocaleDateString('nb-NO')}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrytaGrid;
