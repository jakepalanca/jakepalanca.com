import { useEffect, useRef, useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import ASCIIArt from './ASCIIArt';
import ProjectSliderControls from './ProjectSliderControls';
import TreeLine from './TreeLine';

const ProjectSeparator = () => {
  const containerRef = useRef(null);
  const probeRef = useRef(null);
  const [separatorValue, setSeparatorValue] = useState('+--+');

  useEffect(() => {
    const container = containerRef.current;
    const probe = probeRef.current;
    if (!container || !probe) return;

    const updateSeparator = () => {
      const availableWidth = container.getBoundingClientRect().width;
      const charWidth = probe.getBoundingClientRect().width;

      if (!availableWidth || !charWidth) return;

      const totalChars = Math.max(2, Math.floor(availableWidth / charWidth));
      const nextValue = `+${'-'.repeat(Math.max(0, totalChars - 2))}+`;

      setSeparatorValue((currentValue) => (
        currentValue === nextValue ? currentValue : nextValue
      ));
    };

    updateSeparator();

    const resizeObserver = new ResizeObserver(updateSeparator);
    resizeObserver.observe(container);
    window.addEventListener('resize', updateSeparator);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateSeparator);
    };
  }, []);

  return (
    <div className="project-separator" aria-hidden="true" ref={containerRef}>
      <span className="project-separator-text">{separatorValue}</span>
      <span className="project-separator-probe" ref={probeRef}>-</span>
    </div>
  );
};

const ProjectInfoPanel = ({
  projectType,
  projectName,
  projectHref,
  projectLinkLabel,
  description,
  tech,
}) => (
  <div className="project-info-panel">
    <div className="project-meta">
      <span className="project-type">{projectType}</span>
    </div>
    <div className="project-title-row">
      <div className="project-link-row">
        <span className="project-name accent-yellow">{projectName}</span>
        {projectHref ? (
          <a
            href={projectHref}
            target="_blank"
            rel="noopener noreferrer"
            className="command-link"
          >
            {projectLinkLabel}
          </a>
        ) : null}
      </div>
    </div>
    <div className="project-text">{description}</div>
    <div className="project-text project-tech">
      <span className="project-arrow">⟡</span> {tech}
    </div>
  </div>
);

const ProjectImageSlider = ({
  projectName,
  mediaItems,
  infoCard,
  desktopMediaMode = 'slider',
  sliderClassName = '',
}) => {
  const rowRef = useRef(null);
  const desktopInfoRef = useRef(null);
  const [isMobileViewport, setIsMobileViewport] = useState(() => (
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false
  ));
  const isDesktopSplitView = Boolean(infoCard) && !isMobileViewport;
  const isProjectGridMode = desktopMediaMode === 'grid';
  const isButtonOnlySlider = !isProjectGridMode;
  const isDesktopSliderMode = isDesktopSplitView && !isProjectGridMode;
  const sliderItems = mediaItems;
  const totalSlides = sliderItems.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomActive, setIsZoomActive] = useState(false);
  const [desktopMediaHeight, setDesktopMediaHeight] = useState(null);
  const activeSliderItem = totalSlides > 0
    ? sliderItems[Math.max(0, Math.min(activeIndex, totalSlides - 1))]
    : null;

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const updateViewportState = () => setIsMobileViewport(mediaQuery.matches);
    updateViewportState();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateViewportState);
      return () => mediaQuery.removeEventListener('change', updateViewportState);
    }

    mediaQuery.addListener(updateViewportState);
    return () => mediaQuery.removeListener(updateViewportState);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    if (!isMobileViewport || !isZoomActive) return undefined;

    const handleGesture = (event) => {
      event.preventDefault();
    };
    const handleTouchMove = (event) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    };
    const handleWheel = (event) => {
      if (event.ctrlKey) {
        event.preventDefault();
      }
    };
    document.addEventListener('gesturestart', handleGesture, { passive: false });
    document.addEventListener('gesturechange', handleGesture, { passive: false });
    document.addEventListener('gestureend', handleGesture, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('gesturestart', handleGesture);
      document.removeEventListener('gesturechange', handleGesture);
      document.removeEventListener('gestureend', handleGesture);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('wheel', handleWheel);
    };
  }, [isMobileViewport, isZoomActive]);

  const getSlideElements = (rowElement) => (
    Array.from(rowElement.querySelectorAll('.project-slide'))
  );

  const getClosestSlideIndex = (rowElement, slideElements) => {
    const viewportCenter = rowElement.scrollLeft + (rowElement.clientWidth / 2);
    let nextIndex = 0;
    let minDistance = Number.POSITIVE_INFINITY;

    slideElements.forEach((slideElement, slideIndex) => {
      const slideCenter = slideElement.offsetLeft + (slideElement.offsetWidth / 2);
      const distance = Math.abs(slideCenter - viewportCenter);
      if (distance < minDistance) {
        minDistance = distance;
        nextIndex = slideIndex;
      }
    });

    return nextIndex;
  };

  const scrollToSlide = (targetIndex) => {
    if (!totalSlides) return;

    if (isButtonOnlySlider) {
      const boundedIndex = Math.max(0, Math.min(totalSlides - 1, targetIndex));
      setActiveIndex(boundedIndex);
      return;
    }

    const rowElement = rowRef.current;
    if (!rowElement) return;

    const slideElements = getSlideElements(rowElement);
    if (!slideElements.length) return;

    const boundedIndex = Math.max(0, Math.min(slideElements.length - 1, targetIndex));
    const maxScrollLeft = Math.max(0, rowElement.scrollWidth - rowElement.clientWidth);
    const targetScrollLeft = Math.min(slideElements[boundedIndex].offsetLeft, maxScrollLeft);

    rowElement.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth',
    });
    setActiveIndex(boundedIndex);
  };

  useEffect(() => {
    if (isButtonOnlySlider || isProjectGridMode) return;

    const rowElement = rowRef.current;
    if (!rowElement) return;

    const updateActiveIndex = () => {
      const slideElements = getSlideElements(rowElement);
      if (!slideElements.length) return;

      const nextIndex = getClosestSlideIndex(rowElement, slideElements);

      setActiveIndex((currentIndex) => (
        currentIndex === nextIndex ? currentIndex : nextIndex
      ));
    };

    let frameId = 0;
    const handleScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(updateActiveIndex);
    };

    const resizeObserver = new ResizeObserver(updateActiveIndex);
    resizeObserver.observe(rowElement);
    getSlideElements(rowElement).forEach((slideElement) => resizeObserver.observe(slideElement));

    rowElement.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateActiveIndex);
    updateActiveIndex();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(frameId);
      rowElement.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateActiveIndex);
    };
  }, [isButtonOnlySlider, isProjectGridMode, sliderItems.length]);

  useEffect(() => {
    setActiveIndex((currentIndex) => (
      Math.max(0, Math.min(totalSlides - 1, currentIndex))
    ));
  }, [totalSlides]);

  useEffect(() => {
    if (!isDesktopSplitView) {
      setDesktopMediaHeight(null);
      return undefined;
    }

    const infoElement = desktopInfoRef.current;
    if (!infoElement) return undefined;

    const updateDesktopMediaHeight = () => {
      const computedStyles = window.getComputedStyle(infoElement);
      const lineHeight = Number.parseFloat(computedStyles.lineHeight);
      const fontSize = Number.parseFloat(computedStyles.fontSize);
      const effectiveLineHeight = Number.isFinite(lineHeight) && lineHeight > 0
        ? lineHeight
        : (Number.isFinite(fontSize) && fontSize > 0 ? fontSize * 1.4 : 0);
      const measuredHeight = Math.max(0, infoElement.getBoundingClientRect().height);
      const snappedHeight = effectiveLineHeight > 0
        ? Math.max(effectiveLineHeight, Math.ceil(measuredHeight / effectiveLineHeight) * effectiveLineHeight)
        : measuredHeight;
      const nextHeight = Number(snappedHeight.toFixed(2));
      setDesktopMediaHeight((currentHeight) => (
        currentHeight === nextHeight ? currentHeight : nextHeight
      ));
    };

    updateDesktopMediaHeight();

    const resizeObserver = new ResizeObserver(updateDesktopMediaHeight);
    resizeObserver.observe(infoElement);

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateDesktopMediaHeight);
    }

    return () => {
      resizeObserver.disconnect();
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', updateDesktopMediaHeight);
      }
    };
  }, [isDesktopSplitView]);

  const desktopRowStyle = isDesktopSplitView && desktopMediaHeight
    ? { '--desktop-project-media-max-height': `${desktopMediaHeight}px` }
    : undefined;
  const showSliderControls = isButtonOnlySlider && totalSlides > 1;

  const renderMediaItem = (mediaItem, mediaIndex) => {
    if (mediaItem.type === 'info') {
      return mediaItem.content;
    }

    if (mediaItem.type === 'video') {
      return (
        <iframe
          src={mediaItem.src}
          title={mediaItem.title || `${projectName} video ${mediaIndex + 1}`}
          className="project-video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      );
    }

    return (
      <Zoom
        classDialog="project-image-zoom-dialog"
        zoomMargin={isMobileViewport ? 8 : 24}
        canSwipeToUnzoom={!isMobileViewport}
        onZoomChange={(isZoomed) => setIsZoomActive(isZoomed)}
      >
        <img
          src={mediaItem.src}
          alt={mediaItem.alt || `${projectName} project image ${mediaIndex + 1}`}
          className="project-image project-image-focusable"
          loading="lazy"
        />
      </Zoom>
    );
  };

  const getSlideClassName = (mediaItem) => {
    const classes = ['project-slide'];

    if (mediaItem.type === 'info') classes.push('project-slide-info');
    if (mediaItem.type === 'image') classes.push('project-slide-image');
    if (mediaItem.type === 'video') classes.push('project-slide-video');

    return classes.join(' ');
  };

  return (
    <div className={`project-image-slider${isDesktopSplitView ? ' project-image-slider-split' : ''}${sliderClassName ? ` ${sliderClassName}` : ''}`}>
      {isDesktopSplitView ? (
        <div className="project-info-desktop" ref={desktopInfoRef}>
          {infoCard}
        </div>
      ) : null}
      <div className="project-media-pane">
        <div
          className={`project-image-row media-count-${sliderItems.length}${isMobileViewport && isZoomActive ? ' project-image-row-locked' : ''}${isDesktopSliderMode ? ' project-image-row-desktop-slider' : ''}${isButtonOnlySlider ? ' project-image-row-button-only' : ''}${isProjectGridMode ? ' project-image-row-desktop-grid' : ''}`}
          ref={rowRef}
          style={desktopRowStyle}
        >
          {isButtonOnlySlider ? (
            activeSliderItem ? (
              <div className={getSlideClassName(activeSliderItem)}>
                {renderMediaItem(activeSliderItem, activeIndex)}
              </div>
            ) : null
          ) : sliderItems.map((mediaItem, mediaIndex) => (
            <div
              className={getSlideClassName(mediaItem)}
              key={`${projectName}-${mediaIndex}`}
            >
              {renderMediaItem(mediaItem, mediaIndex)}
            </div>
          ))}
        </div>
        {showSliderControls ? (
          <ProjectSliderControls
            projectName={projectName}
            activeIndex={activeIndex}
            totalSlides={totalSlides}
            onPrevious={() => scrollToSlide(activeIndex - 1)}
            onNext={() => scrollToSlide(activeIndex + 1)}
          />
        ) : null}
      </div>
      {infoCard && isMobileViewport ? (
        <div className="project-info-mobile">
          {infoCard}
        </div>
      ) : null}
    </div>
  );
};

const Terminal = () => {
  const publicUrl = process.env.PUBLIC_URL || '';
  const timestamp = new Date().getTime();
  const resumePath = publicUrl ? `${publicUrl}/Jake_Palanca_Software_Developer_Resume.pdf?v=${timestamp}` : `/Jake_Palanca_Software_Developer_Resume.pdf?v=${timestamp}`;
  const getPublicAssetPath = (assetPath) => {
    const normalizedPath = encodeURI(assetPath.replace(/^\/+/, ''));
    return publicUrl ? `${publicUrl}/${normalizedPath}` : `/${normalizedPath}`;
  };

  const defaultProjectImagePath = getPublicAssetPath('image.png');
  const bulldogImagePath = getPublicAssetPath('minecraft_ai_builder/bulldog.png');
  const castScreenshot1Path = getPublicAssetPath('cast/IMG_0034.PNG');
  const castScreenshot2Path = getPublicAssetPath('cast/IMG_0035.PNG');
  const castScreenshot3Path = getPublicAssetPath('cast/IMG_0036.PNG');
  const cinemaScreenshot1Path = getPublicAssetPath('cinema/screenshot1.png');
  const cinemaScreenshot2Path = getPublicAssetPath('cinema/screenshot2.png');
  const archerScreenshot1Path = getPublicAssetPath('archer/screenshot1.png');
  const archerScreenshot2Path = getPublicAssetPath('archer/screenshot2.png');
  const defaultProjectMediaItems = [
    { type: 'image', src: defaultProjectImagePath },
    { type: 'image', src: defaultProjectImagePath },
    { type: 'image', src: defaultProjectImagePath },
  ];
  const castMediaItems = [
    { type: 'image', src: castScreenshot1Path, alt: 'cast browser ios screenshot 1' },
    { type: 'image', src: castScreenshot2Path, alt: 'cast browser ios screenshot 2' },
    { type: 'image', src: castScreenshot3Path, alt: 'cast browser ios screenshot 3' },
  ];
  const aiMinecraftBuilderMediaItems = [
    {
      type: 'video',
      src: 'https://www.youtube.com/embed/W-_3LJiAUyk',
      title: 'ai minecraft builder demo',
    },
    {
      type: 'image',
      src: bulldogImagePath,
      alt: 'bulldog 3d model output',
    },
    {
      type: 'image',
      src: getPublicAssetPath('minecraft_ai_builder/dinosaur.png'),
      alt: 'dinosaur 3d model output',
    },
  ];
  const cinemaMediaItems = [
    { type: 'image', src: cinemaScreenshot1Path, alt: 'cinema booking screenshot 1' },
    { type: 'image', src: cinemaScreenshot2Path, alt: 'cinema booking screenshot 2' },
    { type: 'image', src: getPublicAssetPath('cinema/screenshot3.png'), alt: 'cinema booking screenshot 3' },
  ];
  const archerMediaItems = [
    { type: 'image', src: archerScreenshot1Path, alt: 'archer bus tracker screenshot 1' },
    { type: 'image', src: archerScreenshot2Path, alt: 'archer bus tracker screenshot 2' },
    { type: 'image', src: getPublicAssetPath('archer/screenshot3.png'), alt: 'archer bus tracker screenshot 3' },
  ];
  const renderProjectImages = (
    projectName,
    mediaItems = defaultProjectMediaItems,
    infoCard = null,
    desktopMediaMode = 'slider',
    sliderClassName = '',
  ) => (
    <ProjectImageSlider
      projectName={projectName}
      mediaItems={mediaItems}
      infoCard={infoCard}
      desktopMediaMode={desktopMediaMode}
      sliderClassName={sliderClassName}
    />
  );
  const sections = [
    {
      command: 'whoami --verbose',
      output: (
        <div>
          <ASCIIArt />
        </div>
      ),
    },
    {
      command: 'help --about-me',
      output: (
        <div className="external-links-left">
          <div className="command-item">
            <div className="command-content">
              <div className="personal-info">
                <div className="info-line">
                  <span>
                    i study <span className="accent-cyan">computer science</span> at the university of georgia, focus on <span className="accent-cyan">database management</span> with <span className="accent-cyan">java</span>, <span className="accent-cyan">spring</span>, and <span className="accent-cyan">mysql</span>, and build <span className="accent-cyan">swiftui</span> apps in my free time.
                  </span>
                  <br />
                </div>
              </div>
              <div className="about-links-grid">
                <a
                  href={resumePath}
                  download="Jake_Palanca_Software_Developer_Resume.pdf"
                  className="command-link link-cyan"
                >
                  download resume
                </a>
                <a
                  href="https://github.com/jakepalanca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="command-link link-blue"
                >
                  visit github
                </a>
                <a
                  href="https://linkedin.com/in/jakepalanca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="command-link link-pink"
                >
                  visit linkedin
                </a>
                <a href="mailto:developer@jakepalanca.com" className="command-link email-box link-yellow">email me</a>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      command: 'ls -la ~/projects/ --sort=date --reverse',
      output: (
        <div className="projects-section">
          <ProjectSeparator />

          <div className="project-item">
            {renderProjectImages(
              'cast browser',
              castMediaItems,
              (
                <ProjectInfoPanel
                  projectType={'/* personal project */'}
                  projectName="cast browser"
                  projectHref="https://castbrowser.com"
                  projectLinkLabel="learn more"
                  description="ongoing swiftui browser app with a wkwebview + js-injection pipeline that detects video streams, captures request metadata, and prepares on-device playback. integrated a local proxy + vlckit fallback and a unified airplay/google cast flow so protected streams can still play reliably."
                  tech={(
                    <>
                      <span className="accent-cyan">js injection</span>, <span className="accent-cyan">webkit</span>, <span className="accent-cyan">vlckit</span>, <span className="accent-cyan">swiftui</span>, <span className="accent-cyan">airplay</span>, <span className="accent-cyan">cast sdk</span>.
                    </>
                  )}
                />
              ),
              'grid',
            )}
          </div>

          <ProjectSeparator />

          <div className="project-item">
            {renderProjectImages(
              'ai minecraft builder',
              aiMinecraftBuilderMediaItems,
              (
                <ProjectInfoPanel
                  projectType={'/* team hackathon project */'}
                  projectName="ai minecraft builder"
                  projectHref="https://github.com/jakepalanca/ai-minecraft-builder"
                  projectLinkLabel="github repo"
                  description="team hackathon project that deployed hunyuan3d 2.1 on a cost-efficient sagemaker endpoint to generate textured meshes from one image and upload results to s3. architected lambda-based workers for orchestration and shipped cloudformation deployment with documentation so others can self-host."
                  tech={(
                    <>
                      <span className="accent-cyan">sagemaker</span>, <span className="accent-cyan">hunyuan3d</span>, <span className="accent-cyan">lambda</span>, <span className="accent-cyan">s3</span>, <span className="accent-cyan">cloudformation</span>, <span className="accent-cyan">python</span>.
                    </>
                  )}
                />
              ),
              'slider',
              'project-image-slider-ai-minecraft',
            )}
          </div>

          <ProjectSeparator />

          <div className="project-item">
            {renderProjectImages(
              'cinema booking website',
              cinemaMediaItems,
              (
                <ProjectInfoPanel
                  projectType={'/* class project */'}
                  projectName="cinema booking website"
                  projectHref="https://github.com/jakepalanca/Cinema-E-Booking-System"
                  projectLinkLabel="github repo"
                  description="class full-stack cinema app built with spring boot rest apis and spring data jpa/hibernate for persistence, including seat selection, inventory holds, and admin workflows. implemented spring security + jwt authentication and additional field-level encryption/decryption for sensitive data protection."
                  tech={(
                    <>
                      <span className="accent-cyan">java</span>, <span className="accent-cyan">spring</span>, <span className="accent-cyan">react</span>, <span className="accent-cyan">js</span>, <span className="accent-cyan">mysql</span>, <span className="accent-cyan">jpa</span>, <span className="accent-cyan">hibernate</span>, <span className="accent-cyan">jwt</span>.
                    </>
                  )}
                />
              ),
            )}
          </div>

          <ProjectSeparator />

          <div className="project-item">
            {renderProjectImages(
              'archer bus tracker',
              archerMediaItems,
              (
                <ProjectInfoPanel
                  projectType={'/* class project */'}
                  projectName="archer bus tracker"
                  projectHref="https://github.com/jakepalanca/Archer"
                  projectLinkLabel="github repo"
                  description="team project for csci 4300 built with next.js and mongodb, with responsive navigation, protected routes, and features like live route tracking plus saved/recent places. implemented core api routes and data models for bets, places, and transit data with nextauth-based authentication."
                  tech={(
                    <>
                      <span className="accent-cyan">next.js</span>, <span className="accent-cyan">js</span>, <span className="accent-cyan">mongodb</span>, <span className="accent-cyan">maps</span>, <span className="accent-cyan">auth</span>.
                    </>
                  )}
                />
              ),
            )}
          </div>

          <ProjectSeparator />
        </div>
      ),
    },
    {
      command: 'tree ./skills/',
      output: (
        <div className="cli-list">
          <TreeLine treeChar="" isLast={false}>
            <span className="directory-label">./skills/</span>
          </TreeLine>
          <TreeLine treeChar="├── " isNested={true} isLast={false}>
            <span className="directory-label">languages/</span>
            <span className="skill-items-inline"> (java, javascript, swift, python)</span>
          </TreeLine>
          <TreeLine treeChar="├── " isNested={true} isLast={false}>
            <span className="directory-label">frameworks/</span>
            <span className="skill-items-inline"> (spring, react, next.js, swiftui)</span>
          </TreeLine>
          <TreeLine treeChar="├── " isNested={true} isLast={false}>
            <span className="directory-label">databases/</span>
            <span className="skill-items-inline"> (mysql, mongodb)</span>
          </TreeLine>
          <TreeLine treeChar="├── " isNested={true} isLast={false}>
            <span className="directory-label">testing/</span>
            <span className="skill-items-inline"> (junit, xctest, mockito)</span>
          </TreeLine>
          <TreeLine treeChar="└── " isNested={true} isLast={true}>
            <span className="directory-label">tools/</span>
            <span className="skill-items-inline"> (git, docker, mysqlworkbench, mongodb atlas)</span>
          </TreeLine>
          <TreeLine treeChar="    ├── " isNested={true} isLast={false}>
            <span className="directory-label">build-tools/</span>
            <span className="skill-items-inline"> (maven, npm)</span>
          </TreeLine>
          <TreeLine treeChar="    └── " isNested={true} isLast={true}>
            <span className="directory-label">aws/</span>
            <span className="skill-items-inline"> (ec2, s3, dynamodb, cloudfront, sagemaker, lambda, api gateway)</span>
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
