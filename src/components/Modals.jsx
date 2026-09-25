import React, { useState } from 'react';
import { X, ExternalLink, Send, CheckCircle2, Award, Briefcase, GraduationCap, Code2, Sparkles, Download } from 'lucide-react';
import { playHoverSound, playClickSound } from '../utils/audio';

export default function Modals({ activeModal, onClose, soundEnabled }) {
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  if (!activeModal) return null;

  const handleClose = () => {
    if (soundEnabled) playClickSound();
    onClose();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (soundEnabled) playClickSound();
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setFormData({ name: '', email: '', message: '' });
      onClose();
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content interactive"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {activeModal === 'work' && 'Selected Works & Architecture'}
            {activeModal === 'about' && 'About & Craft'}
            {activeModal === 'contact' && "Let's Build Something Iconic"}
            {activeModal === 'resume' && 'Curriculum Vitae & Experience'}
          </h2>
          <button
            className="modal-close-btn"
            onClick={handleClose}
            onMouseEnter={() => soundEnabled && playHoverSound()}
            aria-label="Close Modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body: WORK */}
        {activeModal === 'work' && (
          <div className="projects-grid">
            <div className="project-card">
              <span className="project-tag">Full-Stack / AI System</span>
              <h3 className="project-name">OmniSynth Realtime Vision</h3>
              <p className="project-desc">
                Ultra-low latency multimodal streaming engine powering zero-lag visual spatial tracking and neural audio generation.
              </p>
              <div className="project-tech">
                <span className="tech-badge">React</span>
                <span className="tech-badge">WebGL / Canvas</span>
                <span className="tech-badge">Python</span>
                <span className="tech-badge">WebSockets</span>
              </div>
            </div>

            <div className="project-card">
              <span className="project-tag">Fintech / High Frequency</span>
              <h3 className="project-name">Apex Liquidity Protocol</h3>
              <p className="project-desc">
                Institutional-grade algorithmic trading terminal with sub-millisecond order routing and real-time WebGL depth visualizers.
              </p>
              <div className="project-tech">
                <span className="tech-badge">Next.js</span>
                <span className="tech-badge">Rust</span>
                <span className="tech-badge">TailwindCSS</span>
                <span className="tech-badge">GraphQL</span>
              </div>
            </div>

            <div className="project-card">
              <span className="project-tag">Creative Engineering</span>
              <h3 className="project-name">Aura Spatial Canvas</h3>
              <p className="project-desc">
                Physics-based gesture & eye-tracking interface designed for modern web spatial computing and interactive luxury brand showcases.
              </p>
              <div className="project-tech">
                <span className="tech-badge">Canvas 2D</span>
                <span className="tech-badge">Web Audio API</span>
                <span className="tech-badge">Three.js</span>
                <span className="tech-badge">Vite</span>
              </div>
            </div>

            <div className="project-card">
              <span className="project-tag">Cloud Infrastructure</span>
              <h3 className="project-name">HyperScale Microservices</h3>
              <p className="project-desc">
                Distributed edge computing mesh with automated zero-downtime canary rollouts and predictive autoscaling.
              </p>
              <div className="project-tech">
                <span className="tech-badge">Go</span>
                <span className="tech-badge">Docker</span>
                <span className="tech-badge">Kubernetes</span>
                <span className="tech-badge">Redis</span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Body: ABOUT */}
        {activeModal === 'about' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.9)' }}>
              I am a <strong>Full-Stack Architect & Creative Technologist</strong> dedicated to creating memorable digital products where pristine code architecture meets world-class interactive design.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fca5a5', marginBottom: '8px' }}>
                  <Code2 size={20} />
                  <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>Core Stack</strong>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
                  TypeScript, React, Node.js, Python, OpenCV, Go, PostgreSQL, WebSockets, Canvas 2D/WebGL.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fca5a5', marginBottom: '8px' }}>
                  <Sparkles size={20} />
                  <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>Philosophy</strong>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
                  Zero lag, sub-millisecond response, delightful micro-interactions, and robust distributed backends.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }}>
              <div style={{ flex: '1 1 140px', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>6+</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Years Experience</div>
              </div>
              <div style={{ flex: '1 1 140px', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>30+</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Shipped Projects</div>
              </div>
              <div style={{ flex: '1 1 140px', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>99.9%</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Uptime Standard</div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Body: CONTACT */}
        {activeModal === 'contact' && (
          <div>
            {formSent ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <CheckCircle2 size={48} color="#22c55e" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Message Transmitted</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>Thank you for reaching out. I'll get back to you promptly.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@company.com"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Project Vision / Inquiries</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell me about your project, timeline, and goals..."
                    className="form-textarea"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary-white"
                  style={{ alignSelf: 'flex-start', marginTop: '6px' }}
                  onMouseEnter={() => soundEnabled && playHoverSound()}
                >
                  <Send size={16} />
                  <span>Send Dispatch</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Modal Body: RESUME */}
        {activeModal === 'resume' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Vivek &bull; Full Stack Engineer</h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>San Francisco / Remote &bull; contact@Vivek.dev</p>
              </div>
              <button
                className="btn-primary-white"
                onClick={() => {
                  if (soundEnabled) playClickSound();
                  alert('Resume download initialized.');
                }}
                onMouseEnter={() => soundEnabled && playHoverSound()}
              >
                <Download size={16} />
                <span>Download PDF</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '8px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>Lead Full-Stack Architect &bull; Apex Labs</strong>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>2023 &mdash; PRESENT</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)', marginTop: '6px', lineHeight: 1.5 }}>
                  Architected real-time visualization frameworks handling 2M+ daily active sessions with sub-50ms latency. Mentored a team of 8 engineers.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>Senior Creative Technologist &bull; Hyperion Studio</strong>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>2020 &mdash; 2023</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)', marginTop: '6px', lineHeight: 1.5 }}>
                  Engineered award-winning WebGL interactive experiences and high-throughput microservices for Fortune 500 technology leaders.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
