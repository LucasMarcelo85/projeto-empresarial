// tipos/framer-motion.d.ts
import { Transition } from "framer-motion";

declare module "framer-motion" {
  export interface MotionProps {
    transition?:
      | Transition
      | {
          type?: string;
          duration?: number;
          stiffness?: number;
          damping?: number;
        };
  }
}
