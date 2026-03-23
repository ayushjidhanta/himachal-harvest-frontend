import { Icons } from "../Icons/Icons";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./CardSlider.module.css";

import bananaImage from "../Images/banana.png";
import blackberryImage from "../Images/blackberry.png";
import strawberryImage from "../Images/strawberry.png";
import kiwiImage from "../Images/kiwi.png";

const CardSlider = () => {
  const cards = useMemo(
    () => [
      {
        title: "Banana",
        description:
          "Bananas are a popular tropical fruit known for their distinctive yellow color and sweet taste. They are botanically classified as berries and grow in clusters on large herbaceous plants. Bananas are rich in essential nutrients such as potassium, vitamin C, and dietary fiber, making them a convenient and healthy snack option for athletes and individuals of all ages.",
        image: bananaImage,
      },
      {
        title: "Blackberry",
        description:
          "Strawberries are vibrant red fruits with a sweet and slightly tart flavor. They are a member of the rose family and are known for their juicy texture and small seeds that cover their surface. Packed with antioxidants, vitamins, and dietary fiber, strawberries are not only delicious but also offer numerous health benefits, including promoting heart health and boosting the immune system.",
        image: blackberryImage,
      },
      {
        title: "Strawberry",
        description:
          "Strawberries are vibrant red fruits with a sweet and slightly tart flavor. They are a member of the rose family and are known for their juicy texture and small seeds that cover their surface. Packed with antioxidants, vitamins, and dietary fiber, strawberries are not only delicious but also offer numerous health benefits, including promoting heart health and boosting the immune system.",
        image: strawberryImage,
      },
      {
        title: "Kiwi",
        description:
          "Strawberries are vibrant red fruits with a sweet and slightly tart flavor. They are a member of the rose family and are known for their juicy texture and small seeds that cover their surface. Packed with antioxidants, vitamins, and dietary fiber, strawberries are not only delicious but also offer numerous health benefits, including promoting heart health and boosting the immune system.",
        image: kiwiImage,
      },
    ],
    []
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const prevCard = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + cards.length) % cards.length
    );
  };

  useEffect(() => {
    if (isPaused) return;
    const id = window.setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, [cards.length, isPaused]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevCard();
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      nextCard();
    }
  };

  const handleBlurCapture = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setIsPaused(false);
  };

  return (
    <section
      id="home-card-slider"
      className={styles.slider}
      aria-label="Featured produce slider"
    >
      <div className={styles.shell}>
        <div className={styles.topRow}>
          <div className={styles.heading}>
            <h2>Fresh Picks</h2>
            <p>Swipe through seasonal highlights from Himachal.</p>
          </div>
          <div className={styles.controls}>
            <button
              type="button"
              onClick={prevCard}
              className={styles.navButton}
              aria-label="Previous slide"
            >
              {Icons.leftArrow}
            </button>
            <button
              type="button"
              onClick={nextCard}
              className={styles.navButton}
              aria-label="Next slide"
            >
              {Icons.rightArrow}
            </button>
          </div>
        </div>

        <div
          className={styles.viewport}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={handleBlurCapture}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="group"
          aria-roledescription="carousel"
          aria-label={`Slide ${currentIndex + 1} of ${cards.length}`}
        >
          <div
            className={styles.track}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {cards.map((card, index) => (
              <article
                key={card.title}
                className={`${styles.card} ${
                  index === currentIndex ? styles.current : ""
                }`}
                aria-hidden={index !== currentIndex}
              >
                <div className={styles.cardBody}>
                  <span className={styles.badge}>Seasonal</span>
                  <h3 className={styles.title}>{card.title}</h3>
                  <p className={styles.description}>{card.description}</p>
                </div>
                <div className={styles.imageWrapper} aria-hidden="true">
                  <img src={card.image} alt="" loading="lazy" />
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.dots} aria-label="Choose a slide">
          {cards.map((card, index) => (
            <button
              key={card.title}
              type="button"
              className={`${styles.dot} ${
                index === currentIndex ? styles.dotActive : ""
              }`}
              aria-label={`Go to ${card.title}`}
              aria-current={index === currentIndex ? "true" : "false"}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardSlider;
