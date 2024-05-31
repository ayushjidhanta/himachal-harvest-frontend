import React, { useState, useEffect } from "react";
import Style from "./ImageBox.module.css";
import Button from "../Button/PrimaryButton/PrimaryButton";
function ImageBox({ images }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [images.length]);

  const handleLinkedinButtonClick = () => {
    const linkedinUrl = images[currentImageIndex].data;
    window.open(linkedinUrl, "_blank");
  };

  return (
    <div className={Style.image_box}>
      <img src={images[currentImageIndex].url} alt="Image" />
      <div className={Style.description}>
        {images[currentImageIndex].description}
        <div>
          <div className={Style.button}>
            <Button
              event={handleLinkedinButtonClick}
              title="Contact In Linkedin"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageBox;
