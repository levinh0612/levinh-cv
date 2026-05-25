import React from 'react';
import { CVControls } from '../components/CVControls';
import { CVCard } from '../components/CVCard';

export const CVPage: React.FC = () => (
  <>
    <CVControls />
    <div className="flex-1 flex justify-center">
      <CVCard />
    </div>
  </>
);
