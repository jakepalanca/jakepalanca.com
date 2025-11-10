import ASCIIArt from './ASCIIArt';
import TypingAnimation from './TypingAnimation';

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
                Focusing on networking-focused <span className="accent-cyan">Java</span> development — building <span className="accent-cyan">distributed systems</span> that
                connect and scale.
              </span>
            </div>
            <div className="info-line gpa-line">
              <span>3.61 GPA</span>
              <span className="separator">·</span>
              <span>Graduating Spring 2026</span>
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
      command: 'ls -la ~/projects/ --sort=date --reverse',
      output: (
        <div className="projects-section">
          <div className="project-item">
            <div>
              <div className="project-title-row">
                <span className="project-name accent-yellow">Swiftcast Casting Browser</span>
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
                  Injected a <span className="accent-cyan">JavaScript</span> content script at <span className="accent-cyan">WebView</span> load to observe <span className="accent-cyan">network activity</span> and
                  capture outgoing <span className="accent-cyan">video stream requests</span> in real time.
                </span>
              </div>
              <div className="project-bullet-item">
                <span className="project-bullet">●</span>
                <span className="project-text">
                  Shimmed <span className="accent-cyan">HTML5 media</span> and <span className="accent-cyan">MSE APIs</span> to surface dynamic <span className="accent-cyan">HLS/DASH manifest URLs</span> and blob
                  sources generated via <span className="accent-cyan">Media Source Extensions</span>.
                </span>
              </div>
              <div className="project-bullet-item">
                <span className="project-bullet">●</span>
                <span className="project-text">
                  Parsed request <span className="accent-cyan">URLs</span>, <span className="accent-cyan">headers</span>, and <span className="accent-cyan">payloads</span> client-side and relayed playable streams to
                  <span className="accent-cyan"> Chromecast</span> through the <span className="accent-cyan">Google Cast SDK</span>.
                </span>
              </div>
            </div>
          </div>

          <div className="project-item">
            <div>
              <div className="project-title-row">
                <span className="project-name accent-yellow">Cinema Booking Website</span>
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
                  Tokenized simulated <span className="accent-cyan">payment data</span> and encrypted sensitive columns at rest using a <span className="accent-cyan">JPA @Convert</span>
                  powered by <span className="accent-cyan">Jasypt</span>.
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
                <span className="project-name accent-yellow">TCPdump Parser</span>
                <span className="project-meta">
                  <span className="project-type">Class Project</span>
                </span>
              </div>
            </div>
            <div className="project-description">
              <div className="project-bullet-item">
                <span className="project-bullet">●</span>
                <span className="project-text">
                  Reconstructed hop-by-hop paths by matching outbound <span className="accent-cyan">TCP identifiers</span> and <span className="accent-cyan">TTLs</span> to <span className="accent-cyan">ICMP</span> time
                  exceeded or destination unreachable replies.
                </span>
              </div>
              <div className="project-bullet-item">
                <span className="project-bullet">●</span>
                <span className="project-text">
                  Streamed multi-GB traces with a <span className="accent-cyan">buffered generator pattern</span> to keep memory usage near <span className="accent-cyan">O(1)</span>.
                </span>
              </div>
              <div className="project-bullet-item">
                <span className="project-bullet">●</span>
                <span className="project-text">
                  Computed <span className="accent-cyan">RTTs</span> from <span className="accent-cyan">tcpdump timestamps</span>, aggregated per <span className="accent-cyan">TTL</span>, and supported both <span className="accent-cyan">Unix
                  traceroute</span> plus tcpdump and <span className="accent-cyan">Windows tracert</span> logs.
                </span>
              </div>
            </div>
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
            I'm building <span className="accent-cyan">SwiftCast</span>, a browser that lets you cast any video content by injecting
            <span className="accent-cyan"> JavaScript</span> into <span className="accent-cyan">WebViews</span> to intercept <span className="accent-cyan">HLS/DASH streams</span>, shim <span className="accent-cyan">HTML5 media APIs</span>, and relay
            captured video to <span className="accent-cyan">Chromecast</span> in real time.
          </div>
        </div>
      ),
    },
    {
      command: 'tree ~/skills/',
      output: (
        <div className="cli-list">
          <div className="tree-line">
            <span className="tree-char">~/skills/</span>
          </div>
          <div className="tree-line">
            <span className="tree-char">├── </span>
            <span className="directory-label">languages/</span>
            <span className="skill-items-inline"> (Java, JavaScript, Swift, Python, C)</span>
          </div>
          <div className="tree-line">
            <span className="tree-char">├── </span>
            <span className="directory-label">frameworks/</span>
            <span className="skill-items-inline"> (Spring Boot, React, SwiftUI)</span>
          </div>
          <div className="tree-line">
            <span className="tree-char">├── </span>
            <span className="directory-label">testing/</span>
            <span className="skill-items-inline"> (JUnit, XCTest)</span>
          </div>
          <div className="tree-line">
            <span className="tree-char">└── </span>
            <span className="directory-label">tools/</span>
            <span className="skill-items-inline"> (Git, Google Cast SDK, Jasypt)</span>
          </div>
          <div className="tree-line tree-nested">
            <span className="tree-char">    ├── </span>
            <span className="directory-label">build-tools/</span>
            <span className="skill-items-inline"> (Maven, Gradle, npm)</span>
          </div>
          <div className="tree-line tree-nested">
            <span className="tree-char">    └── </span>
            <span className="directory-label">cloud/</span>
            <span className="skill-items-inline"> (AWS)</span>
          </div>
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
