"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

export default function Footer() {
  return (
    <>
      <footer className="bg-black text-light py-4 mt-auto shadow-sm">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
          {/* Left Text */}
          <div className="mb-3 mb-md-0 text-center text-md-start d-flex align-items-center">
            <Image
              src="/images/happy electronics.png"
              alt="Happy Electronics Logo"
              width={30}
              height={30}
              className="me-2"
            />
            © {new Date().getFullYear()} Happy Electronics. All rights reserved.
          </div>

          {/* Footer Links */}
          <ul className="nav justify-content-center justify-content-md-end">
            <li className="nav-item">
              <Link href="/" className="nav-link px-2 text-light">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/about" className="nav-link px-2 text-light">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/contact" className="nav-link px-2 text-light">
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/privacy" className="nav-link px-2 text-light">
                Privacy
              </Link>
            </li>
          </ul>
        </div>
      </footer>

      {/* Voiceflow Chatbot Script */}
      <Script
        id="voiceflow-chatbot"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(d, t) {
              var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
              v.onload = function() {
                window.voiceflow.chat.load({
                  verify: { projectID: '689bf1319d300c90a545b86f' },
                  url: 'https://general-runtime.voiceflow.com',
                  versionID: 'production',
                  voice: {
                    url: "https://runtime-api.voiceflow.com"
                  }
                });
              };
              v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
              v.type = "text/javascript";
              s.parentNode.insertBefore(v, s);
            })(document, 'script');
          `,
        }}
      />
    </>
  );
}
