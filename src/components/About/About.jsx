import React from "react";
import Style from "./About.module.css";
// import SliderAbout from "../Sliders/SliderAbout";
import Navbar2 from "../Home/Navbar2";
import Footer from "../../assets/Footer/Footer";
import Contact1 from "../Contact1/Contact1";
// import Contact from "../Contact/Contact";
import ImageBox from "../../assets/ImageBox/ImageBox";
export default function About() {
  const aboutPg_Images = [
    {
      url: "https://media.licdn.com/dms/image/D4D03AQGv54Pth4Uhxw/profile-displayphoto-shrink_800_800/0/1675616100963?e=1717632000&v=beta&t=CKciONiuwy7oryjGpLodoBrx6zBep5zD6_60y5IGsBo",
      description: "Full Stack Developer - AI/ML, MERN",
      data: "https://www.linkedin.com/in/bhupenderhere/",
    },
    {
      url: "https://media.licdn.com/dms/image/C4E03AQFdICQfSbjW5w/profile-displayphoto-shrink_800_800/0/1660232032438?e=1717632000&v=beta&t=4RUaa-rEd7A6Vgkaca3w6dkqg9bEmifSF6xzWm5wM-I",
      description: "Full Stack Developer MERN/ Website Owner-Solutions2Coding",
      data: "https://www.linkedin.com/in/abhishek11110/",
    },
    {
      url: "https://media.licdn.com/dms/image/D4D03AQFA-IqrPv8uLQ/profile-displayphoto-shrink_800_800/0/1685939319911?e=1717632000&v=beta&t=KM4a1MbEZfPpLhtH1BvgcLl4lMCLaJWdhQuqobjKnZU",
      description: "Full Stack Developer MEAN",
      data: "https://www.linkedin.com/in/ayush-chauhan-33786322b/",
    },
  ];
  return (
    <div>
      <Navbar2 />
      <div className={Style.title}>
        <h1>About Us</h1>
      </div>

      <div class={Style.container}>
        <div class={Style.main_content}>
          <h2>Our Story</h2>
          <p>
            At Himachal Harvest, we're passionate about bringing the freshest
            and most delicious apples from the Himalayan region of Himachal
            Pradesh to your doorstep. We understand
            the importance of quality, community, and sustainability, and we're
            committed to upholding these values in everything we do.
          </p>

          <p>
            As farmers ourselves, we know firsthand the challenges and rewards
            of cultivating high-quality produce. We work directly with local
            farmers in Himachal Pradesh to source the best apples during the
            peak season, ensuring that you get the freshest and most flavorful
            fruits possible.
          </p>

          <p>
            By bypassing middlemen and distributors, we're able to offer our
            products at unbeatable prices, while also supporting local
            agriculture and the families who depend on it. At Himachal Harvest,
            we believe that everyone should have access to healthy, nutritious
            food, and we're proud to be part of the solution.
          </p>


          <p>
            Our apples are packed with essential vitamins, minerals, and
            antioxidants, making them a great choice for a healthy snack or
            ingredient in your favorite recipes. And because they're grown with
            care and respect for the environment, you can feel good about
            choosing Himachal Harvest for your produce needs.
          </p>

          <p>
            Thank you for considering Himachal Harvest for your fruit and
            vegetable needs. We're committed to providing you with the best
            possible products and service, and we look forward to serving you
            soon.
          </p>
        </div>
      </div>
      <div className={Style.title}>
        <h1>Our Team</h1>
      </div>
      <ImageBox images={aboutPg_Images} />
      <Footer />
    </div>
  );
}
