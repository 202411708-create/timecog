import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export default function Card({ children, className = '', animate = true }: CardProps) {
  const Wrapper = animate ? motion.div : 'div';

  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.3 },
      }
    : {};

  return (
    <Wrapper
      className={`bg-white rounded-2xl shadow-sm border border-muji-beige p-8 ${className}`}
      {...animationProps}
    >
      {children}
    </Wrapper>
  );
}
