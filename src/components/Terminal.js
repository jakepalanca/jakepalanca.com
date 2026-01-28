import ASCIIArt from './ASCIIArt';
import TypingAnimation from './TypingAnimation';
import TreeLine from './TreeLine';

const Terminal = () => {
  // Construct resume path - PUBLIC_URL defaults to empty string in Create React App
  const publicUrl = process.env.PUBLIC_URL || '';
  const resumePath = publicUrl ? `${publicUrl}/Jake_Palanca_Resume.pdf` : '/Jake_Palanca_Resume.pdf';
  const sections = [
    {
      command: 'whoami --verbose',
      output: (
        <div>
          <ASCIIArt />
          <div className="personal-info">
            <div className="info-line">
              <span>I'm studying</span>
              <span className="accent-cyan">Computer Science</span>
              <span>at the University of Georgia.</span>
            </div>
            <div className="info-line">
              <span>
                Focusing on <span className="accent-cyan">database management</span> using <span className="accent-cyan">Java</span>, <span className="accent-cyan">Spring</span> and <span className="accent-cyan">MySQL</span>.
                I also build <span className="accent-cyan">SwiftUI</span> apps in my free time.
              </span>
            </div>
            <div className="info-line gpa-line">
              <span className="highlight-box box-cyan">3.6 GPA</span>
              <span className="highlight-box box-yellow">Graduating Spring 2026</span>
              <a href="mailto:developer@jakepalanca.com" className="highlight-box box-green email-box">developer@jakepalanca.com</a>
            </div>
          </div>
        </div>
      ),
    },
    {
      command: 'help --list-external-links',
      output: (
        <div className="external-links-left">
          <div className="command-item">
            <div className="command-content">
              <span className="command-name accent-purple">wget</span>
              <a
                href={resumePath}
                download="Jake_Palanca_Resume.pdf"
                className="command-link"
              >
                Jake_Palanca_Resume.pdf
              </a>
            </div>
            <span className="command-desc"> # Download my resume</span>
          </div>
          <div className="command-item">
            <div className="command-content">
              <span className="command-name accent-cyan">curl</span>
              <a
                href="https://github.com/jakepalanca"
                target="_blank"
                rel="noopener noreferrer"
                className="command-link"
              >
                https://github.com/jakepalanca
              </a>
            </div>
            <span className="command-desc"> # View my code repositories</span>
          </div>
          <div className="command-item">
            <div className="command-content">
              <span className="command-name accent-yellow">ssh</span>
              <a
                href="https://linkedin.com/in/jakepalanca"
                target="_blank"
                rel="noopener noreferrer"
                className="command-link"
              >
                https://linkedin.com/in/jakepalanca
              </a>
            </div>
            <span className="command-desc"> # Connect professionally </span>
          </div>
        </div>
      ),
    },
    {
      command: 'cat ~/current-focus.txt',
      output: (
        <div className="current-focus-section">
          <div>
            <span className="comment-inline"># What am I up to? </span>
          </div>
          <div className="current-project-desc">
            I'm building <span className="accent-cyan">Cast</span>, a browser that uses <span className="accent-cyan">JavaScript injection</span> to bridge <span className="accent-cyan">WebKit</span> internals with <span className="accent-cyan">VLCKit</span> for on-device HLS conversion and casting.
          </div>
        </div>
      ),
    },
    {
      command: 'ls -la ~/projects/ --sort=date --reverse',
      output: (
        <div className="projects-section">
          <div className="project-item">
            <div>
              <div className="project-title-row">
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <span className="project-name accent-yellow">Cast</span>
                  <a
                    href="https://castbrowser.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="command-link yellow"
                  >
                    (castbrowser.com)
                  </a>
                </div>
                <span className="project-meta">
                  <span className="project-type">Personal Project</span>
                  <span className="project-status accent-purple">(Ongoing)</span>
                </span>
              </div>
            </div>
            <div className="project-description">
              <div className="project-bullet-item">
                <span className="project-bullet">●</span>
                <span className="project-text">
                  Injects custom <span className="accent-cyan">JavaScript</span> into <span className="accent-cyan">WebViews</span> to intercept and analyze network traffic for media streams.
                </span>
              </div>
              <div className="project-bullet-item">
                <span className="project-bullet">●</span>
                <span className="project-text">
                  Leverages <span className="accent-cyan">VLCKit</span> for on-device conversion to <span className="accent-cyan">HLS</span>, ensuring broad stream compatibility.
                </span>
              </div>
              <div className="project-bullet-item">
                <span className="project-bullet">●</span>
                <span className="project-text">
                  Enables seamless casting to <span className="accent-cyan">AirPlay</span> and <span className="accent-cyan">Chromecast</span> devices from any web video.
                </span>
              </div>
            </div>
          </div>

          <div className="project-item">
            <div>
              <div className="project-title-row">
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <span className="project-name accent-yellow">Cinema Booking Website</span>
                  <a
                    href="https://github.com/jakepalanca/Cinema-E-Booking-System"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="command-link yellow"
                  >
                    (GitHub)
                  </a>
                </div>
                <span className="project-meta">
                  <span className="project-type">Class Project</span>
                </span>
              </div>
            </div>
            <div className="project-description">
              <div className="project-bullet-item">
                <span className="project-bullet">●</span>
                <span className="project-text">
                  Shipped <span className="accent-cyan">auth flows</span> (login, forgot, reset) with <span className="accent-cyan">token validation</span>, <span className="accent-cyan">bcrypt-hashed passwords</span>,
                  and <span className="accent-cyan">JWT</span> expiry plus invalidations.
                </span>
              </div>
              <div className="project-bullet-item">
                <span className="project-bullet">●</span>
                <span className="project-text">
                  Tokenized simulated <span className="accent-cyan">payment data</span> and encrypted sensitive columns at rest using a <span className="accent-cyan">JPA</span>{' '}<span className="accent-cyan">@Convert</span>{' '}powered by <span className="accent-cyan">Jasypt</span>.
                </span>
              </div>
              <div className="project-bullet-item">
                <span className="project-bullet">●</span>
                <span className="project-text">
                  Implemented <span className="accent-cyan">seat selection</span>, <span className="accent-cyan">inventory holds</span>, and admin tooling with <span className="accent-cyan">input validation</span> and
                  basic <span className="accent-cyan">rate limiting</span>.
                </span>
              </div>
            </div>
          </div>

          <div className="project-item">
            <div>
              <div className="project-title-row">
                <span className="project-name accent-yellow">Archer</span>
                <span className="project-meta">
                  <span className="project-type">Class Project</span>
                </span>
              </div>
            </div>
            <div className="project-description">
              <div className="project-bullet-item">
                <span className="project-bullet">●</span>
                <span className="project-text">
                  Shipped a real-time transit platform using <span className="accent-cyan">Next.js</span> and <span className="accent-cyan">MongoDB</span>, featuring interactive <span className="accent-cyan">maps</span> and live <span className="accent-cyan">bus route tracking</span>.
                </span>
              </div>
              <div className="project-bullet-item">
                <span className="project-bullet">●</span>
                <span className="project-text">
                  Built a unique <span className="accent-cyan">capacity betting system</span> allowing users to predict and crowdsource bus fullness levels.
                </span>
              </div>
              <div className="project-bullet-item">
                <span className="project-bullet">●</span>
                <span className="project-text">
                  Implemented robust <span className="accent-cyan">user authentication</span> via middleware, supporting <span className="accent-cyan">protected routes</span> and personalized <span className="accent-cyan">saved locations</span>.
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      command: 'tree ~/skills/',
      output: (
        <div className="cli-list">
          <div className="tree-line tree-header">
            <span className="tree-char">~/skills/</span>
          </div>
          <TreeLine treeChar="├── " isLast={false}>
            <span className="directory-label">languages/</span>
            <span className="skill-items-inline"> (Java, JavaScript, Swift, Python, C)</span>
          </TreeLine>
          <TreeLine treeChar="├── " isLast={false}>
            <span className="directory-label">frameworks/</span>
            <span className="skill-items-inline"> (Spring Boot, React, Next.js, SwiftUI)</span>
          </TreeLine>
          <TreeLine treeChar="├── " isLast={false}>
            <span className="directory-label">databases/</span>
            <span className="skill-items-inline"> (MongoDB, MySQL)</span>
          </TreeLine>
          <TreeLine treeChar="├── " isLast={false}>
            <span className="directory-label">testing/</span>
            <span className="skill-items-inline"> (JUnit, XCTest)</span>
          </TreeLine>
          <TreeLine treeChar="└── " isLast={true}>
            <span className="directory-label">tools/</span>
            <span className="skill-items-inline"> (Git, Docker, Google Cast SDK, Jasypt)</span>
          </TreeLine>
          <TreeLine treeChar="├── " isNested={true} isLast={false}>
            <span className="directory-label">build-tools/</span>
            <span className="skill-items-inline"> (Maven, Gradle, npm)</span>
          </TreeLine>
          <TreeLine treeChar="└── " isNested={true} isLast={true}>
            <span className="directory-label">cloud/</span>
            <span className="skill-items-inline"> (AWS)</span>
          </TreeLine>
        </div>
      ),
    },
  ];

  return (
    <div className="terminal-container">
      <div className="terminal-content">
        <TypingAnimation sections={sections} typingSpeed={30} sectionDelay={800} />
      </div>
    </div>
  );
};

export default Terminal;
