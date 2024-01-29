import React from "react";
// import "./About.css";
// import SliderAbout from "../Sliders/SliderAbout";
import Navbar2 from "../Home/Navbar2";
import Contact1 from "../Contact1/Contact1";
// import Contact from "../Contact/Contact";
export default function About() {
  return (
    <div>
      <Navbar2 />
      <div className="wraper">
        <h1>h</h1>
      </div>
      {/* <SliderAbout /> */}

      <div className="pageAbout">
        <div className="inside">
          <h1 Style=" color:black; font-family:monospace; font-size: 3em ;"><strong>About Us</strong></h1>

          {/* <img src="/SliderExp-image/Slider-image5.jpg" className="img-fluid" alt="..."></img> */}
          <div className="card bg-dark text-white">
            <img
              src="About-Images/SliderAbout-img2.jpg"
              className="card-img"
              alt="..."
            />
            <div className="card-img-overlay">
              <h5 className="card-title">
               <strong> Himachal Harvest: Bringing Fresh and Nutritious Produce to Your
                Doorstep</strong>
              </h5>
              <h6 className="card-text" Style="letter-spacing:0.1rem;">
                {" "}
                It emphasizes the core product that the website sells, which is
                apples grown in the Himalayan region of Himachal Pradesh. By
                using the phrase "the best apples," the title suggests that
                Himachal Harvest is committed to providing high-quality produce
                to its customers. Overall, the title is concise and
                straightforward, yet descriptive enough to entice visitors to
                learn more about the brand and its products.
              </h6>
              <p className="card-text">Last updated 3 mins ago</p>
            </div>
          </div>
          <div className="Content-Writing">
            <h1> Now the Breif About Us</h1>
            <h4>
              <strong>What we are?: </strong>
              At Himachal Harvest, we're passionate about bringing the freshest
              and most delicious apples from the Himalayan region of Himachal
              Pradesh to your doorstep. As a family-owned business, we
              understand the importance of quality, community, and
              sustainability, and we're committed to upholding these values in
              everything we do. As farmers ourselves, we know firsthand the
              challenges and rewards of cultivating high-quality produce. We
              work directly with local farmers in Himachal Pradesh to source the
              best apples during the peak season, ensuring that you get the
              freshest and most flavorful fruits possible. By bypassing
              middlemen and distributors, we're able to offer our products at
              unbeatable prices, while also supporting local agriculture and the
              families who depend on it. At Himachal Harvest, we believe that
              everyone should have access to healthy, nutritious food, and we're
              proud to be part of the solution. Our apples are packed with
              essential vitamins, minerals, and antioxidants, making them a
              great choice for a healthy snack or ingredient in your favorite
              recipes. And because they're grown with care and respect for the
              environment, you can feel good about choosing Himachal Harvest for
              your produce needs. Thank you for considering Himachal Harvest for
              your fruit and vegetable needs. We're committed to providing you
              with the best possible products and service, and we look forward
              to serving you soon.
            </h4>
            <h4>
              At Himachal Harvest, we're committed to providing you with the
              highest quality products and service, while also making a positive
              impact on the environment and local community. Our apples are
              grown using sustainable, eco-friendly practices that prioritize
              soil health, water conservation, and biodiversity. And with our
              fast and reliable delivery, you can enjoy the fresh taste of the
              Himalayas from the comfort of your own home. Thank you for
              choosing Himachal Harvest. We're honored to be your source for
              fresh, affordable, and sustainable produce, and we look forward to
              serving you for years to come.
            </h4>
          </div>
          <Contact1 />
          {/* <Contact /> */}
        </div>
      </div>
    </div>
  );
}
