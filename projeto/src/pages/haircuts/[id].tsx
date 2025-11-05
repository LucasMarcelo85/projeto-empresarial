import { useState, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Sidebar } from "../../components/sidebar";
import Link from "next/link";
import { EnhancedInput } from "../../components/enhanced-input";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  useMediaQuery,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Switch,
  Icon,
  HStack,
  VStack,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Select,
} from "@chakra-ui/react";
import {
  FiChevronLeft,
  FiAlertCircle,
  FiDollarSign,
  FiToggleRight,
  FiClock,
} from "react-icons/fi";
import { IoMdPricetag } from "react-icons/io";
import { RiScissorsCutFill, RiSave3Line } from "react-icons/ri";
import { motion } from "framer-motion";

import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";
import { showSuccessToast, showErrorToast, showWarningToast } from "../../utils/toastifyConfig";

// Componente com animação
const MotionBox = motion(Box);

interface ServiceProps {
  id: string;
  name: string;
  price: number | string;
  status: boolean;
  duration: number;
  hasPremium?: boolean;
}

export default function EditHaircut({
  id,
  name,
  price,
  status,
  duration = 30,
  hasPremium = false,
}: ServiceProps) {
  const router = useRouter();
  const [isMobile] = useMediaQuery("(max-width: 500px)");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const [serviceName, setServiceName] = useState(name);
  const [servicePrice, setServicePrice] = useState<string>(
    String(price || "0"),
  );
  const [serviceDuration, setServiceDuration] = useState<string>(
    String(duration || "30"),
  );
  const [serviceStatus, setServiceStatus] = useState<boolean>(Boolean(status));

  const [loading, setLoading] = useState(false);
  const [isStatusOnlyUpdate, setIsStatusOnlyUpdate] =
    useState<boolean>(!hasPremium);

  // Estados para validação do formulário
  const [nameError, setNameError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [durationError, setDurationError] = useState("");


  // Cores baseadas no tema
  const bgColor = "gray.900";
  const cardBg = "barber.900";
  const textColor = "gray.100";
  const subTextColor = "gray.900";
  const borderColor = "gray.700";
  const primaryColor = "orange.300";
  const secondaryColor = "green.300";
  const errorColor = "red.300";
  const restrictionBg = "orange.900";
  const restrictionBorder = "orange.700";

  // Handlers para os inputs
  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setServiceName(e.target.value);
    if (e.target.value && e.target.value.trim() !== "") {
      setNameError("");
    }
  }

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Permitindo apenas números e um único ponto decimal
    const value = e.target.value.replace(/[^0-9.]/g, "");

    // Garantindo apenas um ponto decimal
    const parts = value.split(".");
    const formatted =
      parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : value;

    // Limitar a 2 casas decimais
    if (parts.length === 2 && parts[1].length > 2) {
      const decimals = parts[1].substring(0, 2);
      setServicePrice(`${parts[0]}.${decimals}`);
    } else {
      setServicePrice(formatted);
    }

    // Validar o valor
    const numValue = Number(formatted);
    if (!isNaN(numValue) && numValue > 0) {
      setPriceError("");
    }
  }

  function handleDurationChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Permitir apenas números inteiros
    const value = e.target.value.replace(/[^0-9]/g, "");

    // Validar o valor
    const numValue = Number(value);
    if (numValue < 10) {
      setDurationError("A duração mínima é 10 minutos");
    } else if (numValue > 240) {
      setDurationError("A duração máxima é 240 minutos (4 horas)");
    } else {
      setDurationError("");
    }

    setServiceDuration(value);
  }



  // Validação do formulário
  function validateForm() {
    let isValid = true;

    // Se for apenas atualização de status, não precisa validar os outros campos
    if (isStatusOnlyUpdate) {
      return true;
    }

    // Validação do nome
    if (!serviceName || serviceName.trim() === "") {
      setNameError("Nome do serviço é obrigatório");
      isValid = false;
    } else if (serviceName.length < 3) {
      setNameError("Nome deve ter pelo menos 3 caracteres");
      isValid = false;
    } else {
      setNameError("");
    }

    // Validação do preço
    if (!servicePrice) {
      setPriceError("Preço é obrigatório");
      isValid = false;
    } else {
      const priceNumber = parseFloat(String(servicePrice).replace(/,/g, "."));

      if (isNaN(priceNumber) || priceNumber <= 0) {
        setPriceError("O preço deve ser um valor maior que zero");
        isValid = false;
      } else {
        setPriceError("");
      }
    }

    // Validação da duração
    if (!serviceDuration) {
      setDurationError("Duração é obrigatória");
      isValid = false;
    } else {
      const durationNumber = parseInt(serviceDuration);
      if (isNaN(durationNumber) || durationNumber < 10) {
        setDurationError("A duração mínima é 10 minutos");
        isValid = false;
      } else if (durationNumber > 240) {
        setDurationError("A duração máxima é 240 minutos (4 horas)");
        isValid = false;
      } else {
        setDurationError("");
      }
    }


    return isValid;
  }

  function handleOpenConfirm() {
    if (validateForm()) {
      onOpen();
    }
  }

  // Atualização do serviço
  async function handleUpdate() {
    try {
      setLoading(true);

      if (!validateForm()) {
        setLoading(false);
        onClose();
        return;
      }

      const apiClient = setupAPIClient();

      // Se for apenas atualização de status (plano gratuito)
      if (isStatusOnlyUpdate) {
        await apiClient.put("/haircut/status", {
          haircut_id: id,
          status: serviceStatus,
        });

        showSuccessToast(
          `O serviço foi ${serviceStatus ? "ativado" : "desativado"}.`,
          "Status atualizado!"
        );

        router.push("/haircuts");
        return;
      }

      // Se for atualização completa (requer Premium)
      const priceStr = String(servicePrice).replace(/,/g, ".");
      const priceFloat = parseFloat(priceStr);

      if (isNaN(priceFloat) || priceFloat <= 0) {
        showErrorToast(
          "Por favor, informe um valor numérico válido maior que zero.",
          "Preço inválido"
        );
        setLoading(false);
        return;
      }

      // Construção do payload completo
      const payload = {
        haircut_id: String(id),
        name: serviceName.trim(),
        price: priceFloat,
        status: serviceStatus,
        duration: parseInt(serviceDuration, 10), // Duração especificada pelo usuário
      };

      // Enviando payload completo
      await apiClient.put("/haircut", payload);

      showSuccessToast(
        "As informações do serviço foram atualizadas com sucesso.",
        "Serviço atualizado!"
      );

      router.push("/haircuts");
    } catch (err) {
      console.error("Erro na requisição:", err);

      // Tratar erro de assinatura não ativa
      if (err.response?.data?.error === "Not authorized") {
        showWarningToast(
          "Você precisa ter uma assinatura Premium ativa para editar todas as informações. No plano gratuito, você pode apenas ativar ou desativar o serviço.",
          "Assinatura necessária"
        );

        // Alterar para modo de apenas status
        setIsStatusOnlyUpdate(true);

        // Resetar os valores dos campos para os originais
        setServiceName(name);
        setServicePrice(String(price || "0"));

        return;
      }

      const errorMsg =
        err.response?.data?.error ||
        "Verifique as informações e tente novamente.";

      showErrorToast(
        errorMsg,
        "Erro ao atualizar serviço"
      );
    } finally {
      setLoading(false);
      onClose();
    }
  }

  // Variantes para animação
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <>
      <Head>
        <title>Editar Anúncio - AutoVendas Pro</title>
      </Head>
      <Sidebar>
        <MotionBox
          as="main"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          minH="100vh"
          bg={bgColor}
          p={4}
        >
          <Container maxW="800px" px={{ base: 4, md: 6 }}>
            {/* Cabeçalho */}
            <MotionBox variants={itemVariants} mb={8}>
              <Flex
                direction={{ base: "column", md: "row" }}
                justify="space-between"
                align={{ base: "flex-start", md: "center" }}
                mb={6}
              >
                <Box mb={{ base: 4, md: 0 }}>
                  <Link href="/haircuts">
                    <Button
                      leftIcon={<FiChevronLeft />}
                      variant="outline"
                      size={{ base: "sm", md: "md" }}
                      mb={3}
                      borderColor={borderColor}
                      _hover={{
                        bg: "gray.700",
                        transform: "translateY(-2px)",
                      }}
                      transition="all 0.3s"
                    >
                      Voltar
                    </Button>
                  </Link>
                  <Heading
                    as="h1"
                    size="lg"
                    color={textColor}
                    display="flex"
                    alignItems="center"
                    mb={2}
                  >
                    <Icon as={RiScissorsCutFill} mr={2} color={primaryColor} />
                    Editar Anúncio
                  </Heading>
                  <Text color={subTextColor}>
                    Atualize as informações do anúncio
                  </Text>
                </Box>
              </Flex>
            </MotionBox>

            {/* Formulário */}
            <MotionBox
              variants={itemVariants}
              bg={cardBg}
              p={6}
              borderRadius="lg"
              shadow="md"
              borderWidth="1px"
              borderColor={borderColor}
              mb={8}
              position="relative"
            >
              {/* Aviso de restrição do plano gratuito */}
              {isStatusOnlyUpdate && (
                <Box
                  bg={restrictionBg}
                  p={4}
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor={restrictionBorder}
                  mb={6}
                >
                  <Flex align="center" gap={3}>
                    <Icon as={FiAlertCircle} boxSize={5} color="orange.500" />
                    <VStack align="start" spacing={2}>
                      <Text fontWeight="bold" color="green.600">
                        Plano Gratuito
                      </Text>
                      <Text fontSize="sm" color={subTextColor}>
                        No modo gratuito, você só pode ativar ou desativar o
                        anúncio.{" "}
                        <Link href="/planos">
                          <Text
                            as="span"
                            color="green.600"
                            fontWeight="bold"
                            _hover={{ textDecoration: "underline" }}
                          >
                            Assine o plano Premium
                          </Text>
                        </Link>{" "}
                        para editar todas as informações.
                      </Text>
                    </VStack>
                  </Flex>
                </Box>
              )}

              <VStack spacing={5} align="stretch">
                {/* Nome do serviço */}
                <EnhancedInput
                  id="name"
                  label="Nome do serviço"
                  placeholder="Ex: Corte Degradê"
                  value={serviceName}
                  onChange={handleNameChange}
                  isInvalid={!!nameError}
                  errorMessage={nameError}
                  leftIcon={IoMdPricetag}
                  isDisabled={isStatusOnlyUpdate}
                  autoComplete="off"
                />
                {/* Preço */}
                <EnhancedInput
                  id="price"
                  label="Preço do serviço"
                  placeholder="Ex: 59.90"
                  value={servicePrice}
                  onChange={handlePriceChange}
                  isInvalid={!!priceError}
                  errorMessage={priceError}
                  leftIcon={FiDollarSign}
                  isDisabled={isStatusOnlyUpdate}
                  autoComplete="off"
                />

                {/* Duração */}
                <FormControl isInvalid={!!durationError}>
                  <FormLabel fontWeight="medium" color="white">
                    <Flex align="center">
                      <Icon as={FiClock} mr={2} />
                      Duração do serviço (minutos)
                    </Flex>
                  </FormLabel>
                  <Select
                    id="duration"
                    value={serviceDuration}
                    onChange={(e) => setServiceDuration(e.target.value)}
                    bg={"barber.800"}
                    color={"white"}
                    focusBorderColor="orange.400"
                    borderColor={durationError ? "red.500" : "gray.700"}
                    _hover={{ borderColor: "gray.600" }}
                    _focus={{
                      borderColor: "orange.400",
                      boxShadow: "0 0 0 1px #ffb110",
                    }}
                    isDisabled={isStatusOnlyUpdate}
                  >
                    <option value="30" style={{ backgroundColor: "#1b1c29", color: "white" }}>30 minutos</option>
                    <option value="45" style={{ backgroundColor: "#1b1c29", color: "white" }}>45 minutos</option>
                    <option value="60" style={{ backgroundColor: "#1b1c29", color: "white" }}>60 minutos (1 hora)</option>
                    <option value="90" style={{ backgroundColor: "#1b1c29", color: "white" }}>90 minutos (1h30)</option>
                  </Select>
                  {durationError && (
                    <FormErrorMessage>{durationError}</FormErrorMessage>
                  )}
                </FormControl>


                {/* Status */}
                <FormControl
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mt={2}
                >
                  <FormLabel
                    htmlFor="status-switch"
                    mb="0"
                    fontWeight="medium"
                    display="flex"
                    alignItems="center"
                    color={textColor}
                  >
                    <Icon
                      as={FiToggleRight}
                      mr={2}
                      color={serviceStatus ? "green.500" : "red.500"}
                    />
                    Status do serviço:
                  </FormLabel>

                  <HStack>
                    <Text
                      color={serviceStatus ? "green.500" : "gray.500"}
                      fontWeight="medium"
                    >
                      {serviceStatus ? "Ativo" : "Inativo"}
                    </Text>
                    <Switch
                      id="status-switch"
                      size="lg"
                      colorScheme="green"
                      isChecked={serviceStatus}
                      onChange={(e) => setServiceStatus(e.target.checked)}
                    />
                  </HStack>
                </FormControl>

                {/* Botão de atualização */}
                <Button
                  leftIcon={<RiSave3Line />}
                  colorScheme={isStatusOnlyUpdate ? "orange" : "green"}
                  size="lg"
                  mt={4}
                  textColor="gray.900"
                  onClick={handleOpenConfirm}
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                  transition="all 0.3s"
                >
                  {isStatusOnlyUpdate
                    ? "Atualizar Status"
                    : "Salvar Alterações"}
                </Button>
              </VStack>
            </MotionBox>
          </Container>

          {/* Modal de confirmação */}
          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isCentered
            motionPreset="slideInBottom"
          >
            <AlertDialogOverlay backdropFilter="blur(4px)">
              <AlertDialogContent
                bg={cardBg}
                borderColor={borderColor}
                borderWidth="1px"
              >
                <AlertDialogHeader
                  fontSize="lg"
                  fontWeight="bold"
                  color={textColor}
                >
                  Confirmar Alterações
                </AlertDialogHeader>

                <AlertDialogBody>
                  <VStack align="stretch" spacing={4}>
                    <Text color={subTextColor}>
                      Confirmar as seguintes alterações?
                    </Text>

                    <Box bg={"gray.800"} p={4} borderRadius="md">
                      {!isStatusOnlyUpdate && (
                        <>
                          <HStack mb={2}>
                            <Icon as={IoMdPricetag} color={primaryColor} />
                            <Text fontWeight="bold" mr={1} color={textColor}>
                              Nome:
                            </Text>
                            <Text color={textColor}>{serviceName}</Text>
                          </HStack>

                          <HStack mb={2}>
                            <Icon as={FiDollarSign} color={secondaryColor} />
                            <Text fontWeight="bold" mr={1} color={textColor}>
                              Preço:
                            </Text>
                            <Text color={secondaryColor} fontWeight="medium">
                              R${" "}
                              {parseFloat(
                                String(servicePrice).replace(",", "."),
                              )
                                .toFixed(2)
                                .replace(".", ",")}
                            </Text>
                          </HStack>


                        </>
                      )}

                      <HStack>
                        <Icon
                          as={FiToggleRight}
                          color={serviceStatus ? "green.500" : "red.500"}
                        />
                        <Text fontWeight="bold" mr={1} color={textColor}>
                          Status:
                        </Text>
                        <Text
                          color={serviceStatus ? "green.500" : "red.500"}
                          fontWeight="medium"
                        >
                          {serviceStatus ? "Ativo" : "Inativo"}
                        </Text>
                      </HStack>
                    </Box>

                    {isStatusOnlyUpdate && (
                      <Text fontSize="sm" fontStyle="italic" color="yellow.500">
                        Apenas o status do serviço será alterado. Para editar
                        outras informações, é necessário ter um plano premium.
                      </Text>
                    )}
                  </VStack>
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose} variant="ghost">
                    Cancelar
                  </Button>
                  <Button
                    colorScheme={isStatusOnlyUpdate ? "orange" : "green"}
                    onClick={handleUpdate}
                    ml={3}
                    isLoading={loading}
                    loadingText="Salvando..."
                  >
                    Confirmar
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </MotionBox>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const { id } = ctx.params;
    const apiClient = setupAPIClient(ctx);

    // Buscar detalhes do serviço
    const response = await apiClient.get("/haircut/detail", {
      params: {
        haircut_id: id,
      },
    });

    // Verificar assinatura do usuário
    const userResponse = await apiClient.get("/me");
    const hasPremiumSubscription =
      userResponse.data?.subscriptions?.status === "active";

    // Garantir que os tipos estão corretos ao inicializar os props
    const rawData = response.data;

    const parsedProps = {
      id: String(rawData.id),
      name: String(rawData.name),
      price:
        typeof rawData.price === "number"
          ? rawData.price
          : parseFloat(String(rawData.price)),
      status: Boolean(rawData.status),
      duration: rawData.duration || 30,
      hasPremium: hasPremiumSubscription,
    };

    return {
      props: parsedProps,
    };
  } catch (err) {
    console.error(err);

    // Erro em silêncio e redireciona para lista de serviços
    return {
      redirect: {
        destination: "/haircuts",
        permanent: false,
      },
    };
  }
});
