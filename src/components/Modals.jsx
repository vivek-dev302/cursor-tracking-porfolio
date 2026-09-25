import React, { useState } from 'react';
import { X, Send, CheckCircle2, Code2, Sparkles, Download } from 'lucide-react';
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
            {activeModal === 'work' && 'Projects'}
            {activeModal === 'about' && 'About Me'}
            {activeModal === 'contact' && "Let's Connect"}
            {activeModal === 'resume' && 'Resume'}
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

        {/* WORK */}
        {activeModal === 'work' && (
          <div className="projects-grid">
            <div className="project-card">
              <span className="project-tag">Full-Stack · Queue Management</span>
              <h3 className="project-name">Smart Queue Management System</h3>
              <p className="project-desc">
                Full-stack digital queue system with authentication, email verification,
                QR-based registration, and responsive dashboards.
              </p>
              <div className="project-tech">
                <span className="tech-badge">Next.js</span>
                <span className="tech-badge">MongoDB</span>
                <span className="tech-badge">REST APIs</span>
              </div>
            </div>

            <div className="project-card">
              <span className="project-tag">Mobile · Social Networking</span>
              <h3 className="project-name">LazyBond</h3>
              <p className="project-desc">
                Cross-platform social networking app to discover and connect with people.
                Google Sign-In, Firestore, Typesense search. Published on Google Play Store.
              </p>
              <div className="project-tech">
                <span className="tech-badge">React Native</span>
                <span className="tech-badge">Firebase</span>
                <span className="tech-badge">Typesense</span>
              </div>
            </div>

            <div className="project-card">
              <span className="project-tag">Mobile · AI · Health</span>
              <h3 className="project-name">Calorie Tracker App</h3>
              <p className="project-desc">
                React Native app for tracking daily calorie intake with AI-powered
                nutritional insights using the Gemini API.
              </p>
              <div className="project-tech">
                <span className="tech-badge">React Native</span>
                <span className="tech-badge">Gemini API</span>
                <span className="tech-badge">REST APIs</span>
              </div>
            </div>

            <div className="project-card">
              <span className="project-tag">Automation · Video · AI</span>
              <h3 className="project-name">Automated Clipping Tool</h3>
              <p className="project-desc">
                Downloads YouTube videos/playlists, processes them into short-form clips,
                and auto-uploads to Instagram via Playwright browser automation.
              </p>
              <div className="project-tech">
                <span className="tech-badge">Python</span>
                <span className="tech-badge">FFmpeg</span>
                <span className="tech-badge">Playwright</span>
              </div>
            </div>

            <div className="project-card">
              <span className="project-tag">Internship · Fintech</span>
              <h3 className="project-name">Capital Care Fintech Website</h3>
              <p className="project-desc">
                Developed and deployed the company website capitalcarefintech.com with
                responsive UI, backend integration, and REST APIs.
              </p>
              <div className="project-tech">
                <span className="tech-badge">Next.js</span>
                <span className="tech-badge">MySQL</span>
                <span className="tech-badge">REST APIs</span>
              </div>
            </div>
          </div>
        )}

        {/* ABOUT */}
        {activeModal === 'about' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.9)' }}>
              I'm <strong>Vivek Kumar Maurya</strong>, a B.Tech CSE (AI & ML) student at
              JC Bose University, YMCA (expected 2027). I build full-stack web apps, mobile
              apps, and automation tools — currently diving deep into LLMs, RAG & Agentic AI.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.08)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fca5a5', marginBottom: '8px' }}>
                  <Code2 size={20} />
                  <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}>Tech Stack</strong>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
                  <strong style={{color:'#fff'}}>Languages:</strong> JavaScript, Python, Java, SQL<br/>
                  <strong style={{color:'#fff'}}>Frameworks:</strong> React, Next.js, React Native<br/>
                  <strong style={{color:'#fff'}}>Databases:</strong> MongoDB, MySQL, Firebase, Typesense<br/>
                  <strong style={{color:'#fff'}}>Tools:</strong> Git, REST APIs, Gemini API, Playwright, FFmpeg
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.08)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fca5a5', marginBottom: '8px' }}>
                  <Sparkles size={20} />
                  <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}>Currently Exploring</strong>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
                  Large Language Models, Retrieval-Augmented Generation (RAG),
                  Agentic AI workflows, and Model Context Protocol (MCP) through
                  hands-on projects and structured learning.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 130px', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>5+</div>
                <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Projects Shipped</div>
              </div>
              <div style={{ flex: '1 1 130px', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>7.9</div>
                <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>CGPA / 10</div>
              </div>
              <div style={{ flex: '1 1 130px', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>2027</div>
                <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Graduating</div>
              </div>
            </div>
          </div>
        )}

        {/* CONTACT */}
        {activeModal === 'contact' && (
          <div>
            {formSent ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <CheckCircle2 size={48} color="#22c55e" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Message Sent!</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>Thanks for reaching out — I'll get back to you soon.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
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
                    placeholder="you@email.com"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="What's on your mind?"
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
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* RESUME */}
        {activeModal === 'resume' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Vivek Kumar Maurya</h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                  Software Developer &bull; vivekmaurya9612@gmail.com
                </p>
              </div>
              <a
                className="btn-primary-white"
                href="/vivek_resume.pdf"
                download="Vivek_Kumar_Maurya_Resume.pdf"
                onMouseEnter={() => soundEnabled && playHoverSound()}
                onClick={() => soundEnabled && playClickSound()}
              >
                <Download size={16} />
                <span>Download PDF</span>
              </a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Education */}
              <div style={{ background: 'rgba(255,255,255,0.08)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <strong>B.Tech CSE (AI & ML) &bull; JC Bose University, YMCA</strong>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Expected 2027 &bull; CGPA 7.9/10</span>
                </div>
              </div>

              {/* Experience */}
              <div style={{ background: 'rgba(255,255,255,0.08)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <strong>Software Development Intern &bull; Capital Care Group</strong>
                  <a href="https://capitalcarefintech.com" target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'underline' }}>
                    capitalcarefintech.com
                  </a>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)', marginTop: '6px', lineHeight: 1.5 }}>
                  Built and deployed the company website using Next.js, MySQL, and REST APIs.
                  Implemented responsive frontend interfaces and backend integration with the startup team.
                </p>
              </div>

              {/* Skills */}
              <div style={{ background: 'rgba(255,255,255,0.08)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)' }}>
                <strong style={{ display: 'block', marginBottom: '10px' }}>Technical Skills</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['JavaScript','Python','Java','SQL','React','Next.js','React Native','MongoDB','MySQL','Firebase','Typesense','Git','Gemini API','Playwright','FFmpeg'].map(s => (
                    <span key={s} className="tech-badge">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
