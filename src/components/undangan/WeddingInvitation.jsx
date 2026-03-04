import React, { useState } from "react";
import WelcomeCover from "./WelcomeCover";
import LoveStory from "./LoveStory";
import CoupleProfile from "./CoupleProfile";
import EventSchedule from "./EventSchedule";
import PhotoGallery from "./PhotoGallery";
import Closing from "./Closing";

const WeddingInvitation = ({ invitation }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenInvitation = () => {
        setIsOpen(true);
    };

    return (
        <div className="wedding-invitation">
            {!isOpen ? (
                <WelcomeCover onOpen={handleOpenInvitation} invitation={invitation} />
            ) : (
                <div className="invitation-content">
                    <LoveStory invitation={invitation} />
                    <CoupleProfile invitation={invitation} />
                    <EventSchedule invitation={invitation} />
                    <PhotoGallery invitation={invitation} />
                    <Closing invitation={invitation} />
                </div>
            )}
        </div>
    );
};

export default WeddingInvitation;
