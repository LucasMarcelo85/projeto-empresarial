// components/profile-card/index.tsx
import {
  Box,
  Flex,
  Heading,
  Icon,
  HStack,
  Button,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

interface ProfileCardProps {
  title: string;
  icon: IconType;
  children: React.ReactNode;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function ProfileCard({
  title,
  icon,
  children,
  primaryAction,
  secondaryAction,
}: ProfileCardProps) {
  // Cores baseadas no tema atual
  const cardBg = "barber.900";
  const cardBorder = "gray.700";
  const headingColor = "white";
  const accentColor = "orange.300";

  return (
    <MotionBox
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      bg={cardBg}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={cardBorder}
      overflow="hidden"
      boxShadow="sm"
      position="relative"
      width="100%"
      mb={6}
    >
      {/* Linha gradiente superior */}
      <Box w="100%" h="4px" bgGradient="linear(to-r, orange.400, orange.600)" />

      {/* Cabeçalho */}
      <Flex
        align="center"
        p={5}
        borderBottomWidth="1px"
        borderBottomColor={cardBorder}
      >
        <Icon as={icon} boxSize={5} color={accentColor} mr={3} />
        <Heading as="h2" size="md" color={headingColor}>
          {title}
        </Heading>
      </Flex>

      {/* Conteúdo */}
      <Box p={5}>{children}</Box>

      {/* Ações */}
      {(primaryAction || secondaryAction) && (
        <Flex
          p={5}
          justify="flex-end"
          borderTopWidth="1px"
          borderTopColor={cardBorder}
        >
          <HStack spacing={4}>
            {secondaryAction && (
              <Button variant="ghost" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )}
            {primaryAction && (
              <Button colorScheme="orange" onClick={primaryAction.onClick}>
                {primaryAction.label}
              </Button>
            )}
          </HStack>
        </Flex>
      )}
    </MotionBox>
  );
}
