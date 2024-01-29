import React from 'react';
// import "./Contact.css";

function Contact() {
  return (
    <div>
            <h5 className="section-head">
              <span className="heading">Contact</span>
              <span className="sub-heading">Get in touch with us</span>
            </h5>
            <div className="contact-content">
              <form action="" className="form contact-form">
                <div className="input-group-wrap">
                  <div className="input-group">
                    <input
                      type="text"
                      className="input"
                      placeholder="Name"
                      required
                    />
                    <span className="bar"> </span>
                  </div>
                  <div className="input-group">
                    <input
                      type="email"
                      className="input"
                      placeholder="E-Mail"
                      required
                    />
                    <span className="bar"> </span>
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      className="input"
                      placeholder="contact"
                      required
                    />
                    <span className="bar"> </span>
                  </div>
                  <div className="input-group">
                    <textarea
                      className="input"
                      cols="30"
                      rows="8"
                      placeholder=" Messages"
                      required
                    ></textarea>
                    <span className="bar"> </span>
                  </div>
                </div>
              </form>
            </div>
          </div>
  )
}

export default Contact
