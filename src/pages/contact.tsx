import React, { useState } from "react";
import { MainLayout } from "@/components";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", text: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const offices = [
    {
      city: "New York Office",
      address: "1418 River Drive, Suite 35 Cottonhall, CA 9622 \n United States",
      email: "sale@bookworm.com",
      phone: "+1 246-345-0695",
    },
    {
      city: "London Office",
      address: "1418 River Drive, Suite 35 Cottonhall, CA 9622 \n United States",
      email: "sale@bookworm.com",
      phone: "+1 246-345-0695",
    },
  ];

  const socialLinks = [
    { icon: "fab fa-instagram", href: "#" },
    { icon: "fab fa-facebook-f", href: "#" },
    { icon: "fab fa-youtube", href: "#" },
    { icon: "fab fa-twitter", href: "#" },
    { icon: "fab fa-pinterest", href: "#" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required.";
    if (!formData.text.trim()) newErrors.text = "Inquiry details are required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSuccess(false);
    } else {
      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "", text: "" });
      setErrors({});
    }
  };

  return (
    <MainLayout>
      <main id="content">
        <div className="py-3 py-lg-7">
          <h6 className="font-weight-medium font-size-7 text-center my-1">Contact Us</h6>
        </div>

        {/* Google Map Embed */}
        <div className="w-100 position-relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835253576489!2d144.95372995111143!3d-37.817327679652266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2sEnvato!5e0!3m2!1sen!2sin!4v1581584770980!5m2!1sen!2sin"
            height="500"
            style={{ border: 0, width: "100%" }}
            allowFullScreen={true}
            loading="lazy"
            title="Envato Map"
          ></iframe>
        </div>

        <div className="container">
          <div className="space-bottom-1 space-bottom-lg-2">
            <div className="pb-4">
              <div className="col-lg-8 mx-auto">
                <div className="bg-white mt-n10 mt-md-n13 pt-5 pt-lg-7 px-3 px-md-5 pl-xl-10 pr-xl-3 position-relative z-index-2">
                  <div className="ml-xl-4">
                    
                    {/* Contact Information */}
                    <div className="mb-4 mb-lg-7">
                      <h6 className="font-weight-medium font-size-10 mb-4 mb-lg-7">Contact Information</h6>
                      <p className="font-weight-medium font-italic text-gray-600">
                        We will answer any questions you may have about our online sales, rights or partnership service right here.
                      </p>
                    </div>

                    {/* Offices Location Info */}
                    <div className="mb-4 mb-lg-8">
                      <div className="row">
                        {offices.map((office, idx) => (
                          <div key={idx} className="col-md-6 mb-4 mb-md-0">
                            <h6 className="font-weight-medium font-size-4 mb-4">{office.city}</h6>
                            <address className="font-size-2 mb-5">
                              <span className="mb-2 font-weight-normal text-dark">
                                {office.address.split("\n").map((line, lIdx) => (
                                  <React.Fragment key={lIdx}>
                                    {line} <br />
                                  </React.Fragment>
                                ))}
                              </span>
                            </address>
                            <div>
                              <a href={`mailto:${office.email}`} className="font-size-2 d-block link-black-100 mb-1">
                                {office.email}
                              </a>
                              <a href={`tel:${office.phone}`} className="font-size-2 d-block link-black-100">
                                {office.phone}
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Social Media Link Icons */}
                    <div className="mb-5 mb-xl-9 pb-xl-1">
                      <h6 className="font-size-4 font-weight-medium mb-3">Social Media</h6>
                      <ul className="list-unstyled mb-0 d-flex gap-3" style={{ paddingLeft: 0 }}>
                        {socialLinks.map((link, index) => (
                          <li key={index} className="btn pl-0" style={{ listStyleType: "none" }}>
                            <a className="link-black-100 font-size-4" href={link.href} aria-label={`Social icon ${index + 1}`}>
                              <span className={link.icon}></span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Get In Touch Contact Form */}
                    <div>
                      <h6 className="font-weight-medium font-size-10 mb-3 pb-xl-1">Get In Touch</h6>
                      
                      {isSuccess && (
                        <div className="alert alert-success rounded-0 mb-4 font-size-2 py-3 px-4" role="alert">
                          <i className="fa fa-check-circle mr-2"></i>
                          Thank you! Your message has been sent successfully. We will get back to you soon.
                        </div>
                      )}

                      <form className="js-validate" onSubmit={handleSubmit} noValidate>
                        <div className="row">
                          {/* Name Input */}
                          <div className="col-sm-6 mb-5">
                            <div className="js-form-message">
                              <label htmlFor="contactName" className="font-weight-medium font-size-2">Name</label>
                              <input
                                id="contactName"
                                type="text"
                                className={`form-control rounded-0 px-4 height-5 ${errors.name ? "is-invalid" : ""}`}
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Jack Wayley"
                              />
                              {errors.name && <div className="invalid-feedback font-size-1 mt-1">{errors.name}</div>}
                            </div>
                          </div>

                          {/* Email Input */}
                          <div className="col-sm-6 mb-5">
                            <div className="js-form-message">
                              <label htmlFor="contactEmail" className="font-weight-medium font-size-2">Email</label>
                              <input
                                id="contactEmail"
                                type="email"
                                className={`form-control rounded-0 px-4 height-5 ${errors.email ? "is-invalid" : ""}`}
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="jackwayley@gmail.com"
                              />
                              {errors.email && <div className="invalid-feedback font-size-1 mt-1">{errors.email}</div>}
                            </div>
                          </div>

                          {/* Subject Input */}
                          <div className="col-sm-12 mb-5">
                            <div className="js-form-message">
                              <label htmlFor="contactSubject" className="font-weight-medium font-size-2">Subject</label>
                              <input
                                id="contactSubject"
                                type="text"
                                className={`form-control rounded-0 px-4 height-5 ${errors.subject ? "is-invalid" : ""}`}
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="I have an inquiry..."
                              />
                              {errors.subject && <div className="invalid-feedback font-size-1 mt-1">{errors.subject}</div>}
                            </div>
                          </div>

                          {/* Details Textarea */}
                          <div className="col-sm-12 mb-5">
                            <div className="js-form-message">
                              <div className="input-group flex-column">
                                <label htmlFor="contactDetails" className="font-weight-medium font-size-2">Details please! Your inquiry helps us assist you better.</label>
                                <textarea
                                  id="contactDetails"
                                  className={`form-control rounded-0 p-3 font-size-2 placeholder-color-3 ${errors.text ? "is-invalid" : ""}`}
                                  rows={6}
                                  name="text"
                                  value={formData.text}
                                  onChange={handleChange}
                                  placeholder="What did you like or dislike? What should other shoppers know before buying?"
                                ></textarea>
                                {errors.text && <div className="invalid-feedback font-size-1 mt-1 d-block">{errors.text}</div>}
                              </div>
                            </div>
                          </div>

                          {/* Submit Button */}
                          <div className="col d-flex justify-content-lg-start">
                            <button
                              type="submit"
                              className="btn btn-wide btn-dark text-white rounded-0 transition-3d-hover height-60 font-weight-medium"
                            >
                              Submit Message
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
