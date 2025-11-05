import { useContext, useState, useEffect, useRef, MouseEvent } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Flex,
  Text,
  Heading,
  Input,
  Button,
  useMediaQuery,
  InputGroup,
  InputRightElement,
  useClipboard,
  FormControl,
  FormLabel,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Select,
  Box,
  Stack,
  HStack,
  Icon,
  Checkbox,
  Grid,
  GridItem,
  VStack,
} from "@chakra-ui/react";
import {
  FiCopy,
  FiExternalLink,
  FiClock,
  FiCheck,
  FiAlertCircle,
  FiUser,
} from "react-icons/fi";
import { Sidebar } from "../../components/sidebar";
import Link from "next/link";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { AuthContext } from "../../context/AuthContext";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  showInfoToast,
} from "../../utils/toastifyConfig";
import { setupAPIClient } from "../../services/api";
import {
  checkPortalAccess,
  repairSubscription,
} from "../../services/subscription";
import { motion } from "framer-motion";
import { EnhancedInput } from "../../components/enhanced-input";
const MotionBox = motion.create(Box);

interface UserProps {
  id: string;
  name: string;
  email: string;
  endereco: string | null;
  slug: string;
}

interface BusinessHours {
  id: string;
  opening_time: string;
  closing_time: string;
  interval_minutes: number;
  working_days?: number[];
}

interface ProfileProps {
  user: UserProps;
  premium: boolean;
  businessHours?: BusinessHours;
}

const MotionHeading = motion(Heading);

export default function Profile({
  user,
  premium,
  businessHours: initialBusinessHours,
}: ProfileProps) {
  const { logoutUser } = useContext(AuthContext);
  const router = useRouter();
  // Usando React-Toastify diretamente em vez de useToast
  const [isMobile] = useMediaQuery("(max-width: 500px)");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const [name, setName] = useState(user?.name);
  const [endereco, setEndereco] = useState(user?.endereco || "");
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState("");

  // Estados para configurações de horário de funcionamento
  const [openingTime, setOpeningTime] = useState(
    initialBusinessHours?.opening_time || "08:00",
  );
  const [closingTime, setClosingTime] = useState(
    initialBusinessHours?.closing_time || "20:00",
  );
  const [intervalMinutes, setIntervalMinutes] = useState(
    initialBusinessHours?.interval_minutes || 15,
  );
  const [workingDays, setWorkingDays] = useState<number[]>(
    initialBusinessHours?.working_days || [1, 2, 3, 4, 5, 6], // Segunda a sábado por padrão
  );
  const [hourSettingsChanged, setHourSettingsChanged] = useState(false);
  const [businessHoursId, setBusinessHoursId] = useState(
    initialBusinessHours?.id || null,
  );

  // URL de agendamento com base no slug
  const [schedulingUrl, setSchedulingUrl] = useState("");
  const { hasCopied, onCopy } = useClipboard(schedulingUrl);

  // Configure a URL apenas no lado do cliente para evitar erros de SSR
  useEffect(() => {
    const baseUrl = window.location.origin;
    setSchedulingUrl(`${baseUrl}/agendar/${user?.slug}`);
  }, [user?.slug]);

  // Carregar configurações de horário
  useEffect(() => {
    if (initialBusinessHours) {
      setOpeningTime(initialBusinessHours.opening_time);
      setClosingTime(initialBusinessHours.closing_time);
      setIntervalMinutes(Number(initialBusinessHours.interval_minutes));
      setWorkingDays(initialBusinessHours.working_days || [1, 2, 3, 4, 5, 6]);
      setBusinessHoursId(initialBusinessHours.id);
      setHourSettingsChanged(false);
    } else {
      const savedSettings = localStorage.getItem("@barber:schedule_settings");
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        // Configurações carregadas do localStorage
        if (settings.openingTime) setOpeningTime(settings.openingTime);
        if (settings.closingTime) setClosingTime(settings.closingTime);
        if (settings.intervalMinutes)
          setIntervalMinutes(Number(settings.intervalMinutes));
        if (settings.workingDays) setWorkingDays(settings.workingDays);
      }
    }
  }, [initialBusinessHours]);

  // Salvar configurações de horário
  async function saveBusinessHours() {
    try {
      // Salvar no localStorage como backup
      const settings = {
        openingTime,
        closingTime,
        workingDays,
      };
      localStorage.setItem(
        "@barber:schedule_settings",
        JSON.stringify(settings),
      );

      const apiClient = setupAPIClient();

      // Usar PUT em vez de POST para atualizar
      const response = await apiClient.put("/schedule/business-hours", {
        opening_time: openingTime,
        closing_time: closingTime,
        interval_minutes: 15,
        working_days: workingDays,
      });
      setBusinessHoursId(response.data.id);
      // Configurações salvas no banco de dados

      showSuccessToast(
        `Horário de funcionamento definido: ${openingTime} às ${closingTime}.`,
        "Configurações de horário salvas"
      );

      setHourSettingsChanged(false);
      return true;
    } catch (error) {
      console.error("Erro ao salvar configurações de horário:", error);
      showErrorToast(
        "Não foi possível salvar as configurações. Verifique sua conexão ou tente novamente.",
        "Erro ao salvar configurações de horário"
      );
      return false;
    }
  }

  // Função para alternar dia de funcionamento
  const toggleWorkingDay = (dayIndex: number) => {
    setWorkingDays(prev => {
      const newWorkingDays = prev.includes(dayIndex)
        ? prev.filter(day => day !== dayIndex)
        : [...prev, dayIndex].sort();

      setHourSettingsChanged(true);
      return newWorkingDays;
    });
  };

  // Nomes dos dias da semana
  const dayNames = [
    'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
  ];

  // Função para obter texto dos dias selecionados
  const getWorkingDaysText = () => {
    if (workingDays.length === 0) return "Nenhum dia selecionado";
    if (workingDays.length === 7) return "Todos os dias";

    const sortedDays = [...workingDays].sort();
    return sortedDays.map(day => dayNames[day]).join(", ");
  };

  function validateForm() {
    let isValid = true;

    // Validar nome (não pode estar vazio)
    if (!name.trim()) {
      setNameError("Nome da loja é obrigatório");
      isValid = false;
    } else {
      setNameError("");
    }

    return isValid;
  }

  async function handleLogout() {
    await logoutUser();
  }

  function handleConfirmUpdate() {
    if (validateForm()) {
      onOpen();
    }
  }

  async function handleUpdateUser() {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const apiClient = setupAPIClient();
      await apiClient.put("/users", { name, endereco });

      // Se as configurações de horário foram alteradas, também salva
      if (hourSettingsChanged) {
        const savedHours = await saveBusinessHours();
        if (!savedHours) {
          setIsLoading(false);
          onClose();
          return;
        }
      }

      showSuccessToast(
        "Dados alterados com sucesso!" +
        (hourSettingsChanged ? " e horários salvos!" : ""),
        "Sucesso!"
      );

      onClose();
      router.replace("/profile");
    } catch (err: any) {
      // Erro capturado e tratado
      let errorMessage =
        "Não foi possível atualizar seus dados. Tente novamente.";
      if (err.response && err.response.data && err.response.data.errors) {
        errorMessage = err.response.data.errors;
      }

      showErrorToast(
        errorMessage,
        "Erro!"
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleCopyUrl(event: MouseEvent<HTMLButtonElement>): void {
    onCopy();
  } // Função para redirecionar para o portal do cliente Stripe
  async function handleAccessCustomerPortal() {
    try {
      setIsLoading(true);
      showInfoToast(
        "Acessando portal de gerenciamento da assinatura",
        "Conectando..."
      );

      // Verificar se o usuário pode acessar o portal
      try {
        const { canAccess, needsRepair } = await checkPortalAccess();

        if (needsRepair) {
          showWarningToast(
            "Detectamos um problema com sua assinatura. Tentando reparar automaticamente...",
            "Necessário reparar assinatura"
          );

          // Tentar reparar a assinatura
          const repairResult = await repairSubscription();

          if (repairResult.needs_subscription) {
            showWarningToast(
              "É necessário criar uma nova assinatura. Redirecionando para a página de planos.",
              "Assinatura necessária"
            );

            setTimeout(() => {
              router.push("/planos");
            }, 2000);
            return;
          }
        }

        if (!canAccess) {
          throw new Error(
            "Sua conta não tem acesso ao portal de gerenciamento. Verifique se sua assinatura está ativa.",
          );
        }
      } catch (error) {
        console.error("Erro ao verificar acesso ao portal:", error);
        // Continua com o fluxo normal mesmo se houver erro na verificação
      }

      // Acessar o portal
      const apiClient = setupAPIClient();
      console.log("Enviando requisição para /create-portal");
      const response = await apiClient.post("/create-portal");
      console.log("Resposta do servidor:", response.data);

      // Redirecionar para a URL do portal do Stripe
      if (response.data?.sessionId) {
        console.log("Redirecionando para:", response.data.sessionId);
        window.location.href = response.data.sessionId;
      } else {
        console.error("Resposta sem sessionId:", response.data);
        throw new Error("Resposta inválida do servidor");
      }
    } catch (error: any) {
      console.error("Erro ao acessar o portal do cliente:", error);
      console.error("Detalhes completos:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });

      // Mensagem de erro mais específica se disponível
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Não foi possível acessar o portal de gerenciamento da assinatura.";

      showErrorToast(
        errorMessage,
        "Erro"
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Função para salvar os dados da barbearia (nome e endereço)
  async function handleSaveBarbershopData() {
    try {
      if (!validateForm()) return;

      setIsLoading(true);
      const apiClient = setupAPIClient();
      await apiClient.put("/users", { name, endereco });

      showSuccessToast(
        "Nome e endereço da loja foram salvos com sucesso.",
        "Dados salvos"
      );
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      showErrorToast(
        "Não foi possível salvar os dados da loja. Verifique sua conexão ou tente novamente.",
        "Erro ao salvar dados"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Minha Conta - MK veiculos</title>
      </Head>
      <Sidebar>
        <Flex direction="column" minH="100vh" w="100%" bg={"barber.900"}>
          {/* Header padrão Serviços */}
          <Box
            w="100%"
            px={{ base: 4, md: 8 }}
            pt={{ base: 8, md: 12 }}
            pb={2}
            bg={"barber.900"}
            boxShadow="sm"
          >
            <Flex justify="space-between" align="center">
              <Box>
                <Heading
                  as="h1"
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="bold"
                  color={"white"}
                  mb={1}
                  letterSpacing="-1px"
                >
                  Perfil da Loja
                </Heading>
                <Text color={"barber.100"} fontSize={{ base: "md", md: "lg" }}>
                  Gerencie os dados, horários e assinatura da sua loja.
                </Text>
              </Box>
            </Flex>
          </Box>

          {/* Grid principal padrão flat */}
          <Flex
            direction={{ base: "column", md: "row" }}
            align="stretch"
            justify="center"
            w="100%"
            maxW="1100px"
            mx="auto"
            gap={{ base: 8, md: 10 }}
            px={{ base: 4, md: 8 }}
            py={10}
          >
            {/* Coluna esquerda: Dados e link */}
            <Stack
              flex="1"
              spacing={8}
              minW={{ base: "100%", md: "420px" }}
              maxW={{ base: "100%", md: "500px" }}
              h="100%"
            >
              {/* Card Dados Barbearia flat enxuto */}
              <Box
                bg={"barber.800"}
                borderRadius="xl"
                boxShadow="md"
                border="1px solid"
                borderColor={"barber.700"}
                w="100%"
                p={{ base: 5, md: 7 }}
                h="100%"
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
              >
                <Text fontWeight="bold" fontSize="lg" color={"white"} mb={1}>
                  Dados da Loja
                </Text>
                <Text color="gray.500" fontSize="sm" mb={4}>
                  {user?.email}
                </Text>
                <Stack spacing={5} flex="1">
                  <FormControl isInvalid={!!nameError}>
                    <EnhancedInput
                      id="profile-nome"
                      label="Nome da loja"
                      placeholder="Nome da sua loja"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (nameError) setNameError("");
                      }}
                      isInvalid={!!nameError}
                      errorMessage={nameError}
                      autoComplete="off"
                      isRequired
                    />
                  </FormControl>
                  <FormControl>
                    <EnhancedInput
                      id="profile-endereco"
                      label="Endereço"
                      placeholder="Endereço da loja"
                      value={endereco}
                      onChange={(e) => setEndereco(e.target.value)}
                      autoComplete="off"
                    />
                  </FormControl>
                  <Box flex="1" />
                  <Button
                    size="lg"
                    w="full"
                    color="barber.900"
                    fontWeight="bold"
                    bg="orange.400"
                    borderRadius="md"
                    boxShadow="sm"
                    _hover={{
                      bg: "orange.300",
                      boxShadow: "md",
                      transform: "translateY(-2px)",
                    }}
                    _active={{ bg: "orange.500", transform: "translateY(0)" }}
                    transition="all 0.2s"
                    isLoading={isLoading}
                    loadingText="Salvando..."
                    onClick={handleSaveBarbershopData}
                  >
                    Salvar dados
                  </Button>
                </Stack>
              </Box>

              {/* Card Link de agendamento flat */}
              <Box
                bg={"barber.800"}
                borderRadius="xl"
                boxShadow="md"
                border="1px solid"
                borderColor={"barber.700"}
                w="100%"
                p={{ base: 5, md: 7 }}
              >
                <FormControl>
                  <FormLabel fontWeight="bold" color="orange.400" mb={1}>
                    Link de agendamento
                  </FormLabel>
                  <InputGroup size="lg">
                    <Input
                      background={"barber.900"}
                      value={schedulingUrl}
                      isReadOnly
                      pr="5rem"
                      color={"white"}
                      focusBorderColor="orange.400"
                      borderColor="transparent"
                      _hover={{ borderColor: "orange.400" }}
                      _focus={{
                        borderColor: "orange.400",
                        boxShadow: "0 0 0 1px #ffb110",
                      }}
                      transition="all 0.3s"
                      pl={4}
                      letterSpacing="0.3px"
                      borderRadius="md"
                      boxShadow={hasCopied ? "0 0 0 1px #46EF75" : "none"}
                    />
                    <InputRightElement width="5.2rem" pr={1}>
                      <Button
                        h="2.2rem"
                        size="sm"
                        color="barber.900"
                        fontWeight="bold"
                        bg={hasCopied ? "green.500" : "orange.400"}
                        borderRadius="md"
                        boxShadow="sm"
                        _hover={{
                          bg: hasCopied ? "green.600" : "orange.300",
                          transform: "translateY(-1px)",
                          boxShadow: hasCopied
                            ? "0 4px 8px rgba(70,239,117,0.4)"
                            : "md",
                        }}
                        onClick={handleCopyUrl}
                        leftIcon={hasCopied ? <FiCheck /> : <FiCopy />}
                        transition="all 0.3s"
                      >
                        {hasCopied ? "Copiado" : "Copiar"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <Button
                    leftIcon={<FiExternalLink />}
                    bg={"barber.700"}
                    color={"white"}
                    borderRadius="md"
                    border="1px solid"
                    borderColor="orange.200"
                    _hover={{
                      bg: "orange.50",
                      color: "orange.400",
                      borderColor: "orange.400",
                    }}
                    onClick={() => window.open(schedulingUrl, "_blank")}
                    transition="all 0.3s"
                    mt={3}
                    w="100%"
                  >
                    Visualizar página de agendamento
                  </Button>
                </FormControl>
              </Box>

              {/* Card Plano/Assinatura flat */}
              <Box
                bg={"barber.800"}
                borderRadius="xl"
                boxShadow="md"
                border="1px solid"
                borderColor={premium ? "orange.300" : "barber.700"}
                w="100%"
                p={{ base: 5, md: 7 }}
              >
                <Flex w="100%" align="center" justify="space-between" gap={2}>
                  <Flex align="center" minW={0} gap={2}>
                    <Text color={"gray.100"} fontWeight="bold" fontSize="lg">
                      Plano atual
                    </Text>
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      color={premium ? "orange.400" : "green.300"}
                      isTruncated
                    >
                      {premium ? "Premium" : "Grátis"}
                    </Text>
                  </Flex>
                  {premium ? (
                    <Button
                      bg="orange.400"
                      color="barber.900"
                      borderRadius="md"
                      boxShadow="sm"
                      _hover={{
                        bg: "orange.300",
                        transform: "scale(1.05)",
                        boxShadow: "md",
                      }}
                      _active={{ bg: "orange.500", transform: "scale(0.98)" }}
                      transition="all 0.3s"
                      fontWeight="bold"
                      aria-label="Gerenciar assinatura"
                      w="100%"
                      maxW="220px"
                      onClick={handleAccessCustomerPortal}
                      isLoading={isLoading}
                      loadingText="Acessando..."
                    >
                      Gerenciar Assinatura
                    </Button>
                  ) : (
                    <Link href="/planos" passHref legacyBehavior>
                      <Button
                        as="a"
                        bg={"barber.700"}
                        color={"white"}
                        borderRadius="md"
                        border="1px solid"
                        borderColor="orange.200"
                        _hover={{
                          bg: "orange.50",
                          color: "orange.400",
                          borderColor: "orange.400",
                        }}
                        transition="all 0.3s"
                        w="100%"
                        maxW="200px"
                      >
                        Mudar plano
                      </Button>
                    </Link>
                  )}
                </Flex>
              </Box>
            </Stack>

            {/* Coluna direita: Horários flat */}
            <Box
              flex="1"
              minW={{ base: "100%", md: "420px" }}
              maxW={{ base: "100%", md: "500px" }}
              h="100%"
              display="flex"
              flexDirection="column"
            >
              <Box
                bg={"barber.800"}
                borderRadius="xl"
                boxShadow="md"
                border="1px solid"
                borderColor={"barber.700"}
                w="100%"
                p={{ base: 5, md: 7 }}
                h="100%"
                display="flex"
                flexDirection="column"
                justifyContent="flex-start"
              >
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color="orange.400"
                  mb={5}
                  display="flex"
                  alignItems="center"
                >
                  <Icon as={FiClock} mr={2} />
                  Horários de Funcionamento
                </Text>
                <Stack spacing={5} direction="column" mb={5}>
                  <FormControl>
                    <FormLabel fontWeight="bold" color="orange.400" mb={1}>
                      Horário de Abertura
                    </FormLabel>
                    <Select
                      value={openingTime}
                      onChange={(e) => {
                        setOpeningTime(e.target.value);
                        setHourSettingsChanged(true);
                      }}
                      bg={"barber.900"}
                      borderColor={"barber.700"}
                      borderWidth="1px"
                      color={"white"}
                      focusBorderColor="orange.400"
                      _hover={{ borderColor: "orange.400" }}
                      _focus={{
                        borderColor: "orange.400",
                        boxShadow: "0 0 0 1px #ffb110",
                      }}
                      transition="all 0.2s"
                      size="lg"
                      borderRadius="md"
                    >
                      {Array.from({ length: 13 }, (_, i) => i + 5).map(
                        (hour) => (
                          <option
                            key={`open-${hour}`}
                            value={`${hour.toString().padStart(2, "0")}:00`}
                            style={{
                              backgroundColor: "#1b1c29",
                              color: "white",
                            }}
                          >
                            {`${hour.toString().padStart(2, "0")}:00`}
                          </option>
                        ),
                      )}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontWeight="bold" color="orange.400" mb={1}>
                      Horário de Fechamento
                    </FormLabel>
                    <Select
                      value={closingTime}
                      onChange={(e) => {
                        setClosingTime(e.target.value);
                        setHourSettingsChanged(true);
                      }}
                      bg={"barber.900"}
                      borderColor={"barber.700"}
                      borderWidth="1px"
                      color={"white"}
                      focusBorderColor="orange.400"
                      _hover={{ borderColor: "orange.400" }}
                      _focus={{
                        borderColor: "orange.400",
                        boxShadow: "0 0 0 1px #ffb110",
                      }}
                      transition="all 0.2s"
                      size="lg"
                      borderRadius="md"
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 14).map(
                        (hour) => (
                          <option
                            key={`close-${hour}`}
                            value={`${hour.toString().padStart(2, "0")}:00`}
                            style={{
                              backgroundColor: "#1b1c29",
                              color: "white",
                            }}
                          >
                            {`${hour.toString().padStart(2, "0")}:00`}
                          </option>
                        ),
                      )}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontWeight="bold" color="orange.400" mb={3}>
                      Dias de Funcionamento
                    </FormLabel>
                    <Grid templateColumns="repeat(2, 1fr)" gap={2} mb={3}>
                      {dayNames.map((day, index) => (
                        <GridItem key={index}>
                          <Checkbox
                            isChecked={workingDays.includes(index)}
                            onChange={() => toggleWorkingDay(index)}
                            colorScheme="orange"
                            size="lg"
                            fontWeight="medium"
                            color="white"
                            _checked={{
                              "& .chakra-checkbox__control": {
                                bg: "orange.400",
                                borderColor: "orange.400",
                              }
                            }}
                          >
                            <Text fontSize="sm">{day}</Text>
                          </Checkbox>
                        </GridItem>
                      ))}
                    </Grid>
                    <Box
                      bg="barber.900"
                      p={3}
                      borderRadius="md"
                      border="1px solid"
                      borderColor="barber.700"
                    >
                      <Text fontSize="sm" color="orange.200">
                        <Text as="span" fontWeight="bold">Dias selecionados:</Text> {getWorkingDaysText()}
                      </Text>
                    </Box>
                  </FormControl>

                  {/* Campo de duração removido - agora cada serviço tem sua própria duração */}
                </Stack>
                <Box
                  bg={"barber.700"}
                  p={5}
                  borderRadius="md"
                  mb={10}
                  mt={6}
                  position="relative"
                  overflow="hidden"
                  boxShadow="sm"
                  border="1px solid"
                  borderColor="orange.100"
                >
                  <HStack>
                    <Icon as={FiAlertCircle} color="orange.400" boxSize={5} />
                    <VStack align="start" spacing={1}>
                      <Text color={"white"}>
                        Atendimentos das{" "}
                        <Text as="span" fontWeight="bold" color="orange.400">
                          {openingTime}
                        </Text>{" "}
                        às{" "}
                        <Text as="span" fontWeight="bold" color="orange.400">
                          {closingTime}
                        </Text>
                        , duração{" "}
                        <Text as="span" fontWeight="bold" color="orange.400">
                          {intervalMinutes} min
                        </Text>
                        .
                      </Text>
                      <Text color="orange.200" fontSize="sm">
                        <Text as="span" fontWeight="bold">Funcionamento:</Text> {getWorkingDaysText()}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
                <Button
                  leftIcon={<FiCheck />}
                  bg="#46EF75"
                  color="gray.900"
                  borderRadius="md"
                  boxShadow="sm"
                  _hover={{
                    bg: "#3BD968",
                    transform: "scale(1.02)",
                    boxShadow: "md",
                  }}
                  _active={{ bg: "#32CD32", transform: "scale(0.98)" }}
                  transition="all 0.3s"
                  size="lg"
                  fontWeight="bold"
                  onClick={saveBusinessHours}
                  isDisabled={!hourSettingsChanged}
                  width="100%"
                >
                  Salvar Horários
                </Button>
              </Box>
            </Box>
          </Flex>
        </Flex>
      </Sidebar>

      {/* Diálogo de confirmação antes de salvar */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
        motionPreset="slideInBottom"
      >
        <AlertDialogOverlay>
          <AlertDialogContent
            bg="barber.400"
            color="white"
            borderRadius="lg"
            boxShadow="0 8px 32px rgba(0, 0, 0, 0.5)"
            border="1px solid rgba(255, 177, 16, 0.2)"
            mx={4}
          >
            <AlertDialogHeader
              fontSize="xl"
              fontWeight="bold"
              color="#ffb110"
              borderBottomWidth="1px"
              borderBottomColor="whiteAlpha.200"
              pb={3}
            >
              Confirmar alterações
            </AlertDialogHeader>

            <AlertDialogBody py={5}>
              <Text>
                Tem certeza que deseja salvar as alterações nos seus dados?
              </Text>

              <Flex
                bg="gray.900"
                p={4}
                mt={4}
                borderRadius="md"
                direction="column"
                gap={3}
                boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
                border="1px solid rgba(255, 255, 255, 0.05)"
              >
                <HStack>
                  <Icon as={FiUser} color="#ffb110" boxSize={5} />
                  <Text>
                    Nome:{" "}
                    <Text as="span" fontWeight="bold">
                      {name}
                    </Text>
                  </Text>
                </HStack>

                {endereco && (
                  <HStack>
                    <Icon as={FiExternalLink} color="#ffb110" boxSize={5} />
                    <Text>
                      Endereço:{" "}
                      <Text as="span" fontWeight="bold">
                        {endereco}
                      </Text>
                    </Text>
                  </HStack>
                )}

                <HStack>
                  <Icon as={FiClock} color="#ffb110" boxSize={5} />
                  <Text>
                    Horário de funcionamento:{" "}
                    <Text as="span" fontWeight="bold">
                      {openingTime} às {closingTime}
                    </Text>
                  </Text>
                </HStack>
              </Flex>
            </AlertDialogBody>

            <AlertDialogFooter
              borderTopWidth="1px"
              borderTopColor="whiteAlpha.200"
              pt={3}
            >
              <Button
                ref={cancelRef}
                onClick={onClose}
                bg="red.500"
                color="white"
                _hover={{ bg: "red.600", transform: "scale(1.05)" }}
                _active={{ bg: "red.700", transform: "scale(0.98)" }}
                size="md"
                fontWeight="bold"
                boxShadow="0 4px 10px rgba(229, 62, 62, 0.3)"
                transition="all 0.2s"
              >
                Cancelar
              </Button>
              <Button
                bg="#46EF75"
                color="gray.900"
                _hover={{
                  bg: "#3BD968",
                  transform: "scale(1.05)",
                  boxShadow: "0 5px 15px rgba(70, 239, 117, 0.4)",
                }}
                _active={{ bg: "#32CD32", transform: "scale(0.98)" }}
                onClick={handleUpdateUser}
                ml={3}
                isLoading={isLoading}
                loadingText="Salvando..."
                size="md"
                fontWeight="bold"
                boxShadow="0 4px 10px rgba(70, 239, 117, 0.3)"
                transition="all 0.2s"
              >
                Confirmar alterações
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/me");

    const user = {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      endereco: response.data?.endereco || "",
      slug: response.data?.slug || "",
    };

    let businessHours = null;
    try {
      const hoursResponse = await apiClient.get("/schedule/business-hours");
      if (hoursResponse.data) {
        businessHours = hoursResponse.data;
      }
    } catch (hourErr) {
      // API de horários não está pronta ou ocorreu um erro
    }

    return {
      props: {
        user,
        premium: response.data?.subscriptions?.status === "active",
        businessHours,
      },
    };
  } catch (err) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
});
