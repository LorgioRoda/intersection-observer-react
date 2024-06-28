import { useState, useRef, useEffect, React } from "react";

interface LazySectionProps extends React.HTMLAttributes<HTMLDivElement> {
  options?: IntersectionOptions;
}

interface IntersectionOptions {
  threshold?: number | number[];
  root?: Element | Document | null;
  rootMargin?: string;
}

interface LazyComponentProps {
  options: IntersectionOptions,
  children: React.Element | React.Element[],
  Loading?: React.Element | string
}

export const LazyComponent: React.FC<LazySectionProps> = ({ children, options, Loading = 'Loading...' }: LazyComponentProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: options?.root || null,
      rootMargin: options?.rootMargin || "0px",
      threshold: options?.threshold || 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    // Cleanup
    return () => {
      if (observer && targetRef.current) {
        observer.unobserve(targetRef.current);
        observer.disconnect();
      }
    };
  }, [options]);

  return <div ref={targetRef}>{isVisible ? children : <><Loading/></>}</div>;
};
