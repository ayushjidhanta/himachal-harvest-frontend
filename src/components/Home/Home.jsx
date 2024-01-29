import styles from "./Home.module.css";
import React from "react";
import Footer from "../../assets/Footer/Footer";
import PrimaryButton from "../../assets/Button/PrimaryButton/PrimaryButton";
import NavBar from "../../assets/NavBar/NavBar";
import CardSlider from "../../assets/CardSlider/CardSlider";

import farmerImage from "../../assets/Images/farmer.png";
import tractorImage from "../../assets/Images/tractor.png";
import earthImage from "../../assets/Images/earth.png";

const scrollDown = () => {
  window.scrollTo({
    top: window.innerHeight,
    behavior: "smooth",
  });
};

function Home() {
  const data = [
    {
      image: earthImage,
      title: "Green Initiatives",
      description:
        "Harvest's new building achieved LEED® Platinum Certification from the United States Green Building Council.",
    },
    {
      image: tractorImage,
      title: "Local Produce",
      description:
        "Traditional farmer's markets or fruit stands give farmers a chance to sell limited quantities of their product and hopefully build a customer base in their area.",
    },
    {
      image: farmerImage,
      title: "100% Natural",
      description:
        "Buying local helps support our family farm neighbors while helping to promote community awareness about where fresh, local produce comes from.",
    },
  ];
  return (
    <>
      <NavBar />
      <main className={styles.home}>
        <div className={styles.content}>
          <h1>Himachal Harvest</h1>
          <h4>Our Farm Our Promise</h4>
          <PrimaryButton event={null} title="Explore" isDisabled={false} />
          <div className={styles.scroll_down}>
            <div className={styles.mouse_wrapper} onClick={scrollDown}>
              <div className={styles.mouse}>
                <div className={styles.scroller}></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <CardSlider />
      <section className={styles.speciality}>
        <div>
          <h1>Speciality & Seasonal</h1>
          <p>
            We bring in produce just for you! Whether the items are in-season or
            uncommon, every week our specialty list changes.
          </p>
        </div>
      </section>
      <section className={styles.section2}>
        <h1>Quality You Can Trust</h1>
        <div className={styles.grid}>
          {data.map((item, index) => (
            <div key={index} className={styles.col}>
              <div className={styles.imageWrapper}>
                <img src={item.image} alt={item.title} />
              </div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Home;
