import React from 'react';
import LogoLoop from '../components/LogoLoop';
import "../styles/pages.css"

const About = ({ codingLanguages, skills }) => {

  return (
    <div className="page about-page">
         <section className='about-me-content'>
                <img src="/images/manabat_full_body.jpg" alt="Profile Picture" className='profile-picture-about-page'/>
                <div className='about-me-inner-contents'>
                    <h1>Why should you hire me?</h1>
                    <p>
                        Although I'm still an IT Web Development student, 
                        I have a strong technical foundation and a creative eye 
                        for design. I build functional, user-friendly websites 
                        that are engaging, code-efficient, and optimized for seamless 
                        user experiences, with a solid understanding of UI and UX principles.
                    </p>
                    <p>
                        I’m committed to delivering high-quality output that will align with
                        your goals, whether you need a responsive website, a fresh user 
                        interface, or efficient code that scales.
                    </p>
                    
                    <section className='short-bio-about'>
                        <div className='inner-about-bio'>
                            <p className='title'>Name</p>
                            <section className='image-n-text'>
                                <p>Alexander Manabat</p>
                            </section>
                        </div>
                        <div className='inner-about-bio'>
                            <p className='title'>Location</p>
                            <section className='image-n-text'>
                                <img src="/images/philippine_logo.png" alt="Philippine Logo" className='image-inner'/>
                                <p>Philippines</p>
                            </section>
                        </div>
                        <div className='inner-about-bio'>
                            <p className='title'>Current School</p>
                            <section className='image-n-text'>
                                <img src="/images/schools/hau_logo_education.png" alt="Holy Angel University Logo" className='image-inner'/>
                                <p>Holy Angel University</p>
                            </section>
                        </div>
                    </section>
                </div>
            </section>

<LogoLoop languages={codingLanguages} speed={30} gap={65} logoHeight={55} />

             <div className="capabilities-parent-container">
                <section>
                    <div className='skills-section-header header-h1-h2-layered'>
                        <h1>CAPABILITIES</h1>
                        <h2>Skills</h2>
                    </div>
                </section>

                <div className='skills-grid'>
                  {skills && skills.map((skill, index) => (
                    <div key={index} className='skill-card-item'>
                      <div className='skill-card-header'>
                        <div className='skill-number'>{String(index + 1).padStart(2, '0')}</div>
                        <div className='skill-icon-wrapper'>
                          <img src={skill.img} alt={skill.title} className='skill-icon' />
                        </div>
                        <h3 className='skill-title'>{skill.title}</h3>
                      </div>
                      <p className='skill-description'>{skill.description}</p>
                    </div>
                  ))}
                </div>
            </div>

            <div className='education-background-container'>
                <section className='desc-education'>
                    <div className='header-h1-h2-layered'>
                        <h1>ACADEMIC</h1>
                        <h2>Education</h2>  
                    </div>
                    <p>My academic journey from Senior High School to pursuing a Bachelor of Science in Information Technology built a strong foundation in problem-solving, critical thinking, and system design. Through hands-on projects and collaborative activities, I developed adaptability, creativity, and a commitment to continuous learning in the ever-evolving field of technology.</p>
                </section>
                <section className='main-education-info'>
                    <div className='sanlorenzo'>
                        <section>
                            <img src="/images/sanlo_logo_education.png" alt="San Lorenzo Logo" />
                        </section>
                        <section className='school-info-exp'>
                            <h1>San Lorenzo Ruiz</h1>
                            <div>
                                <p>Philippines, City of San Fernando Pampanga</p>
                                <section className='school-years'>
                                    <ul className='ul-list-school'>
                                        <li>Grade 7 <span className='main-date'>2017 - 2018</span></li>
                                        <li>Grade 8 <span className='main-date'>2018 - 2019</span></li>
                                        <li>Grade 9 <span className='main-date'>2019 - 2020</span></li>
                                        <li>Grade 10 <span className='main-date'>2020 - 2021</span></li>
                                    </ul>
                                </section>
                            </div>
                        </section>
                    </div>

                    <div className='holyangeluni'>
                        <section>
                            <img src="/images/hau_logo_education.png" alt="Holy Angel University Logo" />
                        </section>
                        <section className='school-info-exp'>
                            <h1>Holy Angel University</h1>
                            <div>
                                <p>Philippines, Angeles City Pampanga</p>
                                <section className='school-years'>
                                    <ul className='ul-list-school'>
                                        <li>Grade 11 <span className='main-date'>2021 -2022</span></li>
                                        <li>Grade 12 <span className='main-date'>2022 - 2023</span></li>
                                        <br />
                                        <li>1st Year IT Web Dev <span className='main-date'>2023 - 2024</span></li>
                                        <li>2nd Year IT Web Dev <span className='main-date'>2024 - 2025</span></li>
                                        <li>3rd Year IT Web Dev <span className='main-date'>2025 - 2026</span></li>
                                        <li>4th Year IT Web Dev <span className='main-date'>2026 - 2027</span></li>
                                    </ul>
                                </section>
                            </div>
                        </section>
                    </div>

                </section>
            </div>

    </div>
  );
};

export default About;
