"use client";

import Head from "next/head";
import {
  Box,
  Heading,
  Text,
  Grid,
  Card,
  CardBody,
  VStack,
  HStack,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Progress,
  Icon,
  Flex,
  Input,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import {
  Calendar,
  DollarSign,
  Clock,
  Scissors,
  Target,
  Award,
  BarChart2,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from "lucide-react";
import { EditIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";

import { motion } from "framer-motion";
import { Sidebar } from "../../components/sidebar";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";
import { useState, useEffect, useRef, useCallback } from "react";
import { destroyCookie } from "nookies";
import { showErrorToast, showSuccessToast } from "../../utils/toastifyConfig";
import { formatCurrency } from "../../utils/formatCurrency";
import { RefreshCw } from "lucide-react";

// Componentes com animação
const MotionBox = motion(Box);
const MotionCard = motion(Card);

interface DashboardData {
  today: {
    appointments: number; // Agendados ativos (PENDING)
    completed: number; // finalizados hoje
    cancelled: number; // cancelados hoje
    revenue: number;
    customers: number; // total de clientes únicos hoje
  };
  month: {
    appointments: number; // total de agendamentos únicos no mês (ativos + finalizados + cancelados)
    completed: number; // finalizados no mês
    cancelled: number; // cancelados no mês
    revenue: number;
    customers: number; // total de clientes únicos no mês
    growth: number; // crescimento da receita vs mês anterior
    avgAppointmentsPerDay: number; // média de agendamentos (todos os status) por dia no mês
    servicesCount: number; // total de tipos de serviços diferentes realizados
  };
  recentAppointments: Array<{
    id: string;
    customerName: string;
    service: string;
    price: number;
    date: string;
    status: "completed" | "cancelled";
  }>;
  topServices: Array<{
    name: string;
    count: number;
    revenue: number;
  }>;
  monthlyGoal: {
    target: number;
    current: number;
    percentage: number;
  };
}

// Exemplo dados fictícios
const exampleData: DashboardData = {
  today: {
    appointments: 12,
    completed: 8,
    cancelled: 1,
    revenue: 560,
    customers: 10,
  },
  month: {
    appointments: 128,
    completed: 105,
    cancelled: 10,
    revenue: 6240,
    customers: 85,
    growth: 12.5,
    avgAppointmentsPerDay: 4.2,
    servicesCount: 6,
  },
  recentAppointments: [
    {
      id: "123",
      customerName: "João Silva",
      service: "Corte + Barba",
      price: 60,
      date: "2023-09-15 14:30",
      status: "completed",
    },
    {
      id: "124",
      customerName: "Pedro Oliveira",
      service: "Corte Degradê",
      price: 40,
      date: "2023-09-15 15:45",
      status: "completed",
    },
    {
      id: "125",
      customerName: "Carlos Andrade",
      service: "Barba",
      price: 30,
      date: "2023-09-15 16:30",
      status: "cancelled",
    },
  ],
  topServices: [
    {
      name: "Corte Degradê",
      count: 45,
      revenue: 1800,
    },
    {
      name: "Corte + Barba",
      count: 35,
      revenue: 2100,
    },
    {
      name: "Barba",
      count: 25,
      revenue: 750,
    },
  ],
  monthlyGoal: {
    target: 8000,
    current: 6240,
    percentage: 78,
  },
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>(exampleData);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(data.monthlyGoal?.target || 0);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(60); // segundos
  const [timeToNextRefresh, setTimeToNextRefresh] = useState(autoRefreshInterval);

  // Referência para o timer de atualização automática
  const autoRefreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cores baseadas no tema - definidas no topo para evitar problemas de escopo
  const cardBg = "#181924"; // cor dark mais elegante
  const cardHeaderBg = "barber.800";
  const cardBorder = "gray.700";
  const textColor = "gray.100";
  const tableHeaderBg = "barber.800";
  const tableBorderColor = "gray.700";
  const tableStripedBg = "barber.700";
  const emphasisColor = "orange.300";
  const statsCardBg = "barber.900";
  const statsBorderColor = "orange.700";

  // Função para formatar o tempo desde a última atualização
  const getLastUpdateText = useCallback(() => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastUpdateTime.getTime()) / 1000); // diferença em segundos

    if (diff < 60) {
      return `${diff} segundo${diff !== 1 ? 's' : ''} atrás`;
    } else if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `${minutes} minuto${minutes !== 1 ? 's' : ''} atrás`;
    } else {
      return lastUpdateTime.toLocaleTimeString();
    }
  }, [lastUpdateTime]);

  // Função para iniciar/parar o timer de atualização automática
  const toggleAutoRefresh = useCallback(() => {
    setAutoRefreshEnabled(prev => !prev);
  }, []);

  // Buscar dados reais da API
  const fetchDashboardData = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const api = setupAPIClient();
      // Adiciona um parâmetro para forçar atualização sem cache
      const endpoint = forceRefresh
        ? '/dashboard/metrics?refresh=true'
        : '/dashboard/metrics';

      const response = await api.get(endpoint);

      // Verificar se os dados retornados são válidos
      if (response.data && typeof response.data === 'object') {
        setData(prevData => ({
          ...prevData,
          ...response.data,
          // Garantir valores padrão caso algum dado esteja ausente
          today: {
            ...prevData.today,
            ...(response.data.today || {})
          },
          month: {
            ...prevData.month,
            ...(response.data.month || {})
          }
        }));

        // Atualizar timestamp da última atualização
        setLastUpdateTime(new Date());

        // Resetar contador para próxima atualização
        setTimeToNextRefresh(autoRefreshInterval);

        if (forceRefresh) {
          showSuccessToast("Dados do dashboard atualizados com sucesso!");
        }
      } else {
        throw new Error("Formato de dados inválido");
      }
    } catch (error) {
      console.error(error);
      showErrorToast(
        "Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.",
        "Erro ao carregar dados"
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Buscar dados reais da API
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Atualização automática a cada 10 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 10 * 60 * 1000); // 10 minutos em milissegundos

    return () => clearInterval(interval);
  }, []);

  // Atualização automática com base no estado do timer
  useEffect(() => {
    // Limpar timers anteriores
    if (autoRefreshTimerRef.current) {
      clearInterval(autoRefreshTimerRef.current);
      autoRefreshTimerRef.current = null;
    }

    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    // Se atualização automática estiver ativada, configurar novos timers
    if (autoRefreshEnabled) {
      // Timer para atualizar dados
      autoRefreshTimerRef.current = setInterval(() => {
        fetchDashboardData(true);
      }, autoRefreshInterval * 1000);

      // Timer para atualizar contador regressivo
      countdownTimerRef.current = setInterval(() => {
        setTimeToNextRefresh(prev => {
          if (prev <= 1) return autoRefreshInterval;
          return prev - 1;
        });
      }, 1000);
    }

    // Limpeza ao desmontar componente
    return () => {
      if (autoRefreshTimerRef.current) {
        clearInterval(autoRefreshTimerRef.current);
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, [autoRefreshEnabled, autoRefreshInterval]);

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
      transition: { duration: 0.4 },
    },
  };

  // Adicionar um feedback visual de carregamento para cada seção do dashboard
  const renderLoading = (height = "140px") => (
    <Box height={height} display="flex" alignItems="center" justifyContent="center">
      <Progress size="xs" isIndeterminate width="80%" colorScheme="blue" />
    </Box>
  );

  // Cards de estatísticas principais
  const renderMetricCard = (
    title: string,
    value: string | number,
    icon: any,
    color: string,
    additionalInfo?: React.ReactNode
  ) => (
    <MotionCard
      variants={itemVariants}
      as={MotionCard}
      bg={cardBg}
      shadow="md"
      borderRadius="2xl"
      borderLeft="4px solid"
      borderColor={`${color}.400`}
      overflow="hidden"
      minH="140px"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      px={4}
    >
      <CardBody p={0} display="flex" alignItems="center" gap={4}>
        <Box flex="1">
          <Text fontSize="sm" color={"gray.400"}>
            {title}
          </Text>
          {isLoading ? (
            <Progress size="xs" isIndeterminate width="80%" mt={2} mb={2} />
          ) : (
            <Text fontSize="2xl" fontWeight="bold" color={textColor}>
              {value}
            </Text>
          )}
          {additionalInfo}
        </Box>
        <Flex
          bg={`${color}.900`}
          color={`${color}.200`}
          p={2}
          borderRadius="full"
          alignItems="center"
          justifyContent="center"
          minW={10}
          minH={10}
          boxSize={10}
          ml={2}
        >
          <Icon as={icon} boxSize={6} />
        </Flex>
      </CardBody>
    </MotionCard>
  );

  return (
    <>
      <Head>
        <title>Meu Barbeiro Pro - Dashboard</title>
      </Head>
      <Sidebar>
        <MotionBox
          as="main"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          p={4}
        >
          <Flex
            justify="space-between"
            align={{ base: "flex-start", md: "center" }}
            mb={8}
            direction={{ base: "column", md: "row" }}
            gap={4}
          >
            <MotionBox variants={itemVariants}>
              <Heading as="h1" size="lg" color={"gray.100"}>
                Dashboard
              </Heading>
              <Text color={"gray.400"}>
                Bem-vindo ao seu painel de controle
              </Text>
            </MotionBox>
            <HStack spacing={4} align="center">
              <Badge colorScheme="green" fontSize="md" p={2} borderRadius="md">
                <HStack spacing={2}>
                  <Icon as={Calendar} />
                  <Text>
                    {new Date().toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                </HStack>
              </Badge>

              <HStack spacing={3}>
                <Tooltip
                  label={autoRefreshEnabled
                    ? `Atualização automática ativada. Próxima em ${timeToNextRefresh}s`
                    : "Atualização automática desativada"
                  }
                >
                  <Badge
                    colorScheme={autoRefreshEnabled ? "blue" : "gray"}
                    variant="subtle"
                    px={2} py={1}
                    cursor="pointer"
                    onClick={toggleAutoRefresh}
                  >
                    <HStack spacing={1}>
                      <Icon as={Clock} boxSize={3} />
                      <Text fontSize="xs">
                        {autoRefreshEnabled
                          ? `${timeToNextRefresh}s`
                          : "Auto"
                        }
                      </Text>
                    </HStack>
                  </Badge>
                </Tooltip>

                <Tooltip label="Última atualização: ">
                  <Text fontSize="xs" color="gray.400" fontStyle="italic">
                    {getLastUpdateText()}
                  </Text>
                </Tooltip>

                <IconButton
                  aria-label="Atualizar dados"
                  icon={<Icon as={RefreshCw} />}
                  size="sm"
                  colorScheme="blue"
                  isLoading={isRefreshing}
                  onClick={() => fetchDashboardData(true)}
                />
              </HStack>
            </HStack>
          </Flex>

          {/* Cards de estatísticas principais */}
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={8} // Mais espaçamento entre os cards
            mb={8}
          >
            {/* Agendamentos hoje */}
            <MotionCard
              variants={itemVariants}
              bg={cardBg}
              shadow="md"
              borderRadius="2xl"
              borderLeft="4px solid"
              borderColor="blue.400"
              overflow="hidden"
              minH="140px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              px={4}
            >
              <CardBody p={0} display="flex" alignItems="flex-start" gap={4}>
                <Box flex="1">
                  <Text fontSize="sm" color={"gray.400"}>
                    Agendamentos Hoje
                  </Text>
                  {isLoading || isRefreshing ? (
                    <Progress size="xs" isIndeterminate width="80%" mt={2} mb={2} />
                  ) : (
                    <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                      {data.today.appointments}
                    </Text>
                  )}
                  <Box mt={1} maxW="100%" overflowY="visible">
                    <HStack spacing={2} flexWrap="wrap">
                      <Badge colorScheme="green">
                        {data.today.completed} CONCLUÍDOS
                      </Badge>
                      {data.today.cancelled > 0 && (
                        <Badge colorScheme="red">
                          {data.today.cancelled} CANCELADOS
                        </Badge>
                      )}
                    </HStack>
                  </Box>
                </Box>
                <Flex
                  bg="blue.900"
                  color="blue.200"
                  p={2}
                  borderRadius="full"
                  alignItems="center"
                  justifyContent="center"
                  minW={10}
                  minH={10}
                  boxSize={10}
                  ml={2}
                  alignSelf="center"
                >
                  <Icon as={Calendar} boxSize={6} />
                </Flex>
              </CardBody>
            </MotionCard>

            {/* Receita hoje */}
            <MotionCard
              variants={itemVariants}
              bg={cardBg}
              shadow="md"
              borderRadius="2xl"
              borderLeft="4px solid"
              borderColor="green.400"
              overflow="hidden"
              minH="140px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              px={4}
            >
              <CardBody p={0} display="flex" alignItems="center" gap={4}>
                <Box flex="1">
                  <Text fontSize="sm" color={"gray.400"}>
                    Receita Hoje
                  </Text>
                  {isLoading || isRefreshing ? (
                    <Progress size="xs" isIndeterminate width="80%" mt={2} mb={2} />
                  ) : (
                    <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                      {formatCurrency(data.today.revenue)}
                    </Text>
                  )}
                  <Text fontSize="sm" color={"gray.400"}>
                    {data.today.customers} clientes atendidos
                  </Text>
                </Box>
                <Flex
                  bg="green.900"
                  color="green.200"
                  p={2}
                  borderRadius="full"
                  alignItems="center"
                  justifyContent="center"
                  minW={10}
                  minH={10}
                  boxSize={10}
                  ml={2}
                >
                  <Icon as={DollarSign} boxSize={6} />
                </Flex>
              </CardBody>
            </MotionCard>

            {/* Crescimento mensal */}
            {renderMetricCard(
              "Crescimento Mensal",
              `${Math.abs(data.month.growth || 0)}%`,
              (data.month.growth || 0) >= 0 ? TrendingUpIcon : TrendingDownIcon,
              (data.month.growth || 0) >= 0 ? "purple" : "red",
              <Text fontSize="sm" color={"gray.400"}>
                vs. mês anterior
              </Text>,
            )}
            {/* Média diária */}
            {renderMetricCard(
              "Média Diária",
              (data.month.avgAppointmentsPerDay || 0).toFixed(1),
              BarChart2,
              "orange",
              <Text fontSize="sm" color={"gray.400"}>
                agendamentos por dia
              </Text>,
            )}
          </Grid>

          {/* Meta mensal */}
          <MotionBox
            variants={itemVariants}
            bg={cardBg}
            p={6}
            borderRadius="lg"
            shadow="md"
            borderWidth="1px"
            borderColor={cardBorder}
            mb={8}
          >
            <HStack justify="space-between" mb={4} align="center">
              <Box>
                <Heading size="md" color={textColor}>
                  Meta Mensal
                </Heading>
                <Text color={"gray.400"}>
                  Progresso em direção à meta de R${" "}
                  {((data.monthlyGoal?.target || 0)).toFixed(2).replace(".", ",")}
                </Text>
              </Box>
              <HStack>
                <Icon as={Target} color={emphasisColor} />
                <Text fontWeight="bold" fontSize="xl" color={emphasisColor}>
                  {data.monthlyGoal?.percentage || 0}%
                </Text>
                {editingGoal ? (
                  <HStack>
                    <Input
                      size="sm"
                      width="100px"
                      type="number"
                      value={goalInput}
                      onChange={(e) => setGoalInput(Number(e.target.value))}
                      min={0}
                      step={10}
                      borderColor={emphasisColor}
                      color={emphasisColor}
                      bg={"barber.800"}
                    />
                    <IconButton
                      aria-label="Salvar meta"
                      icon={<CheckIcon />}
                      size="sm"
                      colorScheme="green"
                      onClick={() => {
                        setData((prev) => {
                          const current = prev.monthlyGoal?.current || 0;
                          const target = goalInput || 1; // Evitar divisão por zero
                          return {
                            ...prev,
                            monthlyGoal: {
                              ...(prev.monthlyGoal || {}),
                              target: target,
                              current: current,
                              percentage: Math.round((current / target) * 100),
                            },
                          };
                        });
                        setEditingGoal(false);
                      }}
                    />
                    <IconButton
                      aria-label="Cancelar"
                      icon={<CloseIcon />}
                      size="sm"
                      colorScheme="gray"
                      onClick={() => {
                        setGoalInput(data.monthlyGoal?.target || 0);
                        setEditingGoal(false);
                      }}
                    />
                  </HStack>
                ) : (
                  <IconButton
                    aria-label="Editar meta"
                    icon={<EditIcon />}
                    size="sm"
                    variant="ghost"
                    color={emphasisColor}
                    onClick={() => setEditingGoal(true)}
                  />
                )}
              </HStack>
            </HStack>

            <Box position="relative" pt={4}>
              <Progress
                value={data.monthlyGoal?.percentage || 0}
                size="lg"
                colorScheme="orange"
                borderRadius="full"
                bg={"gray.700"}
              />

              <HStack justify="space-between" mt={2}>
                <Text fontSize="sm" color={"gray.400"}>
                  {formatCurrency(data.monthlyGoal?.current || 0)}
                </Text>
                <Text fontSize="sm" color={"gray.400"}>
                  {formatCurrency(data.monthlyGoal?.target || 0)}
                </Text>
              </HStack>
            </Box>
          </MotionBox>

          <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
            {/* Tabela de agendamentos recentes */}
            <MotionBox
              variants={itemVariants}
              bg={cardBg}
              borderRadius="lg"
              shadow="md"
              borderWidth="1px"
              borderColor={cardBorder}
              overflow="hidden"
            >
              <Flex
                bg={cardHeaderBg}
                p={4}
                borderBottomWidth="1px"
                borderBottomColor={cardBorder}
                justify="space-between"
                align="center"
              >
                <Heading size="md" color={textColor}>
                  Agendamentos Recentes
                </Heading>
                <Badge colorScheme="blue" py={1} px={3} borderRadius="full">
                  Hoje
                </Badge>
              </Flex>
              <Box p={0} overflowX="auto">
                <Table variant="simple" size="md">
                  <Thead bg={tableHeaderBg}>
                    <Tr>
                      <Th borderColor={tableBorderColor} color={textColor}>
                        Cliente
                      </Th>
                      <Th borderColor={tableBorderColor} color={textColor}>
                        Serviço
                      </Th>
                      <Th borderColor={tableBorderColor} color={textColor}>
                        Valor
                      </Th>
                      <Th borderColor={tableBorderColor} color={textColor}>
                        Horário
                      </Th>
                      <Th
                        borderColor={tableBorderColor}
                        color={textColor}
                        isNumeric
                      >
                        Status
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {(data.recentAppointments || []).length === 0 ? (
                      <Tr>
                        <Td colSpan={5} textAlign="center" py={4}>
                          Nenhum agendamento recente encontrado
                        </Td>
                      </Tr>
                    ) : (
                      (data.recentAppointments || []).map((appointment, index) => (
                        <Tr
                          key={appointment.id}
                          bg={index % 2 === 1 ? tableStripedBg : "transparent"}
                          _hover={{ bg: "barber.800" }}
                          transition="background-color 0.2s"
                        >
                          <Td borderColor={tableBorderColor} py={3}>
                            {appointment.customerName}
                          </Td>
                          <Td borderColor={tableBorderColor} py={3}>
                            {appointment.service}
                          </Td>
                          <Td borderColor={tableBorderColor} py={3}>
                            {formatCurrency(appointment.price)}
                          </Td>
                          <Td borderColor={tableBorderColor} py={3}>
                            {new Date(appointment.date).toLocaleTimeString(
                              "pt-BR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </Td>
                          <Td borderColor={tableBorderColor} py={3} isNumeric>
                            <Badge
                              colorScheme={
                                appointment.status === "completed"
                                  ? "green"
                                  : "red"
                              }
                              borderRadius="full"
                              px={2}
                              py={1}
                            >
                              {appointment.status === "completed"
                                ? "Concluído"
                                : "Cancelado"}
                            </Badge>
                          </Td>
                        </Tr>
                      )))}
                  </Tbody>
                </Table>
              </Box>
            </MotionBox>

            {/* Serviços mais populares */}
            <MotionBox
              variants={itemVariants}
              bg={cardBg}
              borderRadius="lg"
              shadow="md"
              borderWidth="1px"
              borderColor={cardBorder}
              overflow="hidden"
            >
              <Flex
                bg={cardHeaderBg}
                p={4}
                borderBottomWidth="1px"
                borderBottomColor={cardBorder}
                justify="space-between"
                align="center"
              >
                <Heading size="md" color={textColor}>
                  Serviços Mais Populares
                </Heading>
                <Icon as={Award} color={emphasisColor} />
              </Flex>
              <VStack spacing={4} align="stretch" p={4}>
                {(data.topServices || []).length === 0 ? (
                  <Box p={4} textAlign="center">
                    <Text color="gray.400">Nenhum serviço popular encontrado</Text>
                  </Box>
                ) : (
                  (data.topServices || []).map((service, index) => (
                    <Box
                      key={service.name}
                      p={4}
                      bg={"barber.800"}
                      borderRadius="md"
                      borderLeft="4px solid"
                      borderColor={
                        index === 0
                          ? "yellow.400"
                          : index === 1
                            ? "gray.400"
                            : "orange.800"
                      }
                    >
                      <Flex justify="space-between" align="center" mb={2}>
                        <HStack>
                          <Icon as={Scissors} color={textColor} />
                          <Text fontWeight="bold" color={textColor}>
                            {service.name}
                          </Text>
                        </HStack>
                        <Badge colorScheme="purple">{service.count}x</Badge>
                      </Flex>
                      <Text fontSize="md" fontWeight="bold" color={emphasisColor}>
                        {formatCurrency(service.revenue)}
                      </Text>
                    </Box>
                  ))
                )}
              </VStack>
            </MotionBox>
          </Grid>
        </MotionBox>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    // Você pode buscar dados iniciais aqui
    // const api = setupAPIClient(ctx);
    // const response = await api.get('/dashboard/metrics');

    return {
      props: {
        // data: response.data
      },
    };
  } catch (err) {
    destroyCookie(ctx, "@barber.token");

    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
});
