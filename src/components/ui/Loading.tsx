import { motion } from 'motion/react';
import { Leaf } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-[#fcfbf7] flex flex-col items-center justify-center space-y-6">
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
        }}
        className="text-[#1f3d2b]"
      >
        <Leaf size={48} />
      </motion.div>
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-serif font-bold text-[#1f3d2b] tracking-widest uppercase">Trà Việt</h2>
        <div className="flex gap-1 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 bg-[#1f3d2b] rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-2xl ${className}`} />
  );
}

export function ProductSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-full mt-4" />
      </div>
    </div>
  );
}
