import React from "react";
import Style from "./About.module.css";
import Navbar2 from "../Home/Navbar2";
import Footer from "../../assets/Footer/Footer";
import TeamInstagram from "./TeamInstagram";
export default function About() {
  return (
    <div>
      <Navbar2 />
      <header className={Style.hero}>
        <div className={Style.heroInner}>
          <h1 className={Style.title}>About Himachal Harvest</h1>
          <p className={Style.subtitle}>
            Fresh produce from the hills of Himachal Pradesh — sourced directly from farmers and delivered with care.
          </p>
        </div>
      </header>

      <main className={Style.container}>
        <section className={Style.storyCard}>
          <h2 className={Style.sectionTitle}>Our Story</h2>
          <p>
            At Himachal Harvest, we're passionate about bringing the freshest and most delicious apples from the
            Himalayan region of Himachal Pradesh to your doorstep. We understand the importance of quality, community,
            and sustainability, and we're committed to upholding these values in everything we do.
          </p>

          <p>
            As farmers ourselves, we know firsthand the challenges and rewards of cultivating high-quality produce. We
            work directly with local farmers in Himachal Pradesh to source the best apples during the peak season,
            ensuring that you get the freshest and most flavorful fruits possible.
          </p>

          <p>
            By bypassing middlemen and distributors, we're able to offer our products at unbeatable prices, while also
            supporting local agriculture and the families who depend on it. At Himachal Harvest, we believe that
            everyone should have access to healthy, nutritious food, and we're proud to be part of the solution.
          </p>

          <p>
            Our apples are packed with essential vitamins, minerals, and antioxidants, making them a great choice for a
            healthy snack or ingredient in your favorite recipes. And because they're grown with care and respect for
            the environment, you can feel good about choosing Himachal Harvest for your produce needs.
          </p>

          <p>
            Thank you for considering Himachal Harvest for your fruit and vegetable needs. We're committed to providing
            you with the best possible products and service, and we look forward to serving you soon.
          </p>
        </section>

        <TeamInstagram usernames={["bhupenderhere", "ayushjidhanta"]} />
      </main>
      <Footer />
    </div>
  );
}
