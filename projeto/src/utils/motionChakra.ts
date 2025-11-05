/**
 * Este arquivo fornece componentes Chakra + Motion otimizados.
 * Para criar novos componentes Motion + Chakra, use o padrão:
 * ```
 * const MotionComponent = motion.create(ChakraComponent);
 * ```
 */

import { chakra } from "@chakra-ui/react";
import { motion } from "framer-motion";

// Criando versões motion dos componentes Chakra mais comuns
export const MotionBox = motion.create(chakra.div);
export const MotionFlex = motion.create(chakra.div);
export const MotionButton = motion.create(chakra.button);
export const MotionText = motion.create(chakra.p);
export const MotionAlertDialogContent = motion.create(chakra.div);

// Exportando o motion para uso direto
export { motion };
