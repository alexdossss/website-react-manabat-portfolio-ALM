import React from 'react';
import { useParams, Link } from 'react-router-dom';
import FloatingBlobBackground from '../components/FloatingBlobBackground';
import '../styles/pages.css';

const BlogDetail = () => {
  const { id } = useParams();

   const blogContent = {
    'dashboard-interface': {
      title: 'Designing an Intuitive Dashboard Interface',
      date: 'February 23, 2026',
      readTime: '4 min read',
      image: '/images/blogs/Dashboard_Cover.jpg',
      category: 'UI/UX Design',
      content: `
            <h2>Introduction</h2>
            <p>When I first started building applications, I honestly thought dashboards were just a collection of charts, cards, and statistics placed together to make the app look complete. But after working on several projects, I realized that the dashboard is usually the first thing users see and interact with. That means it quietly determines whether users feel comfortable, confused, or overwhelmed within the first few seconds. Through experience, I learned that designing dashboards is less about adding more features and more about presenting information in a way that feels natural and effortless to understand.</p>

            <p>One thing that stood out to me during development was how small design decisions could heavily impact usability. Spacing, alignment, color usage, and even the order of cards changed how easily information could be scanned. Over time, I started seeing dashboard design as a balance between functionality and cognitive simplicity rather than just visual presentation.</p>

            <h2>Challenges I Experienced</h2>
            <p>As a student developer, one of my biggest struggles was the temptation to display everything I worked hard to implement. I wanted to show all available data, thinking it would make the dashboard feel more powerful. Instead, it created clutter and made the interface harder to navigate. Users shouldn't need to “figure out” a dashboard they should understand it almost immediately.</p>

            <p>I also encountered moments where the layout felt visually decent but still confusing to use. That experience taught me that aesthetics alone don’t guarantee usability. A dashboard can look modern yet still fail to communicate information clearly if hierarchy and structure are missing.</p>

            <h2>Important Lessons I Learned</h2>

            <h3>1. Prioritizing Key Information</h3>
            <p>I learned to identify what users actually need at a glance. Instead of treating every metric equally, I began highlighting the most important information using card size, positioning, and contrast. This helped create a natural visual flow where users could quickly understand what deserves their attention first.</p>

            <h3>2. Simplicity Improves Confidence</h3>
            <p>When layouts became simpler, the dashboard immediately felt more usable. Reducing unnecessary elements didn’t make the dashboard feel empty it made it feel intentional. I realized that simplicity builds user confidence because it removes hesitation and reduces decision fatigue.</p>

            <h3>3. Consistency Creates Familiarity</h3>
            <p>Maintaining consistent spacing, typography, and component styles made a huge difference. Even without realizing it, users rely on patterns to navigate interfaces. When everything follows a predictable structure, interaction becomes smoother and more intuitive.</p>

            <h3>4. Designing Beyond My Own Perspective</h3>
            <p>Another important realization was that I am not the only user. Something that feels obvious to me after hours of development might not be obvious to someone seeing the dashboard for the first time. Thinking from a beginner’s perspective helped me improve labeling, simplify navigation, and avoid assumptions that could confuse users.</p>

            <h3>5. Feedback Makes the Interface Feel Alive</h3>
            <p>Adding small details like hover effects, loading indicators, transitions, and real-time updates improved the perceived responsiveness of the dashboard. These micro-interactions reassured users that their actions were recognized, making the overall experience feel smoother and more polished.</p>

            <h2>Design Habits I Started Practicing</h2>
            <ul>
            <li>Sketching rough layouts before jumping into development</li>
            <li>Grouping related information instead of scattering widgets</li>
            <li>Using whitespace intentionally to avoid visual clutter</li>
            <li>Reviewing dashboards after stepping away to see them with a fresh perspective</li>
            <li>Iterating multiple times instead of expecting the first design to be perfect</li>
            </ul>

            <h2>Personal Reflection</h2>
            <p>Working on dashboard interfaces helped me grow not only in UI design but also in how I think about users and problem-solving. I began to appreciate that good design often goes unnoticed because it simply works. The more effort I put into clarity and usability, the less users had to think about navigating the interface.</p>

            <p>This experience also reinforced the importance of iteration. Some of my best improvements came from redesigning sections I initially thought were already finished. Each revision helped me better understand layout balance, readability, and interaction flow.</p>

            <h2>Conclusion</h2>
            <p>Designing dashboards turned out to be more than just arranging components on a screen it became a learning process about communication, empathy, and intentional design. I learned that an effective dashboard doesn’t try to impress users with complexity but instead supports them through clarity and ease of use. As I continue building projects, I see dashboard design as an evolving skill where every new implementation strengthens both my technical ability and my understanding of user experience.</p>
      `
    },
    'ui-ux-design': {
      title: 'UI and UX Designing',
      date: 'February 23, 2026',
      readTime: '6 min read',
      image: '/images/blogs/UI_UX_Desigining.jpg',
      category: 'Learning',
      content: `
            <h2>Introduction</h2>
            <p>When I first heard about UI and UX design, I honestly thought they were the same thing. I assumed that as long as my application looked clean and modern, the user experience would automatically be good. However, while working on different projects, I slowly realized that a good-looking interface does not always translate to a smooth and enjoyable experience. This realization changed how I approached building applications and made me more intentional about both visual design and usability.</p>

            <p>Learning UI/UX design as a student developer felt like discovering a missing piece in development. It helped me understand why some apps feel effortless to use while others feel frustrating, even if they have similar features. I began to see design not as decoration, but as a way of guiding users, reducing confusion, and making interactions feel natural.</p>

            <h2>Understanding the Difference Between UI and UX</h2>
            <p>Through experience, I learned that UI focuses on how things look — colors, typography, spacing, buttons, and layout — while UX focuses on how things feel when users interact with them. UX is about clarity, flow, and minimizing friction. A project can have an attractive UI but still fail if users struggle to navigate or complete tasks easily.</p>

            <p>This distinction became clearer whenever I redesigned parts of my projects. Sometimes improving spacing, simplifying navigation, or reorganizing content had a bigger impact on usability than adding new visual effects.</p>

            <h2>Lessons I Learned While Practicing UI/UX</h2>

            <h3>1. Simplicity is Harder Than Complexity</h3>
            <p>One of the biggest lessons I learned is that creating a simple interface is actually challenging. As developers, we often want to showcase features, but too many elements can overwhelm users. Removing unnecessary components, simplifying wording, and using whitespace effectively made my interfaces feel calmer and easier to understand.</p>

            <h3>2. Consistency Builds User Trust</h3>
            <p>I noticed that when buttons, colors, and layouts behaved consistently across pages, the application felt more professional and predictable. Users don’t need to relearn interactions when patterns remain familiar. This small detail greatly improved the overall usability of my projects.</p>

            <h3>3. Feedback Prevents Confusion</h3>
            <p>Before learning UI/UX principles, I sometimes forgot to provide feedback for user actions. Buttons would be clicked without any visible response, leaving users unsure if something worked. Adding loading states, hover effects, validation messages, and transitions made interactions feel more responsive and reassuring.</p>

            <h3>4. Designing for Real Users, Not Just Myself</h3>
            <p>I realized that my perspective as the developer is very different from a first-time user. What feels obvious to me after hours of coding might be confusing to someone new. This encouraged me to rethink labels, simplify navigation, and consider how different users approach the interface.</p>

            <h3>5. Small Details Create Big Impact</h3>
            <p>Spacing, alignment, typography balance, and color contrast may seem minor, but they significantly affect readability and comfort. Paying attention to these details helped my interfaces feel more polished without requiring complex design changes.</p>

            <h2>Habits That Helped Me Improve</h2>
            <ul>
            <li>Observing how popular apps structure their interfaces and navigation</li>
            <li>Redesigning parts of my projects instead of settling for the first version</li>
            <li>Sketching layouts before coding to clarify structure and hierarchy</li>
            <li>Asking friends or classmates to try my projects and watching how they interact</li>
            <li>Focusing on clarity first before adding visual enhancements</li>
            <li>Practicing with design tools to better understand layout and spacing control</li>
            </ul>

            <h2>Personal Reflection</h2>
            <p>Learning UI/UX design changed how I think about development as a whole. I started prioritizing the user’s journey rather than just functionality. Instead of asking, “Does this work?”, I began asking, “Is this easy to understand?” and “Does this feel natural to use?”</p>

            <p>This mindset helped me become more patient with iteration. Many improvements came from redesigning sections that technically worked but didn’t feel intuitive. Over time, I realized that good design often goes unnoticed because it removes friction rather than drawing attention to itself.</p>

            <h2>Conclusion</h2>
            <p>UI and UX design became an essential part of my growth as a developer. It taught me that building applications is not only about making features work, but also about making users feel comfortable and confident while using them. As I continue developing projects, I see UI/UX as an ongoing learning process where each experience improves my ability to create interfaces that are both functional and meaningful.</p>
      `
    }
  };

  const blog = blogContent[id];

  if (!blog) {
    return (
      <div className="page">
        <div className="page-content">
          <h1>Blog not found</h1>
          <Link to="/blogs">Back to Blogs</Link>
        </div>
      </div>
    );
  }

  
  return (
    <div className="page blog-detail-page">
      <FloatingBlobBackground />
      <article className="blog-detail">
        <header className="blog-detail-header">
          <Link to="/blogs" className="back-link">
            Back to Blogs
          </Link>
          <div className="blog-detail-title-section">
            <h1>{blog.title}</h1>
            <span className="blog-category">{blog.category}</span>
          </div>
          <div className="blog-detail-meta">
            <span className="blog-date">{blog.date}</span>
            <span className="separator">•</span>
            <span className="blog-read-time">{blog.readTime}</span>
          </div>
        </header>
        <img src={blog.image} alt={blog.title} className="blog-detail-image" />
        <div className="blog-detail-content" dangerouslySetInnerHTML={{ __html: blog.content }} />
      </article>
    </div>
  );
};

export default BlogDetail;
