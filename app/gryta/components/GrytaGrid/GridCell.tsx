"use client";

import React from 'react';
import Image from 'next/image';
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

interface GridCellProps {
  item: GrytaItem;
  onClick: () => void;
  cellSize: number;
  row: number;
  col: number;
}

const GridCell: React.FC<GridCellProps> = ({ item, onClick, cellSize, row, col }) => {
  return (
    <div 
      className={styles.gridCell}
      onClick={onClick}
      style={{
        width: `${cellSize}px`,
        height: `${cellSize}px`,
        gridRow: row + 1,
        gridColumn: col + 1,
      }}
    >
      <div className={styles.cellContent}>
        <Image
          src={item.thumbnail_url}
          alt={item.description || 'Gryta item'}
          width={cellSize}
          height={cellSize}
          className={styles.cellImage}
          priority={row < 2 && col < 2} // Prioritize loading for visible cells
        />
        
        <div className={styles.cellOverlay}>
          <div className={styles.cellInfo}>
            {item.member_name && (
              <span className={styles.cellMember}>{item.member_name}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridCell;
