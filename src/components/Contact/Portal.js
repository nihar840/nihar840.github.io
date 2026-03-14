import React from 'react';
import './Portal.css';

export default function Portal() {
  return (
    <div className="portal" aria-hidden="true">
      <div className="portal__ring portal__ring--1" />
      <div className="portal__ring portal__ring--2" />
      <div className="portal__ring portal__ring--3" />
      <div className="portal__core" />
    </div>
  );
}
