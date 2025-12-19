import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { register as apiRegister } from "../api/client";
import { useNavigate, useLocation } from "react-router-dom";

function HomePage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine initial mode from URL path
  const getInitialMode = () => {
    if (location.pathname === "/login") return "login";
    return "register"; // default to register
  };
  
  // Form mode: 'login' or 'register'
  const [mode, setMode] = useState(getInitialMode());
  
  // Update mode when URL changes
  useEffect(() => {
    const newMode = location.pathname === "/login" ? "login" : "register";
    setMode(newMode);
  }, [location.pathname]);

  // Image carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Story slides with images
  const storySlides = [
    {
      id: 1,
      image: "/images/organize.png"
    },
    {
      id: 2,
      image: "/images/tasks.png"
    },
    {
      id: 3,
      image: "/images/stress.png"
    }
  ];
  
  // Auto-rotate images every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % storySlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, storySlides.length]);

  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await login(email, password);
      // Navigation handled by AuthContext
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await apiRegister(username, email, password);
      setSuccess("Account created! Switching to login...");
      setTimeout(() => {
        setMode("login");
        setSuccess("");
        setUsername("");
        setPassword("");
      }, 1500);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  function switchMode(newMode) {
    if (newMode === mode) return; // Don't switch if already in that mode
    
    setError("");
    setSuccess("");
    setEmail("");
    setPassword("");
    setUsername("");
    
    // Update URL without navigation
    const newPath = newMode === "register" ? "/register" : "/login";
    window.history.replaceState({}, "", newPath);
    
    // Small delay for smooth transition
    setTimeout(() => {
      setMode(newMode);
    }, 150);
  }

  function goToSlide(index) {
    setCurrentImageIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }

  function nextSlide() {
    setCurrentImageIndex((prev) => (prev + 1) % storySlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }

  function prevSlide() {
    setCurrentImageIndex((prev) => (prev - 1 + storySlides.length) % storySlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }

  const currentSlide = storySlides[currentImageIndex];

  return (
    <div className="homepage-split">
      {/* Auth Section - Left Side */}
      <div className="homepage-auth-panel">
        <div className={`auth-container ${mode}`}>
          {/* Logo */}
          <div className="auth-logo">
            <div className="app-logo">
              <img 
                src="/logo.svg" 
                alt="Smart Student Scheduler Logo"
                className="logo-image"
              />
            </div>
            <h1 className="auth-brand">Smart Student Scheduler</h1>
          </div>

          {/* Divider */}
          <div className="auth-divider"></div>

          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === "login" ? "active" : ""}`}
              onClick={() => switchMode("login")}
            >
              Login
            </button>
            <button
              className={`auth-tab ${mode === "register" ? "active" : ""}`}
              onClick={() => switchMode("register")}
            >
              Sign Up
            </button>
          </div>

          {/* Forms Container with Animation */}
          <div className="auth-forms-wrapper">
            {/* Login Form */}
            <form
              className={`auth-form login-form ${mode === "login" ? "active" : ""}`}
              onSubmit={handleLogin}
            >
              <h2 className="auth-form-title">Ready to organize your life? </h2>
              
              {error && mode === "login" && (
                <div className="auth-error">{error}</div>
              )}
              {success && mode === "login" && (
                <div className="auth-success">{success}</div>
              )}

              <label className="input-wrapper">
                <span className="input-label">Email</span>
                <div className="input-container">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                  />
                </div>
              </label>

              <label className="input-wrapper">
                <span className="input-label">Password</span>
                <div className="input-container">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                </div>
              </label>

              <button type="submit" disabled={submitting} className="auth-submit-btn">
                {submitting ? (
                  <>
                    <span className="spinner"></span>
                    <span>Logging in...</span>
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Register Form */}
            <form
              className={`auth-form register-form ${mode === "register" ? "active" : ""}`}
              onSubmit={handleRegister}
            >
              <h2 className="auth-form-title">Create your account</h2>
              
              {error && mode === "register" && (
                <div className="auth-error">{error}</div>
              )}
              {success && mode === "register" && (
                <div className="auth-success">{success}</div>
              )}

              <label className="input-wrapper">
                <span className="input-label">Username</span>
                <div className="input-container">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Zian"
                  />
                </div>
              </label>

              <label className="input-wrapper">
                <span className="input-label">Email</span>
                <div className="input-container">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                  />
                </div>
              </label>

              <label className="input-wrapper">
                <span className="input-label">Password</span>
                <div className="input-container">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="••••••••"
                  />
                </div>
              </label>

              <button type="submit" disabled={submitting} className="auth-submit-btn">
                {submitting ? (
                  <>
                    <span className="spinner"></span>
                    <span>Creating account...</span>
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Story/Image Carousel - Right Side */}
      <div className="homepage-story-panel">
        <div className="story-carousel">
          {/* Main Story Image/Content */}
          <div className="story-slide active">
            <div className="story-slide-content">
              <img 
                src={currentSlide.image} 
                alt="Smart Student Scheduler"
                className="story-image"
              />
            </div>
          </div>

          {/* Navigation Arrows */}
          <button className="carousel-arrow carousel-arrow-left" onClick={prevSlide}>
            ‹
          </button>
          <button className="carousel-arrow carousel-arrow-right" onClick={nextSlide}>
            ›
          </button>

          {/* Navigation Dots */}
          <div className="carousel-dots">
            {storySlides.map((slide, index) => (
              <button
                key={slide.id}
                className={`carousel-dot ${index === currentImageIndex ? "active" : ""}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play indicator */}
          <div className="carousel-indicator">
            {isAutoPlaying && <span className="indicator-dot" />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
