import React, { useState, useEffect } from 'react';
import WelcomeCover from './WelcomeCover';
import LoveStory from './LoveStory';
import CoupleProfile from './CoupleProfile';
import EventSchedule from './EventSchedule';
import PhotoGallery from './PhotoGallery';
import Closing from './Closing';

const WeddingInvitation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenInvitation = () => {
    setIsOpen(true);
  };

  return (
    <div className="wedding-invitation">
      {!isOpen ? (
        <WelcomeCover onOpen={handleOpenInvitation} />
      ) : (
        <div className="invitation-content">
          <LoveStory />
          <CoupleProfile />
          <EventSchedule />
          <PhotoGallery />
          <Closing />
        </div>
      )}
    </div>
  );
};

export default WeddingInvitation;