import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeroIllustration from '../components/HeroIllustration';
import StepIcon from '../components/StepIcon';

const studentSteps = [
  { icon: 'profile', title: 'Build your profile', text: 'Add your skills, education, and upload a resume in minutes.' },
  { icon: 'search', title: 'Search open roles', text: 'Filter by location, job type, and experience level to find the right fit.' },
  { icon: 'apply', title: 'Apply and track', text: 'Apply with one click and follow your status from Applied to Hired.' },
];

const recruiterSteps = [
  { icon: 'post', title: 'Post a job', text: 'List the role with required skills, salary range, and experience level.' },
  { icon: 'review', title: 'Review applicants', text: 'See every candidate\u2019s profile and resume in one dashboard.' },
  { icon: 'hire', title: 'Move them forward', text: 'Shortlist, reject, or hire \u2014 candidates see their status update instantly.' },
];

const companies = ['Northwind', 'Vantage Labs', 'Orbitly', 'Fernbridge', 'Solace Co.', 'Kestrel'];

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <span className="eyebrow">MERN Job Portal</span>
            <h1>Where students and recruiters actually connect.</h1>
            <p className="hero-lede">
              Post roles in minutes. Apply with one click. Track every application
              from "Applied" to "Hired" \u2014 all in one place.
            </p>
            <div className="hero-actions">
              <Link to="/jobs" className="btn btn-primary btn-lg">Browse open roles</Link>
              {!user && <Link to="/register" className="btn btn-ghost btn-lg">Create an account</Link>}
            </div>

            <div className="hero-stats">
              <div>
                <span className="stat-number">500+</span>
                <span className="stat-label">Jobs posted</span>
              </div>
              <div>
                <span className="stat-number">200+</span>
                <span className="stat-label">Companies hiring</span>
              </div>
              <div>
                <span className="stat-number">1,200+</span>
                <span className="stat-label">Students placed</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* Trusted-by strip */}
      <section className="logo-strip">
        <p className="logo-strip-label">Roles posted by teams at</p>
        <div className="logo-row">
          {companies.map((name) => (
            <span key={name} className="logo-pill">{name}</span>
          ))}
        </div>
      </section>

      {/* How it works — students */}
      <section className="how-it-works">
        <div className="section-heading">
          <span className="section-eyebrow">For students</span>
          <h2>From profile to offer, in three steps</h2>
        </div>
        <div className="step-grid">
          {studentSteps.map((step, i) => (
            <div key={step.title} className="step-card">
              <div className="step-icon-wrap"><StepIcon type={step.icon} /></div>
              <span className="step-number">0{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works — recruiters */}
      <section className="how-it-works alt">
        <div className="section-heading">
          <span className="section-eyebrow">For recruiters</span>
          <h2>Hire without the spreadsheet chaos</h2>
        </div>
        <div className="step-grid">
          {recruiterSteps.map((step, i) => (
            <div key={step.title} className="step-card">
              <div className="step-icon-wrap"><StepIcon type={step.icon} /></div>
              <span className="step-number">0{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <h2>Ready to get started?</h2>
        <p>Join as a student to start applying, or as a recruiter to start hiring.</p>
        <div className="hero-actions center">
          <Link to="/register" className="btn btn-primary btn-lg">Create your account</Link>
          <Link to="/jobs" className="btn btn-ghost btn-lg">Browse jobs first</Link>
        </div>
      </section>
    </div>
  );
}
