// components/modal/index.tsx
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    Button,
    Flex,
    Divider,
    VStack,
    HStack,
    Icon,
    Box,
    Tooltip,
} from "@chakra-ui/react";
import {
    FiUser,
    FiScissors,
    FiCalendar,
    FiClock,
    FiCheckCircle,
    FiXCircle,
    FiAlertCircle,
} from "react-icons/fi";
import { FaMoneyBillAlt } from "react-icons/fa";
import { ScheduleItem } from "../../pages/dash_agenda";
import { motion } from "framer-motion";

interface ModalInfoProps {
    isOpen: boolean;
    onClose: () => void;
    data?: ScheduleItem;
    isLoading?: boolean;
    finishService: (
        id: string,
        status: "COMPLETED" | "CANCELLED",
    ) => Promise<void>;
}

interface FormattedDateTime {
    date: string;
    time: string;
}

export function ModalInfo({
    isOpen,
    onClose,
    data,
    isLoading = false,
    finishService,
}: ModalInfoProps) {


    // Cores baseadas no tema
    const modalBg = "barber.900";
    const textColor = "gray.100";
    const subColor = "gray.400";
    const borderColor = "gray.700";
    const hoverBgLight = "gray.800";
    const accentColor = "orange.300";

    function formatDateTime(dateTimeStr?: string): FormattedDateTime {
        if (!dateTimeStr) {
            return {
                date: "--",
                time: "--",
            };
        }

        const date = new Date(dateTimeStr);

        const dateFormatted = date.toLocaleDateString("pt-BR");
        const timeFormatted = date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        });

        return {
            date: dateFormatted,
            time: timeFormatted,
        };
    }

    const dateTimeFormatted = formatDateTime(data?.schedule_date);
    const MotionModalContent = motion(ModalContent);
    const MotionBox = motion(Box);

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
            {" "}
            <ModalOverlay backdropFilter="blur(4px)" bg="rgba(0, 0, 0, 0.6)" />
            <MotionModalContent
                bg={modalBg}
                boxShadow="0px 8px 30px rgba(0, 0, 0, 0.5)"
                borderRadius="xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                border="1px solid"
                borderColor={borderColor}
                overflow="hidden"
                maxW="450px"
                transition={{ type: "spring", duration: 0.3 }}
            >
                {/* Linha gradiente no topo do Modal */}{" "}
                <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    h="4px"
                    bgGradient="linear(to-r, #ffb110, #ff9900)"
                    boxShadow="0 0 10px rgba(255, 177, 16, 0.6)"
                />
                <ModalHeader
                    borderBottomWidth="1px"
                    borderBottomColor={borderColor}
                    pb={4}
                    color={textColor}
                >
                    Detalhes do Agendamento
                </ModalHeader>
                <ModalCloseButton color={textColor} />
                <ModalBody py={6}>
                    {!data ? (
                        <Flex justify="center" align="center" direction="column" py={8}>
                            <Icon as={FiAlertCircle} boxSize={10} color="red.500" mb={4} />
                            <Text color={textColor} fontWeight="medium">
                                Nenhum agendamento selecionado
                            </Text>
                        </Flex>
                    ) : (
                        <VStack spacing={5} align="stretch">
                            <MotionBox
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                borderWidth="1px"
                                borderColor={borderColor}
                                borderRadius="md"
                                p={4}
                                bgColor={"barber.800"}
                                transition="all 0.2s"
                                _hover={{
                                    borderColor: accentColor,
                                    boxShadow: "0 0 0 1px",
                                    shadowColor: "orange.700",
                                }}
                            >
                                <HStack mb={2}>
                                    <Icon as={FiUser} color={accentColor} boxSize={5} />
                                    <Text fontSize="lg" fontWeight="bold" color={textColor}>
                                        {data.customer}
                                    </Text>
                                </HStack>
                                <Divider mb={4} />

                                <VStack spacing={3} align="start">
                                    <Flex align="center" width="100%">
                                        <Box minW="110px">
                                            <HStack>
                                                <Icon as={FiScissors} color={accentColor} />
                                                <Text fontSize="sm" color={subColor}>
                                                    Serviço:
                                                </Text>
                                            </HStack>
                                        </Box>
                                        <Text fontWeight="medium" color={textColor}>
                                            {data.haircut.name}
                                        </Text>
                                    </Flex>

                                    <Flex align="center" width="100%">
                                        <Box minW="110px">
                                            <HStack>
                                                <Icon as={FiCalendar} color={accentColor} />
                                                <Text fontSize="sm" color={subColor}>
                                                    Data:
                                                </Text>
                                            </HStack>
                                        </Box>
                                        <Text fontWeight="medium" color={textColor}>
                                            {dateTimeFormatted.date}
                                        </Text>
                                    </Flex>

                                    <Flex align="center" width="100%">
                                        <Box minW="110px">
                                            <HStack>
                                                <Icon as={FiClock} color={accentColor} />
                                                <Text fontSize="sm" color={subColor}>
                                                    Horário:
                                                </Text>
                                            </HStack>
                                        </Box>
                                        <Text fontWeight="medium" color={textColor}>
                                            {dateTimeFormatted.time}
                                        </Text>
                                    </Flex>

                                    <Flex align="center" width="100%">
                                        <Box minW="110px">
                                            <HStack>
                                                <Icon as={FaMoneyBillAlt} color={accentColor} />
                                                <Text fontSize="sm" color={subColor}>
                                                    Valor:
                                                </Text>
                                            </HStack>
                                        </Box>
                                        <Text fontWeight="bold" color={textColor}>
                                            R${" "}
                                            {typeof data.haircut.price === "number"
                                                ? data.haircut.price.toFixed(2).replace(".", ",")
                                                : data.haircut.price.replace(".", ",")}
                                        </Text>
                                    </Flex>
                                </VStack>
                            </MotionBox>
                        </VStack>
                    )}
                </ModalBody>
                <ModalFooter borderTopWidth="1px" borderTopColor={borderColor} pt={4}>
                    <Flex width="100%" justify="space-between">
                        {" "}
                        <Tooltip label="Cancelar agendamento" placement="top" hasArrow>
                            <Button
                                leftIcon={<FiXCircle />}
                                colorScheme="red"
                                variant="outline"
                                isLoading={isLoading}
                                onClick={() => {
                                    if (data?.id) {
                                        finishService(data.id, "CANCELLED");
                                    }
                                }}
                                height="40px"
                                fontSize="md"
                                fontWeight="medium"
                                borderRadius="md"
                                _hover={{
                                    bg: "red.50",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 4px 8px rgba(229, 62, 62, 0.2)",
                                }}
                                transition="all 0.2s"
                            >
                                Cancelar
                            </Button>
                        </Tooltip>
                        <HStack>
                            {" "}
                            <Button
                                variant="ghost"
                                onClick={onClose}
                                isDisabled={isLoading}
                                _hover={{ bg: hoverBgLight, color: accentColor }}
                                borderRadius="md"
                            >
                                Fechar
                            </Button>{" "}
                            <Tooltip label="Marcar como concluído" placement="top" hasArrow>
                                <Button
                                    leftIcon={<FiCheckCircle />}
                                    colorScheme="green"
                                    isLoading={isLoading}
                                    onClick={() => {
                                        if (data?.id) {
                                            finishService(data.id, "COMPLETED");
                                        }
                                    }}
                                    height="40px"
                                    fontSize="md"
                                    fontWeight="bold"
                                    borderRadius="md"
                                    color="white"
                                    _hover={{
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 4px 8px rgba(34, 197, 94, 0.2)",
                                    }}
                                    transition="all 0.2s"
                                >
                                    Concluir
                                </Button>
                            </Tooltip>
                        </HStack>
                    </Flex>
                </ModalFooter>
            </MotionModalContent>
        </Modal>
    );
}
