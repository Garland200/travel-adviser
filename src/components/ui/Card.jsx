import { motion } from 'framer-motion';

export const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' } : {}}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};