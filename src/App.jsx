import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Linkedin, 
  Mail, 
  Send, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Download 
} from "lucide-react"; 

// --- Configuration ---
// The general contact form will submit to a service like Formspree. 
const FORMSPREE_GENERAL_ENDPOINT = "https://formspree.io/f/YOUR_FORMSPREE_ENDPOINT"; // <-- REPLACE THIS!
// The hire form with file attachment.
const FORMSPREE_HIRE_ENDPOINT = "https://formspree.io/f/YOUR_HIRE_FORMSPREE_ENDPOINT"; // <-- REPLACE THIS!
const RESUME_DOWNLOAD_URL = "https://drive.google.com/uc?export=download&id=1-2onM6k5-ZdUIZjoVDjOSORv7BDhDNiX"; 

// --- UI Components ---
const SectionTitle = ({ children }) => (
  <h3 className="text-3xl font-extrabold text-gray-800 border-b-4 border-indigo-500 pb-2 mb-8">
    {children}
  </h3>
);

const Card = ({ children, className = "", delay = 0 }) => (
  <motion.div
    className={`bg-white p-6 rounded-xl shadow-lg transition duration-300 hover:shadow-xl ${className}`}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: delay }}
    viewport={{ once: true }}
  >
    {children}
  </motion.div>
);

// --- Project Inquiry Form Component (New in Merge) ---
const HireMeForm = () => {
  
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    projectDetails: "", 
    file: null 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); 

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files ? e.target.files[0] : null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('Project Details', formData.projectDetails);
    if (formData.file) {
      data.append('Attachment', formData.file); 
    }

    try {
      const response = await fetch(FORMSPREE_HIRE_ENDPOINT, {
        method: 'POST',
        body: data, 
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: "", email: "", projectDetails: "", file: null });
        // Clear file input manually
        if (e.target.elements['file-attachment']) {
          e.target.elements['file-attachment'].value = '';
        }
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 7000); 
    }
  };

  return (
    <Card className="shadow-2xl shadow-purple-500/30 border-t-4 border-purple-500">
      <h4 className="text-2xl font-bold text-center text-purple-700 mb-6 flex items-center justify-center gap-2">
        <FileText className="w-6 h-6" />  Project Inquiry
      </h4>
      <p className="text-center text-gray-600 mb-6 text-md">
        If you have a project requiring a detailed scope or NDA, please use this form to attach specifications.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label htmlFor="hire_name" className="block text-sm font-medium text-gray-700">Your Name</label>
            <input
              type="text"
              name="name"
              id="hire_name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="hire_email" className="block text-sm font-medium text-gray-700">Email for Reply</label>
            <input
              type="email"
              name="email"
              id="hire_email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>

          {/* Project Details Input */}
          <div>
            <label htmlFor="projectDetails" className="block text-sm font-medium text-gray-700">Detailed Project Scope / Requirements</label>
            <textarea
              name="projectDetails"
              id="projectDetails"
              rows="4"
              value={formData.projectDetails}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            ></textarea>
          </div>
          
          {/* File Attachment Input */}
          <div>
            <label htmlFor="file-attachment" className="block text-sm font-medium text-gray-700">Attach Specification File (PDF, Excel, Word, PPT)</label>
            <input
              type="file"
              name="file-attachment"
              id="file-attachment"
              onChange={handleFileChange}
              accept=".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx"
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-purple-600 file:text-white
                hover:file:bg-purple-700 transition"
            />
          </div>

          {/* Submission Status */}
          {submitStatus === 'success' && (
            <p className="text-center text-green-600 font-semibold flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" /> Project details sent! I'll review and contact you.
            </p>
          )}
          {submitStatus === 'error' && (
            <p className="text-center text-red-600 font-semibold flex items-center justify-center gap-2">
              <XCircle className="w-5 h-5" /> Error sending project inquiry. Please check your Formspree settings.
            </p>
          )}
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
            {isSubmitting ? 'SENDING DETAILS...' : 'SEND PROJECT DETAILS'}
          </button>
      </form>
    </Card>
  );
};


// --- Main App Component ---
export default function App() {
  // State for General Contact Form
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  const projects = [
    "Warehouse Management System",
    "E-commerce Platform",
    "Digital Analytics (Grafana)",
    "Inventory Management System",
    "Fintech Applications",
    "Bank Islami",
    "Aik Digital",
    "Hugo Bank",
    "Bank Alfalah",
    "Faysal Bank",
    "Gym Management System",
    "Salon Management System",
    "E-commerce (Saudi Clients)",
    "Alarm System Tracking",
    "Digital Track System",
    "Authenticator Based Application",
    "Maintenance Management System",
    "HR Payroll System",
    "Resume Deduction System",
  ];

  const projectBlurb =
    "Led QA team, performed Manual + Semi-Automation testing, validated core features (functional, API, performance), and optimized regression cycles for reliable releases.";

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(FORMSPREE_GENERAL_ENDPOINT, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: "", email: "", message: "" }); 
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* HERO */}
      <header className="bg-gradient-to-r from-blue-700 to-purple-800 py-20 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
          {/* Profile Picture */}
          <motion.img
            src="src/Picture/profile.jpg"
            alt="Muhammad Daniyal Asif"
            className="w-25 h-60 rounded-full shadow-2xl border-4 border-white object-cover"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          />
          {/* Hero Text */}
          <div className="flex-1 text-center md:text-left">
            <motion.h1
              className="text-5xl font-extrabold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Muhammad Daniyal Asif
            </motion.h1>
            <motion.h2
              className="mt-3 text-2xl font-semibold text-blue-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Executive SQA Engineer | Manual & Automation Tester
            </motion.h2>
            <p className="mt-5 text-lg text-blue-100 max-w-2xl">
              Driving QA Excellence in Web, Mobile & FinTech applications. Expert in Test Strategy, Cypress, Appium, and performance testing to ensure reliable, high-quality software releases.
            </p>

            {/* LinkedIn & Resume Button */}
            <div className="mt-8 flex justify-center md:justify-start gap-4">
              <a
                href="https://linkedin.com/in/muhammad-daniyal-asif-6b99b1204"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-blue-700 transition duration-300 shadow-md"
              >
                <Linkedin className="w-5 h-5" /> Connect on LinkedIn
              </a>
                <a
                href={RESUME_DOWNLOAD_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-full font-medium hover:bg-blue-100 transition duration-300 shadow-md"
              >
                <Download className="w-5 h-5" /> Download Resume
              </a>
            </div>
          </div>
        </div>
      </header>
      
      ---

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        
        {/* ABOUT */}
        <section>
          <SectionTitle>About Me 💡</SectionTitle>
          <Card className="leading-relaxed">
            Results-driven <strong>Executive SQA Engineer</strong> with 3+ years
            of experience in <strong>manual testing</strong>,{" "}
            <strong>automation frameworks</strong> (Cypress, Appium, Playwright),{" "}
            and <strong>API & performance testing</strong> (Postman, JMeter). Skilled in Agile practices and known for improving QA
            processes, reducing regression cycles, and mentoring QA engineers to
            deliver excellence across complex FinTech and E-commerce platforms.
          </Card>
        </section>

        ---
        
        {/* SKILLS (UPDATED) */}
        <section>
          <SectionTitle>Core Skills & Expertise 🛠️</SectionTitle>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Column 1: Core Testing */}
            <Card className="border-t-4 border-indigo-500" delay={0.0}>
                <h4 className="font-bold text-xl mb-3 text-indigo-700">Testing & Automation</h4>
                <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2"><span className="text-indigo-500 font-semibold text-lg">›</span> Cypress, Appium, Playwright</li>
                    <li className="flex items-center gap-2"><span className="text-indigo-500 font-semibold text-lg">›</span> Mobile App Testing (iOS/Android)</li>
                    <li className="flex items-center gap-2"><span className="text-indigo-500 font-semibold text-lg">›</span> Web UI & Cross-Browser Testing</li>
                    <li className="flex items-center gap-2"><span className="text-indigo-500 font-semibold text-lg">›</span> Test Case Design & Documentation</li>
                </ul>
            </Card>
            
            {/* Column 2: Advanced QA & Tools */}
            <Card className="border-t-4 border-indigo-500" delay={0.1}>
                <h4 className="font-bold text-xl mb-3 text-indigo-700">Advanced QA & Engineering</h4>
                <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2"><span className="text-indigo-500 font-semibold text-lg">›</span> API Testing (Postman/REST)</li>
                    <li className="flex items-center gap-2"><span className="text-indigo-500 font-semibold text-lg">›</span> Performance & Load Testing (JMeter)</li>
                    <li className="flex items-center gap-2"><span className="text-indigo-500 font-semibold text-lg">›</span> Security Testing (Penetration basics)</li>
                    <li className="flex items-center gap-2"><span className="text-indigo-500 font-semibold text-lg">›</span> CI/CD Integration (Jenkins/GitLab)</li>
                </ul>
            </Card>
            
            {/* Column 3: Process & Tech Stack */}
            <Card className="border-t-4 border-indigo-500" delay={0.2}>
                <h4 className="font-bold text-xl mb-3 text-indigo-700">Process & Tech Stack</h4>
                <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2"><span className="text-indigo-500 font-semibold text-lg">›</span> Agile / Scrum Methodology</li>
                    <li className="flex items-center gap-2"><span className="text-indigo-500 font-semibold text-lg">›</span> Database Testing (MySQL/SQL Server)</li>
                    <li className="flex items-center gap-2"><span className="text-indigo-500 font-semibold text-lg">›</span> Defect Tracking (Jira, ClickUp)</li>
                    <li className="flex items-center gap-2"><span className="text-indigo-500 font-semibold text-lg">›</span> Leadership & Process Improvement</li>
                </ul>
            </Card>
          </div>
        </section>

        ---
        
        {/* EXPERIENCE */}
        <section>
          <SectionTitle>Professional Experience 💼</SectionTitle>
          <div className="space-y-8 relative">
            {/* Timeline Line */}
            <div className="absolute left-3 top-0 bottom-0 w-1 bg-indigo-200 hidden md:block" />

            {/* Experience Items */}
            {[
              { title: "Executive SQA Engineer", company: "QBS Co.", duration: "May 2025 – Present · Karachi", duties: ["Led QA across multiple products; built automation & performance suites.", "Mentored QA engineers, set standards & improved workflows.", "Reduced regression cycle time through automation metrics."] },
              { title: "SQA Automation Consultant", company: "Xcelliti", duration: "Oct 2024 – May 2025 · Karachi", duties: ["Directed QA for E-commerce & WMS platforms with regression suites.", "Improved release confidence with checkout & payment test strategies."] },
              { title: "SQA Engineer", company: "Enterprise64", duration: "2022 – 2024 · Karachi", duties: ["Performed manual & semi-automation QA for banking & HR apps.", "Contributed to Appium mobile automation suites.", "Supported UAT & Agile sprints for on-time releases."] },
              { title: "QA Engineer", company: "Harvv", duration: "2021 – 2022 · Karachi", duties: ["Conducted functional & regression testing for web apps.", "Tracked bugs in Jira and supported sprint testing."] },
              { title: "QA Manual Tester", company: "Engro", duration: "2020 – 2021 · Karachi", duties: ["Performed enterprise-level manual QA for business applications.", "Prepared detailed bug reports & collaborated on fixes."] }
            ].map((job, index) => (
              <motion.article 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-lg transition duration-300 hover:shadow-2xl md:pl-10 relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 top-6 w-6 h-6 bg-indigo-500 rounded-full border-4 border-gray-50 hidden md:block transform -translate-x-1/2" />
                
                <h4 className="font-extrabold text-xl text-indigo-800">{job.title} — {job.company}</h4>
                <p className="text-sm text-gray-500 italic mt-1">{job.duration}</p>
                <ul className="list-disc list-inside mt-3 text-gray-700 space-y-1">
                  {job.duties.map((duty, i) => <li key={i}>{duty}</li>)}
                </ul>
              </motion.article>
            ))}
          </div>
        </section>

        ---

        {/* PROJECTS */}
        <section>
          <SectionTitle>Major Projects (19+) 🚀</SectionTitle>
          <p className="mb-6 text-gray-600">The projects below were tested using a combination of Manual & Semi-Automation techniques, with a focus on functional, API, and performance testing for robust, reliable releases.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((p, idx) => (
              <motion.div
                key={p}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="p-5 bg-white rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-xl transition"
              >
                <h5 className="font-semibold text-lg text-gray-800">{p}</h5>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{projectBlurb}</p>
              </motion.div>
            ))}
          </div>
        </section>

        ---

        {/* EDUCATION & CERTIFICATIONS */}
        <section>
          <SectionTitle>Education & Certifications 🎓</SectionTitle>
          <div className="grid md:grid-cols-2 gap-8">
            <Card delay={0}>
                <h4 className="font-bold text-xl text-indigo-700 mb-4 border-b pb-2">Academic History</h4>
                
                {/* BS */}
                <div className="p-4 rounded-lg border-l-4 border-green-500 bg-gray-50 mb-4">
                    <h5 className="font-bold text-lg">B.S. Computer Science</h5>
                    <p className="text-md text-gray-800">Sir Syed University of Engineering and Technology</p>
                    <p className="text-sm text-gray-600">OCTOBER 2018 - JANUARY 2022 </p>
                    <p className="text-sm text-gray-600">Karachi, Pakistan</p>
                </div>
                
                {/* Intermediate */}
                <div className="p-4 rounded-lg border-l-4 border-green-500 bg-gray-50 mb-4">
                    <h5 className="font-bold text-lg">Intermediate (Pre-Engineering)</h5>
                    <p className="text-md text-gray-800">NCR-CET Intermediate College</p>
<p className="text-sm text-gray-600">AUGUST 2011 - JANUARY 2013  </p>
                    <p className="text-sm text-gray-600">Karachi, Pakistan</p>
                </div>
                
                {/* Matriculation */}
                <div className="p-4 rounded-lg border-l-4 border-green-500 bg-gray-50">
                    <h5 className="font-bold text-lg">Matriculation</h5>
                    <p className="text-md text-gray-800">Practical Schooling System</p>
<p className="text-sm text-gray-600">JUNE 2009 - JANUARY 2011</p>
                    <p className="text-sm text-gray-600">Karachi, Pakistan</p>
                </div>
            </Card>

            <Card className="border-t-4 border-indigo-500" delay={0.1}>
              <h4 className="font-bold text-xl text-indigo-700 mb-4 border-b pb-2">Professional Certifications</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Bussiness Intelligence</li>
                <li>Certified ScrumMaster (CSM) - Agile QA Expert</li>
                <li>Cypress Test Automation Specialist</li>
                <li>Appium Mobile Automation Expert</li>
                <li>API Testing Mastery (Postman/Rest Assured)</li>
                <li>Performance Testing Expert (JMeter)</li>
                <li>Certified Software Tester (CSTE)</li>
                <li>Generative AI for Test Case Optimization</li>
              </ul>
            </Card>
          </div>
        </section>
        
        ---

        {/* CONTACT ME FORMS (General Inquiry + Hire Me/Project Inquiry) */}
        <section id="contact">
          <SectionTitle>Contact Me 📧</SectionTitle>
          
          <p className="text-center text-gray-700 text-lg font-medium mb-10">
            Phone/WhatsApp: <span className="font-extrabold text-indigo-700">+92 342-2909366</span>
            <span className="mx-4 text-gray-400">|</span> 
            Direct Email: <a href="mailto:mailtodaniyal11@gmail.com" className="text-indigo-600 hover:text-indigo-800 font-extrabold">mailtodaniyal11@gmail.com</a>
          </p>
          
          <div className="grid lg:grid-cols-2 gap-10">
            {/* General Contact Form (Left) */}
            <Card className="shadow-2xl shadow-indigo-500/30 border-t-4 border-indigo-500">
              <h4 className="text-2xl font-bold text-center text-indigo-700 mb-6">General Inquiry</h4>
              <p className="text-center text-gray-600 mb-6">
                For general questions or connecting, use this simple message form.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (will reply to this address)</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                {/* Message Input */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    name="message"
                    id="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  ></textarea>
                </div>

                {/* Submission Status */}
                {submitStatus === 'success' && (
                  <p className="text-center text-green-600 font-semibold flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" /> Message sent successfully! I'll get back to you soon.
                  </p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-center text-red-600 font-semibold flex items-center justify-center gap-2">
                    <XCircle className="w-5 h-5" /> Error sending message. Please try again or email me directly.
                  </p>
                )}
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </Card>

            {/* Project Inquiry Form (Right) */}
            <HireMeForm />

          </div>
        </section>

      </main>
      
      ---

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center mt-12">
        <p className="text-lg font-medium">Muhammad Daniyal Asif</p>
        <p className="text-sm mt-1">Executive SQA Engineer</p>
        <p className="text-xs mt-3">© {new Date().getFullYear()} All rights reserved. Built with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
}