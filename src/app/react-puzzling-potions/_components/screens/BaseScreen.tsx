import React from 'react';

export interface BaseScreenProps {
  children: React.ReactNode;
}

const BaseScreen: React.FC<BaseScreenProps> = ({ children }) => {
  return <pixiContainer>{children}</pixiContainer>;
};

export default BaseScreen;
