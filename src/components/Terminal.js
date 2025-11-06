import ASCIIArt from './ASCIIArt';
import TypingAnimation from './TypingAnimation';

const Terminal = () => {
  const sections = [
    {
      command: 'whoami --verbose',
      output: (
        <div>
          <ASCIIArt />
          <div className="personal-info">
            <div className="info-line">
              <span className="comment-inline">I'm studying</span>
              <span className="accent-cyan">
                <strong>Computer Science</strong>
              </span>
              <span className="comment-inline">at the</span>
              <strong>University of Georgia</strong>
              <span className="accent-cyan">(3.66 GPA, Expected Graduation: May 2026)</span>
            </div>
            <div className="info-line">
              <span className="comment-inline">Focusing on</span>
              <span className="accent-yellow">
                <em>networking-focused Java development</em>
              </span>
              <span className="comment-inline">— building</span>
              <span className="accent-purple">
                <strong>distributed systems</strong>
              </span>
              <span className="comment-inline">that</span>
              <span className="accent-purple">
                <strong>connect</strong>
              </span>
              <span className="comment-inline">and</span>
              <span className="accent-purple">
                <strong>scale</strong>
              </span>
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
              <a href="/resume.pdf" download="Jake_Palanca_Resume.pdf" className="command-link">
                <strong>resume.pdf</strong>
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
                <strong>github.com/jakepalanca</strong>
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
                <strong>linkedin.com/in/jakepalanca</strong>
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
            <div className="project-header">
              <div className="project-title-row">
                <span className="project-name accent-cyan">SwiftCast</span>
                <span className="project-meta">
                  <span className="project-type">Casting Browser</span>
                  <span className="project-status accent-green">(Ongoing)</span>
                </span>
              </div>
            </div>
            <div className="project-description">
              <div className="project-bullet-item">
                <span className="project-bullet accent-purple">●</span>
                <span className="project-text">
                  Injected <strong>JavaScript content script</strong> at page load in WebView to
                  observe in-page network activity and capture outgoing{' '}
                  <em>video stream requests</em> in real time
                </span>
              </div>
              <div className="project-bullet-item">
                <span className="project-bullet accent-yellow">●</span>
                <span className="project-text">
                  Shimmed <strong>HTML5 media/MSE APIs</strong> to surface dynamic{' '}
                  <span className="accent-cyan">HLS/DASH manifest URLs</span> and blob: sources
                  generated via Media Source Extensions
                </span>
              </div>
              <div className="project-bullet-item">
                <span className="project-bullet accent-cyan">●</span>
                <span className="project-text">
                  Parsed request URLs/headers/payloads client-side and relayed playable streams to{' '}
                  <strong>Chromecast</strong> using the <em>Google Cast SDK</em>
                </span>
              </div>
            </div>
          </div>

          <div className="project-item">
            <div className="project-header">
              <div className="project-title-row">
                <span className="project-name accent-yellow">Cinema Booking Website</span>
                <span className="project-meta">
                  <span className="project-type">Class Project</span>
                </span>
              </div>
            </div>
            <div className="project-description">
              <div className="project-bullet-item">
                <span className="project-bullet accent-purple">●</span>
                <span className="project-text">
                  Built end-to-end <strong>login/forgot/reset flows</strong> wired to Spring Boot
                  endpoints, coordinating UI state with <em>React Router</em>
                </span>
              </div>
              <div className="project-bullet-item">
                <span className="project-bullet accent-yellow">●</span>
                <span className="project-text">
                  Encrypted sensitive <strong>payment fields at rest</strong> using custom JPA
                  IntegerCryptoConverter (<span className="accent-yellow">Jasypt</span>) applied via
                  @Convert on CVV/ZIP columns
                </span>
              </div>
              <div className="project-bullet-item">
                <span className="project-bullet accent-cyan">●</span>
                <span className="project-text">
                  Implemented <strong>token-validated password reset</strong> that POSTs to
                  /reset-password and routes users back to login screen on success
                </span>
              </div>
            </div>
          </div>

          <div className="project-item">
            <div className="project-header">
              <div className="project-title-row">
                <span className="project-name accent-purple">TCPdump Parser</span>
                <span className="project-meta">
                  <span className="project-type">Class Project</span>
                </span>
              </div>
            </div>
            <div className="project-description">
              <div className="project-bullet-item">
                <span className="project-bullet accent-purple">●</span>
                <span className="project-text">
                  Reconstructed <strong>hop-by-hop paths</strong> by matching outbound TCP (id/TTL)
                  to ICMP "time exceeded"/"destination unreachable" replies
                </span>
              </div>
              <div className="project-bullet-item">
                <span className="project-bullet accent-yellow">●</span>
                <span className="project-text">
                  Streamed <strong>multi-GB traces</strong> with buffered generator pattern to keep
                  memory <em>O(1)</em>
                </span>
              </div>
              <div className="project-bullet-item">
                <span className="project-bullet accent-cyan">●</span>
                <span className="project-text">
                  Computed <strong>RTTs from tcpdump timestamps</strong>, aggregated per-TTL, and
                  supported both Unix traceroute+tcpdump and Windows tracert logs
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
          <div className="current-project-header">
            <span className="comment-inline"># What am I up to? </span>
          </div>
          <div className="current-project-desc">
            I'm building <strong>SwiftCast</strong>, a browser that let's you cast any video content
            by injecting <span className="accent-yellow">JavaScript into WebViews</span> to
            intercept{' '}
            <span className="accent-cyan">
              <strong>HLS/DASH streams</strong>
            </span>
            , shimming <em>HTML5 media APIs</em> and relaying captured video to{' '}
            <span className="accent-purple">
              <strong>Chromecast</strong>
            </span>{' '}
            in real-time.
          </div>
        </div>
      ),
    },
    {
      command: 'ls -la ~/skills/ --sort=proficiency --color=always',
      output: (
        <div className="cli-list">
          <div className="skill-category tech-stack-row-1">
            <span className="file-type">drwxr-xr-x</span> <strong>languages/</strong>
            <div className="skill-items">
              <span>
                <strong>Java</strong>
              </span>
              ,
              <span>
                <strong>JavaScript</strong>
              </span>
              ,
              <span>
                <strong>Swift</strong>
              </span>
              ,
              <span>
                <strong>Python</strong>
              </span>
              ,
              <span>
                <strong>C</strong>
              </span>
            </div>
          </div>
          <div className="skill-category tech-stack-row-2">
            <span className="file-type">drwxr-xr-x</span> <strong>frameworks/</strong>
            <div className="skill-items">
              <span>
                <strong>Spring Boot</strong>
              </span>
              ,
              <span>
                <strong>React</strong>
              </span>
              ,
              <span>
                <strong>SwiftUI</strong>
              </span>
            </div>
          </div>
          <div className="skill-category tech-stack-row-3">
            <span className="file-type">drwxr-xr-x</span> <strong>cloud-tools/</strong>
            <div className="skill-items">
              <span>
                <strong>AWS</strong>
              </span>
              ,
              <span>
                <strong>Git</strong>
              </span>
              ,
              <span>
                <strong>Google Cast SDK</strong>
              </span>
              ,
              <span>
                <strong>Jasypt</strong>
              </span>
            </div>
          </div>
          <div className="skill-category tech-stack-row-4">
            <span className="file-type">drwxr-xr-x</span> <strong>testing/</strong>
            <div className="skill-items">
              <span>
                <strong>JUnit</strong>
              </span>
              ,
              <span>
                <strong>XCTest</strong>
              </span>
            </div>
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
