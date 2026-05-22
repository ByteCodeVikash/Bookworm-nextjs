import React from "react";
import Image from "next/image";
import { MainLayout } from "@/components";

export default function AboutPage() {
  const teamMembers = [
    { name: "Anna Baranov", role: "Client Care" },
    { name: "Thomas Snow", role: "CEO/Founder" },
    { name: "Andre Kowalsy", role: "Support Boss" },
    { name: "Pamela Doe", role: "Delivery Driver" },
    { name: "Susan McCain", role: "Packaging Girl" },
    { name: "Andre Kowalsy", role: "Support Boss" },
    { name: "Pamela Doe", role: "Delivery Driver" },
    { name: "Thomas Snow", role: "CEO/Founder" },
  ];

  const partners = [
    "/assets/img/150x32/img1.png",
    "/assets/img/150x32/img2.png",
    "/assets/img/150x32/img3.png",
    "/assets/img/150x32/img4.png",
    "/assets/img/150x32/img6.png",
    "/assets/img/150x32/img5.png",
  ];

  return (
    <MainLayout>
      <main id="content">
        <div className="mb-5 space-bottom-lg-3">
          <div className="py-3 py-lg-7">
            <h6 className="font-weight-medium font-size-7 text-center my-1">About Us</h6>
          </div>
          
          <div className="position-relative w-100" style={{ height: "650px" }}>
            <Image
              className="img-fluid object-cover"
              src="https://placehold.co/1920x650"
              alt="Welcome to Bookworm banner"
              fill
              priority
              sizes="100vw"
            />
          </div>

          <div className="container">
            {/* Welcome message section */}
            <div className="mb-lg-8">
              <div className="col-lg-9 mx-auto">
                <div className="bg-white mt-n10 mt-md-n13 pt-5 pt-lg-7 px-3 px-md-5 pl-xl-10 pr-xl-4 position-relative z-index-2">
                  <div className="mb-4 mb-lg-7 ml-xl-4">
                    <h6 className="font-weight-medium font-size-10 mb-4 mb-lg-7">Welcome to Bookworm</h6>
                    <p className="font-weight-medium font-italic text-gray-700">
                      “ Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model search for eolved over sometimes by accident, sometimes on purpose ”
                    </p>
                  </div>
                  <div className="mb-4 pb-xl-1 ml-xl-4">
                    <h6 className="font-weight-medium font-size-4 mb-4">What we really do?</h6>
                    <p className="font-size-2 text-gray-600">
                      Mauris tempus erat laoreet turpis lobortis, eu tincidunt erat fermentum. Aliquam non tincidunt urna. Integer tincidunt nec nisl vitae ullamcorper. Proin sed ultrices erat. Praesent varius ultrices massa at faucibus. Aenean dignissim, orci sed faucibus pharetra, dui mi dignissim tortor, sit amet condimentum mi ligula sit amet augue. Pellentesque vitae eros eget enim mollis placerat. Aliquam non tincidunt urna. Integer tincidunt nec nisl vitae ullamcorper. Proin sed ultrices erat. Praesent varius ultrices massa at faucibus. Aenean dignissim, orci sed faucibus pharetra, dui mi dignissim tortor, sit amet condimentum mi ligula sit amet augue. Pellentesque vitae eros eget enim mollis placerat.
                    </p>
                  </div>
                  <div className="ml-xl-4">
                    <div className="row">
                      <div className="col-md-6 mb-4 mb-md-0">
                        <h6 className="font-weight-medium font-size-4">Our Vision</h6>
                        <p className="font-size-2 text-gray-600">
                          Pellentesque sodales augue eget ultricies ultricies. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur sagittis ultrices condimentum.
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h6 className="font-weight-medium font-size-4">Our Vision</h6>
                        <p className="font-size-2 text-gray-600">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam quis diam erat. Duis velit lectus, posuere a blandit metus mauris, tristique quis sapien eu, rutrum vulputate enim.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Facts statistics */}
            <div className="mb-5 mb-lg-7">
              <div className="d-md-flex align-items-center justify-content-between px-xl-10">
                <div className="text-center mb-3 mb-md-0">
                  <div className="font-size-12 font-weight-medium ml-lg-2">45M</div>
                  <span className="font-size-4 text-gray-600">Active Readers</span>
                </div>
                <div className="text-center mb-3 mb-md-0">
                  <div className="font-size-12 font-weight-medium ml-2">+6k</div>
                  <span className="font-size-4 text-gray-600">Total Pages</span>
                </div>
                <div className="text-center mb-3 mb-md-0">
                  <div className="font-size-12 font-weight-medium">30.6M</div>
                  <span className="font-size-4 text-gray-600">Buyers Active</span>
                </div>
                <div className="text-center mb-0">
                  <div className="font-size-12 font-weight-medium ml-2">283</div>
                  <span className="font-size-4 text-gray-600">Cup Of Coffee</span>
                </div>
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="mb-5 mb-lg-10">
              <h6 className="font-weight-medium font-size-7 mb-5 mb-lg-6">Why We</h6>
              <ul className="list-unstyled my-0 list-features row d-md-flex" style={{ paddingLeft: 0 }}>
                <li className="list-feature mb-5 mb-lg-0 col-md-6 col-lg-3" style={{ listStyleType: "none" }}>
                  <div className="media flex-column align-items-center align-items-md-start pr-xl-3">
                    <div className="feature__icon font-size-14 text-primary text-lh-xs mb-3">
                      <i className="glyph-icon flaticon-delivery"></i>
                    </div>
                    <div className="media-body text-center text-md-left">
                      <h4 className="feature__title font-size-3 text-dark">Free Delivery</h4>
                      <p className="feature__subtitle m-0 text-dark">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu.</p>
                    </div>
                  </div>
                </li>
                <li className="list-feature mb-5 mb-lg-0 col-md-6 col-lg-3" style={{ listStyleType: "none" }}>
                  <div className="media flex-column align-items-center align-items-md-start pr-xl-3">
                    <div className="feature__icon font-size-14 text-primary text-lh-xs mb-3">
                      <i className="glyph-icon flaticon-credit"></i>
                    </div>
                    <div className="media-body text-center text-md-left">
                      <h4 className="feature__title font-size-3 text-dark">Secure Payment</h4>
                      <p className="feature__subtitle m-0 text-dark">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu.</p>
                    </div>
                  </div>
                </li>
                <li className="list-feature mb-5 mb-md-0 col-md-6 col-lg-3" style={{ listStyleType: "none" }}>
                  <div className="media flex-column align-items-center align-items-md-start pr-xl-3">
                    <div className="feature__icon font-size-14 text-primary text-lh-xs mb-3">
                      <i className="glyph-icon flaticon-warranty"></i>
                    </div>
                    <div className="media-body text-center text-md-left">
                      <h4 className="feature__title font-size-3 text-dark">Money Back Guarantee</h4>
                      <p className="feature__subtitle m-0 text-dark">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu.</p>
                    </div>
                  </div>
                </li>
                <li className="list-feature mb-5 mb-md-0 col-md-6 col-lg-3" style={{ listStyleType: "none" }}>
                  <div className="media flex-column align-items-center align-items-md-start pr-xl-3">
                    <div className="feature__icon font-size-14 text-primary text-lh-xs mb-3">
                      <i className="glyph-icon flaticon-help"></i>
                    </div>
                    <div className="media-body text-center text-md-left">
                      <h4 className="feature__title font-size-3 text-dark">24/7 Support</h4>
                      <p className="feature__subtitle m-0 text-dark">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu.</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Our Team Slider / List */}
            <div className="mb-10 pb-md-6 pb-lg-10">
              <h6 className="font-weight-medium font-size-7 mb-5">Our Team</h6>
              <div 
                className="js-slick-carousel u-slick" 
                data-pagi-classes="text-center u-slick__pagination mt-md-8 mt-4 position-absolute right-0 left-0"
                data-slides-show="5"
                data-responsive='[{
                   "breakpoint": 992,
                   "settings": {
                     "slidesToShow": 2
                   }
                }, {
                   "breakpoint": 768,
                   "settings": {
                     "slidesToShow": 1
                   }
                }, {
                   "breakpoint": 554,
                   "settings": {
                     "slidesToShow": 1
                   }
                }]'
              >
                {teamMembers.map((member, index) => (
                  <div key={index} className="product__inner overflow-hidden">
                    <div className="woocommerce-LoopProduct-link woocommerce-loop-product__link d-block position-relative">
                      <div className="woocommerce-loop-product__thumbnail border pt-5 mb-3 text-center">
                        <a href="#" className="d-block">
                          <Image 
                            src="https://placehold.co/180x320" 
                            className="img-fluid mx-auto d-block attachment-shop_catalog size-shop_catalog wp-post-image" 
                            alt={member.name}
                            width={180}
                            height={320}
                          />
                        </a>
                      </div>

                      <div className="woocommerce-loop-product__body product__body">
                        <h6 className="font-weight-regular mb-1">{member.name}</h6>
                        <span className="font-size-2 text-secondary-gray-700">{member.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Company Partners */}
            <div>
              <h6 className="font-weight-medium font-size-7 mb-4 mb-lg-9">Company Partners</h6>
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-4">
                {partners.map((partner, index) => (
                  <div key={index} className="text-center mb-5 mb-lg-0 col-6 col-sm-4 col-md-2 px-2">
                    <Image 
                      className="img-fluid filter-grayscale opacity-hover" 
                      src={partner} 
                      alt={`Partner logo ${index + 1}`}
                      width={150}
                      height={32}
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </MainLayout>
  );
}
