import React, { useState } from "react";
import { MainLayout } from "@/components";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [activeFaq, setActiveFaq] = useState<string | null>("basicsCollapseOne");

  const shoppingFaqs: FAQItem[] = [
    {
      id: "basicsCollapseOne",
      question: "Delivery charges for orders from the Online Shop?",
      answer: "A placerat ac vestibulum integer vehicula suspendisse nostra aptent fermentum tempor a magna erat ligula parturient curae sem conubia vestibulum ac inceptos sodales condimentum cursus nunc mi consectetur condimentum. Tristique parturient nulla ullamcorper at ullamcorper non orci iaculis neque augue.",
    },
    {
      id: "basicsCollapseTwo",
      question: "How long will delivery take?",
      answer: "A placerat ac vestibulum integer vehicula suspendisse nostra aptent fermentum tempor a magna erat ligula parturient curae sem conubia vestibulum ac inceptos sodales condimentum cursus nunc mi consectetur condimentum. Tristique parturient nulla ullamcorper at ullamcorper non orci iaculis neque augue.",
    },
    {
      id: "basicsCollapseThree",
      question: "Do I receive an invoice for my order?",
      answer: "A placerat ac vestibulum integer vehicula suspendisse nostra aptent fermentum tempor a magna erat ligula parturient curae sem conubia vestibulum ac inceptos sodales condimentum cursus nunc mi consectetur condimentum. Tristique parturient nulla ullamcorper at ullamcorper non orci iaculis neque augue.",
    },
    {
      id: "basicsCollapseFour",
      question: "Tellus ridicdiam eleifend id ullamcorper?",
      answer: "A placerat ac vestibulum integer vehicula suspendisse nostra aptent fermentum tempor a magna erat ligula parturient curae sem conubia vestibulum ac inceptos sodales condimentum cursus nunc mi consectetur condimentum. Tristique parturient nulla ullamcorper at ullamcorper non orci iaculis neque augue.",
    },
  ];

  const paymentFaqs: FAQItem[] = [
    {
      id: "basicsCollapseFive",
      question: "When the order payment is taken of my bank account?",
      answer: "A placerat ac vestibulum integer vehicula suspendisse nostra aptent fermentum tempor a magna erat ligula parturient curae sem conubia vestibulum ac inceptos sodales condimentum cursus nunc mi consectetur condimentum. Tristique parturient nulla ullamcorper at ullamcorper non orci iaculis neque augue.",
    },
    {
      id: "basicsCollapseSix",
      question: "What is wishlist?",
      answer: "A placerat ac vestibulum integer vehicula suspendisse nostra aptent fermentum tempor a magna erat ligula parturient curae sem conubia vestibulum ac inceptos sodales condimentum cursus nunc mi consectetur condimentum. Tristique parturient nulla ullamcorper at ullamcorper non orci iaculis neque augue.",
    },
    {
      id: "basicsCollapseSeven",
      question: "What should I do if I receive a damaged or wrong product?",
      answer: "A placerat ac vestibulum integer vehicula suspendisse nostra aptent fermentum tempor a magna erat ligula parturient curae sem conubia vestibulum ac inceptos sodales condimentum cursus nunc mi consectetur condimentum. Tristique parturient nulla ullamcorper at ullamcorper non orci iaculis neque augue.",
    },
    {
      id: "basicsCollapseEight",
      question: "Can I change or cancel my order?",
      answer: "A placerat ac vestibulum integer vehicula suspendisse nostra aptent fermentum tempor a magna erat ligula parturient curae sem conubia vestibulum ac inceptos sodales condimentum cursus nunc mi consectetur condimentum. Tristique parturient nulla ullamcorper at ullamcorper non orci iaculis neque augue.",
    },
    {
      id: "basicsCollapseNine",
      question: "What is \"package tracking\" in my orders?",
      answer: "A placerat ac vestibulum integer vehicula suspendisse nostra aptent fermentum tempor a magna erat ligula parturient curae sem conubia vestibulum ac inceptos sodales condimentum cursus nunc mi consectetur condimentum. Tristique parturient nulla ullamcorper at ullamcorper non orci iaculis neque augue.",
    },
  ];

  const toggleFaq = (id: string) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  const renderFaqSection = (title: string, items: FAQItem[]) => {
    return (
      <div className="mb-8 pb-1">
        <h6 className="font-weight-medium font-size-4 mb-5">{title}</h6>
        <div className="accordion">
          {items.map((item) => {
            const isOpen = activeFaq === item.id;
            return (
              <div key={item.id} className="card rounded-0 border-0">
                <div className="card-header card-collapse p-0 bg-transparent border-bottom-0">
                  <button
                    type="button"
                    className="collapse-link btn btn-block d-flex align-items-center justify-content-between card-btn py-3 px-0 px-md-4 border rounded-0 shadow-none mt-minus-1"
                    onClick={() => toggleFaq(item.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="mx-md-1 text-left">{item.question}</span>

                    {/* Collapse state symbols */}
                    {isOpen ? (
                      <svg className="minus" xmlns="http://www.w3.org/2000/svg" width="15px" height="2px">
                        <path fillRule="evenodd" fill="rgb(22, 22, 25)" d="M0.000,-0.000 L15.000,-0.000 L15.000,2.000 L0.000,2.000 L0.000,-0.000 Z" />
                      </svg>
                    ) : (
                      <svg className="plus" xmlns="http://www.w3.org/2000/svg" width="15px" height="15px">
                        <path fillRule="evenodd" fill="rgb(22, 22, 25)" d="M15.000,8.000 L9.000,8.000 L9.000,15.000 L7.000,15.000 L7.000,8.000 L0.000,8.000 L0.000,6.000 L7.000,6.000 L7.000,-0.000 L9.000,-0.000 L9.000,6.000 L15.000,6.000 L15.000,8.000 Z" />
                      </svg>
                    )}
                  </button>
                </div>
                
                <div 
                  className={`collapse ${isOpen ? "show" : ""}`}
                  style={{
                    display: isOpen ? "block" : "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div className="card-body p-3 p-md-4">
                    <div className="mx-md-1">
                      <p className="mb-4 pb-1 font-size-2 text-gray-600">
                        {item.answer}
                      </p>
                      <span className="font-size-2 text-gray-600">
                        Tristique parturient nulla ullamcorper at ullamcorper non orci iaculis neque augue.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <main id="content">
        <div className="container">
          <div className="py-4 py-lg-5 py-xl-8">
            <h6 className="font-weight-medium font-size-7 font-size-xs-25 text-center">
              Frequently Asked Questions
            </h6>
          </div>
          <div className="col-lg-8 mx-auto">
            <div className="space-bottom-2 space-bottom-lg-3 faq-accordion">
              {renderFaqSection("Shopping", shoppingFaqs)}
              {renderFaqSection("Payment", paymentFaqs)}
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
