import { useState } from 'react';

import '../styles/LandingPage.css';

import softgaitLogo from '../assets/images/softgait-logo.png';
import landingIllustration from '../assets/images/landpage-illustration.png';
import referralIllustration from '../assets/images/referral-illustration.png';
import orderManagementSS from '../assets/images/order-management-ss.jpg';
import patientManagementSS from '../assets/images/patient-management.jpg';
import fitterManagementSS from '../assets/images/fitter-ss.jpg';
import softgaitLogoSM from '../assets/images/softgait-logo-small.jpg';

import LoginModal from '../components/modals/LoginModal';
import ResetPasswordModal from '../components/modals/ResetPasswordModal';

type ActiveModal = 'login' | 'reset' | null;

export default function LandingPage() {
    // menu state
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // modal state
    const [activeModal, setActiveModal] = useState<ActiveModal>(null);

    // toggle menu
    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    // open login
    const openLogin = () => {
        setActiveModal('login');
    };

    // open reset
    const openReset = () => {
        setActiveModal('reset');
    };

    // close modal
    const closeModal = () => {
        setActiveModal(null);
    };

    // mobile login
    const handleMobileLogin = () => {
        setIsMenuOpen(false);
        openLogin();
    };

    return (
        <>
            {/* hero section */}
            <div className="hero-wrapper">
                <div className="navbar">
                    <div className="nav-left">
                        <div className="hamburger" onClick={toggleMenu}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>

                        <img className="logo" src={softgaitLogo} alt="Softgait Logo" />
                    </div>

                    <div className="nav-links" id="navLinks">
                        <a href="#home">Home</a>
                        <a href="#features">Features</a>
                        <a href="#referral">Referral Program</a>
                        <a href="#contact">Contact</a>
                        <a href="#screenshot">Screenshot</a>
                    </div>

                    <div className="nav-actions">
                        <button type="button" className="login" onClick={openLogin}>
                            Login
                        </button>

                        <button type="button" className="register">
                            Register
                        </button>
                    </div>
                </div>

                {/* mobile menu */}
                <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`} id="mobileMenu">
                    <div className="menu-card">
                        <a href="#home" onClick={() => setIsMenuOpen(false)}>
                            Home
                        </a>

                        <a href="#features" onClick={() => setIsMenuOpen(false)}>
                            Features
                        </a>

                        <a href="#referral" onClick={() => setIsMenuOpen(false)}>
                            Referral Program
                        </a>

                        <a href="#contact" onClick={() => setIsMenuOpen(false)}>
                            Contact
                        </a>

                        <a href="#screenshot" onClick={() => setIsMenuOpen(false)}>
                            Screenshot
                        </a>

                        <div className="menu-actions">
                            <button type="button" className="login" onClick={handleMobileLogin}>
                                Login
                            </button>

                            <button type="button" className="register">
                                Register
                            </button>
                        </div>
                    </div>
                </div>

                {/* hero content */}
                <div className="hero" id="home">
                    <div className="hero-content">
                        <h1>What is Softgait?</h1>

                        <p>
                            SoftGait is a technology company that helps your durable medical
                            equipment business profit from the therapeutic shoe program. Yes, PROFIT
                            and EXPAND your business using Softgait.
                        </p>

                        <div className="hero-buttons">
                            <button type="button" className="btn primary">
                                Request Demo
                            </button>

                            <button type="button" className="btn secondary">
                                Watch Video
                            </button>
                        </div>
                    </div>

                    <div className="hero-image">
                        <img src={landingIllustration} alt="Illustration" />
                    </div>
                </div>
            </div>

            {/* top cards */}
            <div className="top-cards">
                <div className="top-card">
                    <i className="fas fa-map-marker-alt"></i>
                    <h4>National Shoe Fitter</h4>
                    <p>Tap into our network of filters instead of hiring your own.</p>
                    <a href="/">Read more →</a>
                </div>

                <div className="top-card">
                    <i className="fas fa-dollar-sign"></i>
                    <h4>No upfront cost</h4>
                    <p>Pay only a small flat fee per transaction</p>
                    <a href="/">Read more →</a>
                </div>

                <div className="top-card">
                    <i className="fas fa-wifi"></i>
                    <h4>Use Anywhere</h4>
                    <p>From your office staff to fitters on the road access softgait anywhere</p>
                    <a href="/">Read more →</a>
                </div>
            </div>

            {/* features */}
            <div className="section" id="features">
                <h2>Our Features</h2>

                <p className="our-features">
                    Softgait connects patients with shoe fitters throughout the US, documenting each
                    Medicare requirement and creating a profitable solution to the Therapeutic Shoe
                    Bill.
                </p>

                <div className="features-grid">
                    <div className="feature">
                        <i className="fa fa-paper-plane"></i>
                        <h4>Order Tracking</h4>
                        <p>
                            Know every step of the process instantly. Each step is timestamp and
                            documented.
                        </p>
                    </div>

                    <div className="feature">
                        <i className="fa fa-box"></i>
                        <h4>Inventory Tracking</h4>
                        <p>
                            Shoe orders are drop shipped directly to the fitters. No need to keep an
                            expensive shoe inventory.
                        </p>
                    </div>

                    <div className="feature">
                        <i className="fa fa-check"></i>
                        <h4>Compliance</h4>
                        <p>
                            You choose when the process starts and finishes. You approve the
                            paperwork fitters submit.
                        </p>
                    </div>

                    <div className="feature">
                        <i className="fa fa-users"></i>
                        <h4>Communication</h4>
                        <p>Softgait is cloud based software so everyone is updated in real time.</p>
                    </div>

                    <div className="feature">
                        <i className="fa fa-plug"></i>
                        <h4>Integrations</h4>
                        <p>
                            Use Softgait as a complete system or integrate into your existing
                            software.
                        </p>
                    </div>

                    <div className="feature">
                        <i className="fa fa-times"></i>
                        <h4>No Errors</h4>
                        <p>
                            All steps of the process is tracked and documented and the data is
                            stored in one central place.
                        </p>
                    </div>
                </div>
            </div>

            {/* referral */}
            <div className="referral-new" id="referral">
                <div className="ref-left">
                    <h2>Softgait Referral Program</h2>
                    <p>Please fill out the form to apply.</p>
                    <img src={referralIllustration} alt="Illustration" />
                </div>

                <div className="ref-card">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Company Name</label>
                            <input placeholder="Enter company name" />
                        </div>

                        <div className="form-group">
                            <label>Referred by</label>
                            <input placeholder="Enter your company name" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Contact Name</label>
                            <input placeholder="Enter contact name" />
                        </div>

                        <div className="form-group">
                            <label>Email of the Referrer</label>
                            <input placeholder="Enter your company name" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Contact Person Email</label>
                            <input placeholder="Enter contact person email" />
                        </div>

                        <div className="form-group">
                            <label>Referral Phone</label>
                            <input placeholder="Enter your company name" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group full">
                            <label>Contact Person Phone</label>
                            <input placeholder="Enter contact person phone" />
                        </div>

                        <div className="form-group full">
                            <label>Message</label>
                            <input placeholder="Enter your message" />
                        </div>
                    </div>

                    <button type="button" className="btn primary submit-btn">
                        Submit
                    </button>
                </div>
            </div>

            {/* referral video */}
            <div className="video-section" id="video">
                <div className="video-box">
                    <div className="play-btn"></div>
                </div>

                <div>
                    <h2>Softgait Referral Program</h2>
                    <p>
                        In just under 3 minutes, discover how Softgait can transform your business
                        operations and drive success. Softgait offers a streamlined solution
                        specifically designed for Durable Medical Equipment (DME), Home Medical
                        Equipment (HME), and other providers.
                    </p>
                </div>
            </div>

            {/* request demo */}
            <div className="demo">
                <h2>Request Demo</h2>

                <p className="demo-subtext">
                    Please fill out the contact form below and one of our specialist will setup an
                    online demo.
                </p>

                <div className="demo-form">
                    <div className="demo-row">
                        <div style={{ flex: 1 }}>
                            <label>Name</label>
                            <input placeholder="Enter your Name" />
                        </div>

                        <div style={{ flex: 1 }}>
                            <label>Email</label>
                            <input placeholder="Enter your email" />
                        </div>

                        <div style={{ flex: 1 }}>
                            <label>Phone Number</label>
                            <input placeholder="Enter your phone number" />
                        </div>
                    </div>

                    <div>
                        <label>Message</label>
                        <textarea placeholder="Enter your message"></textarea>
                    </div>

                    <button type="button" className="demo-btn">
                        Submit
                    </button>
                </div>
            </div>

            {/* fitter signup */}
            <div className="signup">
                <div>
                    <h2>Fitter Signup</h2>
                    <p>
                        Learn more about how to sign up and start leveraging Softgait for your
                        therapeutic shoe business, watch our quick video guide.
                    </p>
                </div>

                <div className="video-box">
                    <div className="play-btn"></div>
                </div>
            </div>

            {/* screenshots */}
            <div className="screenshots" id="screenshot">
                <h2>Screenshots</h2>

                <div className="screenshot-grid">
                    <div className="screenshot">
                        <img src={fitterManagementSS} alt="Fitter screenshot" />
                    </div>

                    <div className="screenshot">
                        <img src={orderManagementSS} alt="Order management screenshot" />
                    </div>

                    <div className="screenshot">
                        <img src={patientManagementSS} alt="Patient screenshot" />
                    </div>
                </div>
            </div>

            {/* footer */}
            <div className="footer-main" id="contact">
                <div className="footer-top">
                    <div className="footer-logo">
                        <img src={softgaitLogoSM} alt="Softgait logo" />
                    </div>

                    <div className="footer-column">
                        <h4>Company</h4>

                        <div className="company-links">
                            <a href="#">Career</a>
                            <a href="#">About Us</a>
                            <a href="#">Contact</a>
                        </div>
                    </div>

                    <div className="footer-contact">
                        <h4>Get in touch</h4>

                        <div className="contact-box">
                            <input type="text" placeholder="Enter your email" />
                            <button type="button">Submit</button>
                        </div>
                    </div>
                </div>

                <div className="footer-divider"></div>

                <div className="footer-bottom">
                    <div className="footer-left">
                        <a href="/">Legal</a>
                        <a href="/">Terms & Conditions</a>
                    </div>

                    <div className="footer-right">
                        Copyright 2026, <span>Softgait</span>. All Rights Reserved
                    </div>
                </div>
            </div>

            {/* login modal */}
            <LoginModal
                isOpen={activeModal === 'login'}
                onClose={closeModal}
                onForgotPassword={openReset}
            />

            {/* reset modal */}
            <ResetPasswordModal
                isOpen={activeModal === 'reset'}
                onClose={closeModal}
                onBackToLogin={openLogin}
            />
        </>
    );
}
