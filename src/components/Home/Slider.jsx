import React from 'react'
// import "./Slider.css"
export default function Slider() {
  return (
    <div>
      <div id="carouselExampleDark" className="carousel carousel-dark slide" data-bs-ride="carousel">
  <div className="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="2" aria-label="Slide 3"></button>
  </div>
  <div className="carousel-inner">
    <div className="carousel-item active" data-bs-interval="10000">
      <img src="/public-images/Slider-img1.jpeg" className="d-block w-10" alt="First "/>
      <div className="carousel-caption ">
        <h4> Himachal Harvest - Fresh Apples from the Himalayas at Unbeatable Prices</h4>
        {/* <h5>Our apples are carefully handpicked during the peak season of August and September, ensuring the best quality and taste.</h5> */}
      </div>
    </div>
    <div className="carousel-item" data-bs-interval="10000">
      <img src="/public-images/Slider-img2.jpeg" className="d-block w-10" alt="Second "/>
      <div className="carousel-caption " data-bs-interval="10000">
        <h4> By sourcing directly from local farmers, we're able to pass on the savings to our customers</h4>
        {/* <p>making them a healthy and nutritious snack for you and your family.</p> */}
      </div>
    </div>
    <div className="carousel-item">
      <img src="/public-images/Slider-img3.jpeg" className="d-block w-10" alt="Third"/>
      <div className="carousel-caption  ">
        <h4>Supporting Local Farmers and Providing Affordable Fresh Apples</h4>
        {/* <p> Shop with Himachal Harvest today and taste the difference that comes from supporting small-scale agriculture.</p> */}
      </div>
    </div>
  </div>
  
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>

    </div>
  )
}
