import { Icons } from "../Icons/Icons";
import React, { useState } from "react";
import styles from "./CardSlider.module.css";

import bananaImage from "../Images/banana.png";
import blackberryImage from "../Images/blackberry.png";
import strawberryImage from "../Images/strawberry.png";
import kiwiImage from "../Images/kiwi.png";

const CardSlider = () => {
  const cards = [
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
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const prevCard = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + cards.length) % cards.length
    );
  };

  return (
    <section className={styles.slider}>
      <button onClick={prevCard} className={styles.prev_button}>
        {Icons.leftArrow}
      </button>
      <div className={styles.cards_container}>
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${styles.card} ${
              index === currentIndex ? styles.active : ""
            }`}
          >
            <div>
              <h2>{card.title}</h2>
              <p>{card.description}</p>
            </div>
            <div className={styles.imageWrapper}>
              <img src={card.image} alt={card.title} />
            </div>
          </div>
        ))}
      </div>
      <button onClick={nextCard} className={styles.next_button}>
        {Icons.rightArrow}
      </button>
    </section>
  );
};

export default CardSlider;
