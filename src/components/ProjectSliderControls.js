const ProjectSliderControls = ({
  projectName,
  activeIndex,
  totalSlides,
  onPrevious,
  onNext,
}) => {
  if (totalSlides <= 1) return null;

  return (
    <div className="project-slider-ui">
      <button
        type="button"
        className="project-slider-btn"
        onClick={onPrevious}
        disabled={activeIndex === 0}
        aria-label={`previous ${projectName} slide`}
      >
        {'[ prev ]'}
      </button>
      <span className="project-slider-track" aria-live="polite" aria-atomic="true">
        {Array.from({ length: totalSlides }, (_, slideIndex) => (
          <span
            key={`${projectName}-marker-${slideIndex}`}
            className={slideIndex === activeIndex ? 'project-slider-marker-active' : 'project-slider-marker'}
          >
            {slideIndex === activeIndex ? `(${slideIndex + 1})` : `${slideIndex + 1}`}
          </span>
        ))}
      </span>
      <button
        type="button"
        className="project-slider-btn"
        onClick={onNext}
        disabled={activeIndex >= totalSlides - 1}
        aria-label={`next ${projectName} slide`}
      >
        {'[ next ]'}
      </button>
    </div>
  );
};

export default ProjectSliderControls;
