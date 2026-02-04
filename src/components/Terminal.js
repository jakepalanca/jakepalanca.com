import ASCIIArt from './ASCIIArt';
import TreeLine from './TreeLine';

const Terminal = () => {
  const publicUrl = process.env.PUBLIC_URL || '';
  const timestamp = new Date().getTime();
  const resumePath = publicUrl ? `${publicUrl}/Jake_Palanca_Resume.pdf?v=${timestamp}` : `/Jake_Palanca_Resume.pdf?v=${timestamp}`;
  const sections = [
    {
      command: 'whoami --verbose',
      output: (
        <div>
          <ASCIIArt />
          <div className="personal-info">
            <div className="info-line">
              <span>
                i study <span className="accent-cyan">computer science</span> at the university of georgia, focus on <span className="accent-cyan">database management</span> with <span className="accent-cyan">java</span>, <span className="accent-cyan">spring</span>, and <span className="accent-cyan">mysql</span>, and build <span className="accent-cyan">swiftui</span> apps in my free time.
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
              <span className="command-link-group">
                <a
                  href={resumePath}
                  download="Jake_Palanca_Resume.pdf"
                  className="command-link"
                >
                  resume
                </a>
                <span className="separator"> · </span>
              </span>
              <span className="command-link-group">
                <a
                  href="https://github.com/jakepalanca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="command-link"
                >
                  github
                </a>
                <span className="separator"> · </span>
              </span>
              <span className="command-link-group">
                <a
                  href="https://linkedin.com/in/jakepalanca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="command-link"
                >
                  linkedin
                </a>
                <span className="separator"> · </span>
              </span>
              <a href="mailto:developer@jakepalanca.com" className="command-link email-box">email</a>
            </div>
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
                  <span className="project-name accent-yellow">cast browser</span>
                  <a
                    href="https://castbrowser.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="command-link"
                  >
                    learn more
                  </a>
                </div>
                <span className="project-meta">
                  <span className="project-type">/* personal project */</span>
                </span>
              </div>
            </div>
            <div className="project-description">
              <div className="project-text">
                swiftui browser app that captures web video streams and casts them to devices.
              </div>
              <div className="project-text project-tech">
                <span className="project-arrow">⟡</span> <span className="accent-cyan">js injection</span>, <span className="accent-cyan">webkit</span>, <span className="accent-cyan">vlckit</span>, <span className="accent-cyan">swiftui</span>, <span className="accent-cyan">airplay</span>, <span className="accent-cyan">cast sdk</span>.
              </div>
            </div>
          </div>

          <div className="project-item">
            <div>
              <div className="project-title-row">
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <span className="project-name accent-yellow">cinema booking website</span>
                  <a
                    href="https://github.com/jakepalanca/Cinema-E-Booking-System"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="command-link"
                  >
                    github repo
                  </a>
                </div>
                <span className="project-meta">
                  <span className="project-type">/* class project */</span>
                </span>
              </div>
            </div>
            <div className="project-description">
              <div className="project-text">
                cinema ticketing app with auth, seat selection, and admin workflows.
              </div>
              <div className="project-text project-tech">
                <span className="project-arrow">⟡</span> <span className="accent-cyan">java</span>, <span className="accent-cyan">spring</span>, <span className="accent-cyan">react</span>, <span className="accent-cyan">js</span>, <span className="accent-cyan">mysql</span>, <span className="accent-cyan">jpa</span>, <span className="accent-cyan">hibernate</span>, <span className="accent-cyan">jwt</span>.
              </div>
            </div>
          </div>

          <div className="project-item">
            <div>
              <div className="project-title-row">
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <span className="project-name accent-yellow">archer bus tracker</span>
                  <a
                    href="https://github.com/jakepalanca/Archer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="command-link"
                  >
                    github repo
                  </a>
                </div>
                <span className="project-meta">
                  <span className="project-type">/* class project */</span>
                </span>
              </div>
            </div>
            <div className="project-description">
              <div className="project-text">
                real-time transit platform with live maps and route tracking.
              </div>
              <div className="project-text project-tech">
                <span className="project-arrow">⟡</span> <span className="accent-cyan">next.js</span>, <span className="accent-cyan">js</span>, <span className="accent-cyan">mongodb</span>, <span className="accent-cyan">maps</span>, <span className="accent-cyan">auth</span>.
              </div>
            </div>
          </div>

          <div className="project-item">
            <div>
              <div className="project-title-row">
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <span className="project-name accent-yellow">tcpdump python cli parser</span>
                </div>
                <span className="project-meta">
                  <span className="project-type">/* class project */</span>
                </span>
              </div>
            </div>
            <div className="project-description">
              <div className="project-text">
                reconstructed hop-by-hop paths from tcpdump/traceroute logs, streaming multi-gb traces and computing per-ttl rtts.
              </div>
              <div className="project-text project-tech">
                <span className="project-arrow">⟡</span> <span className="accent-cyan">python</span>, <span className="accent-cyan">tcpdump</span>, <span className="accent-cyan">cli</span>, <span className="accent-cyan">icmp</span>, <span className="accent-cyan">traceroute</span>.
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
          <TreeLine treeChar="├── " isLast={false}>
            <span className="directory-label">languages/</span>
            <span className="skill-items-inline"> (java, javascript, swift, python)</span>
          </TreeLine>
          <TreeLine treeChar="├── " isLast={false}>
            <span className="directory-label">frameworks/</span>
            <span className="skill-items-inline"> (spring, react, next.js, swiftui)</span>
          </TreeLine>
          <TreeLine treeChar="├── " isLast={false}>
            <span className="directory-label">databases/</span>
            <span className="skill-items-inline"> (mysql, mongodb)</span>
          </TreeLine>
          <TreeLine treeChar="├── " isLast={false}>
            <span className="directory-label">testing/</span>
            <span className="skill-items-inline"> (junit, xctest, mockito)</span>
          </TreeLine>
          <TreeLine treeChar="└── " isLast={true}>
            <span className="directory-label">tools/</span>
            <span className="skill-items-inline"> (git, docker, mysqlworkbench, mongodb atlas, postman)</span>
          </TreeLine>
          <TreeLine treeChar="├── " isNested={true} isLast={false}>
            <span className="directory-label">build-tools/</span>
            <span className="skill-items-inline"> (maven, npm)</span>
          </TreeLine>
          <TreeLine treeChar="└── " isNested={true} isLast={true}>
            <span className="directory-label">aws/</span>
            <span className="skill-items-inline"> (ec2, s3, dynamo db, cloudfront, route 53, lambda, api gateway)</span>
          </TreeLine>
        </div>
      ),
    },
  ];

  return (
    <div className="terminal-container">
      <div className="terminal-content">
        <div className="typing-container">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="completed-section">
              {section.comment && <div className="cli-comment">{section.comment}</div>}
              <div className="cli-section">
                <div className="cli-command">
                  <span className="prompt">jake@macbook-air ~ % </span>
                  <span className="command">{section.command}</span>
                </div>
                <div className="cli-output">
                  {section.output}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Terminal;
