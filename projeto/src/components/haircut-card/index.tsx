import {
  Box,
  Badge,
  Text,
  Flex,
  IconButton,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Icon,
  VStack,
  HStack,
  Image,
  AspectRatio,
} from "@chakra-ui/react";
import {
  FiEdit2,
  FiEye,
  FiDollarSign,
  FiClock,
  FiToggleRight,
} from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";

// Define o tipo do corte de cabelo para melhor tipagem
interface HaircutProps {
  id: string;
  name: string;
  price: number | string;
  status: boolean;
  user_id?: string;
  haircut_id?: string;
  time?: string;
  available?: boolean;
  duration?: number;
  image?: string;
}

interface HaircutCardProps {
  haircut: HaircutProps;
  viewMode?: "grid" | "list";
}

const MotionBox = motion(Box);

export const HaircutCard = ({
  haircut,
  viewMode = "grid",
}: HaircutCardProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Cores baseadas no tema atual
  const cardBg = "barber.900";
  const cardBorder = "gray.700";
  const textColor = "white";
  const badgeBg = "orange.900";
  const badgeColor = "orange.200";
  const priceBg = "green.900";
  const priceColor = "green.200";
  const shadow = "md";
  const focusRing = "0 0 0 2px #fba931";
  // Formatar preço com máscara R$
  const formattedPrice =
    typeof haircut.price === "number"
      ? `R$ ${haircut.price.toFixed(2).replace(".", ",")}`
      : `R$ ${haircut.price}`.replace(".", ",");
  // Definições para status e imagem padrão
  const statusBadgeColor = haircut.status ? "green" : "red";
  const statusText = haircut.status ? "Ativo" : "Desativado";
  const defaultImage = "/images/bg-barber.jpg";

  return (
    <>
      {viewMode === "grid" ? (
        <MotionBox
          whileHover={{ y: -5, boxShadow: "lg", transition: { duration: 0.2 } }}
          whileFocus={{ boxShadow: "outline" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          bg={cardBg}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={cardBorder}
          overflow="hidden"
          boxShadow={shadow}
          p={4}
          position="relative"
          width="100%"
          tabIndex={0}
          role="group"
          _focus={{ boxShadow: focusRing, outline: "none" }}
        >
          {/* Badge de status */}
          <Badge
            position="absolute"
            top={3}
            right={3}
            colorScheme={statusBadgeColor}
            variant="subtle"
            borderRadius="full"
            px={2}
            py={0.5}
            fontSize="xs"
            zIndex={1}
          >
            {statusText}
          </Badge>

          {/* Informações do corte */}
          <VStack spacing={3} align="start" pt={6} w="100%">
            <Text
              fontWeight="bold"
              fontSize="lg"
              color={textColor}
              noOfLines={2}
            >
              {haircut.name}
            </Text>
            <Badge
              bg={priceBg}
              color={priceColor}
              fontSize="md"
              px={3}
              py={1}
              borderRadius="full"
            >
              <Flex align="center">
                <Icon as={FiDollarSign} mr={1} />
                {formattedPrice}
              </Flex>
            </Badge>
            {haircut.duration && (
              <Flex align="center" mt={2}>
                <Icon as={FiClock} color="gray.500" mr={1} />
                <Text fontSize="sm" color="gray.500">
                  {haircut.duration} minutos
                </Text>
              </Flex>
            )}
          </VStack>

          {/* Botões de ação */}
          <Flex mt={4} justifyContent="space-between" w="100%">
            <Tooltip label="Ver detalhes">
              <IconButton
                aria-label="Ver detalhes do serviço"
                icon={<FiEye />}
                size="sm"
                colorScheme="blue"
                variant="ghost"
                onClick={onOpen}
                tabIndex={0}
                _focus={{ boxShadow: focusRing, outline: "none" }}
              />
            </Tooltip>
            <Tooltip label="Editar">
              <IconButton
                aria-label="Editar serviço"
                icon={<FiEdit2 />}
                size="sm"
                colorScheme="orange"
                variant="ghost"
                as={Link}
                href={`/haircuts/${haircut.id}`}
                tabIndex={0}
                _focus={{ boxShadow: focusRing, outline: "none" }}
              />
            </Tooltip>
          </Flex>
        </MotionBox>
      ) : (
        <MotionBox
          whileHover={{ x: 5, boxShadow: "lg", transition: { duration: 0.2 } }}
          whileFocus={{ boxShadow: "outline" }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          bg={cardBg}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={cardBorder}
          overflow="hidden"
          boxShadow={shadow}
          width="100%"
          tabIndex={0}
          role="group"
          _focus={{ boxShadow: focusRing, outline: "none" }}
        >
          <Flex p={4} align="center">
            {/* Miniatura (opcional) */}
            <AspectRatio ratio={1} width="60px" mr={4} flexShrink={0}>
              <Image
                src={haircut.image || defaultImage}
                alt={haircut.name}
                borderRadius="md"
                objectFit="cover"
                fallbackSrc={defaultImage}
              />
            </AspectRatio>
            {/* Informações */}
            <Box flex="1">
              <Flex justify="space-between" align="flex-start">
                <VStack align="start" spacing={1}>
                  <Text
                    fontWeight="bold"
                    fontSize="md"
                    color={textColor}
                    noOfLines={2}
                  >
                    {haircut.name}
                  </Text>
                  <HStack spacing={3}>
                    <Badge
                      bg={priceBg}
                      color={priceColor}
                      fontSize="sm"
                      borderRadius="full"
                      px={2}
                    >
                      {formattedPrice}
                    </Badge>
                    {haircut.duration && (
                      <Flex align="center">
                        <Icon
                          as={FiClock}
                          color="gray.500"
                          boxSize="12px"
                          mr={1}
                        />
                        <Text fontSize="xs" color="gray.500">
                          {haircut.duration} min
                        </Text>
                      </Flex>
                    )}
                  </HStack>
                </VStack>
                <Badge
                  colorScheme={statusBadgeColor}
                  variant="subtle"
                  fontSize="xs"
                >
                  {statusText}
                </Badge>
              </Flex>
            </Box>
            {/* Ações */}
            <HStack spacing={1} ml={2} alignSelf="center">
              <Tooltip label="Ver detalhes">
                <IconButton
                  aria-label="Ver detalhes do serviço"
                  icon={<FiEye />}
                  size="sm"
                  variant="ghost"
                  onClick={onOpen}
                  tabIndex={0}
                  _focus={{ boxShadow: focusRing, outline: "none" }}
                />
              </Tooltip>
              <Tooltip label="Editar">
                <IconButton
                  aria-label="Editar serviço"
                  icon={<FiEdit2 />}
                  size="sm"
                  colorScheme="orange"
                  variant="ghost"
                  as={Link}
                  href={`/haircuts/${haircut.id}`}
                  tabIndex={0}
                  _focus={{ boxShadow: focusRing, outline: "none" }}
                />
              </Tooltip>
            </HStack>
          </Flex>
        </MotionBox>
      )}
      {/* Modal com detalhes do corte */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(5px)" bg="rgba(0,0,0,0.7)" />
        <ModalContent bg={cardBg}>
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            h="4px"
            bgGradient="linear(90deg, #ffb110 0%, #ff9900 100%)"
            boxShadow="0 0 10px rgba(255, 177, 16, 0.6)"
          />
          <ModalHeader color={textColor}>{haircut.name}</ModalHeader>
          <ModalCloseButton color={textColor} />
          <ModalBody>
            <VStack spacing={4} align="start">
              <Flex align="center">
                <Icon as={FiDollarSign} mr={2} color="orange.500" boxSize={5} />
                <Text fontWeight="semibold" color={textColor}>
                  Preço: {formattedPrice}
                </Text>
              </Flex>
              {haircut.duration && (
                <Flex align="center">
                  <Icon as={FiClock} mr={2} color="blue.500" boxSize={5} />
                  <Text color={textColor}>
                    Duração: {haircut.duration} minutos
                  </Text>
                </Flex>
              )}
              <Flex align="center">
                <Icon
                  as={FiToggleRight}
                  mr={2}
                  color={haircut.status ? "green.500" : "red.500"}
                  boxSize={5}
                />
                <Text color={textColor}>
                  Status: {haircut.status ? "Ativo" : "Inativo"}
                </Text>
              </Flex>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={onClose}
              _focus={{ boxShadow: focusRing }}
            >
              Fechar
            </Button>
            <Button
              colorScheme="orange"
              leftIcon={<FiEdit2 />}
              as={Link}
              href={`/haircuts/${haircut.id}`}
              _focus={{ boxShadow: focusRing }}
            >
              Editar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
