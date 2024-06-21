import { Suspense, useEffect, useRef, useState, type React } from "react";

interface IntersectionOptions {
	threshold?: number | number[];
	root?: Element | Document | null;
	rootMargin?: string;
}

interface LazySectionProps extends React.HTMLAttributes<HTMLDivElement> {
	options?: IntersectionOptions;
}

export const LazySection: React.FC<LazySectionProps> = ({
	children,
	options,
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const targetRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		console.log("LazySection mounted", targetRef.current);

		const observerOptions = {
			root: null,
			rootMargin: "0px",
			threshold: 0.1,
			...options,
		};

		const observerCallback = (entries, observer) => {
			entries.forEach((entry) => {
				console.log("Intersection entry:", entry);
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.disconnect();
					console.log("Observer disconnected");
				}
			});
		};

		const observer = new IntersectionObserver(
			observerCallback,
			observerOptions,
		);

		if (targetRef.current) {
			observer.observe(targetRef.current);
			console.log("Observer started observing:", targetRef.current);
		}

		// Cleanup
		return () => {
			if (observer && observer.unobserve && targetRef.current) {
				observer.unobserve(targetRef.current);
				console.log("Observer stopped observing:", targetRef.current);
			}
		};
	}, [options]);

	return (
		<div ref={targetRef}>
			{isVisible && <Suspense fallback={<>Loading...</>}>{children}</Suspense>}
		</div>
	);
};
