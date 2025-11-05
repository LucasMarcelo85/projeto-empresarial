import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  Flex,
  Text,
  Heading,
  Button,
  useMediaQuery,
  useDisclosure,
  Box,
  Icon,
  VStack,
  HStack,
  Card,
  CardBody,
  Grid,
  Select,
  Tooltip,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import {
  FiCalendar,
  FiDollarSign,
  FiScissors,
  FiPlus,
  FiFilter,
  FiSearch,
  FiXCircle,
  FiCheck,
  FiMoreVertical,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

import { canSSRAuth } from "../../utils/canSSRAuth";
import { Sidebar } from "../../components/sidebar";
import { setupAPIClient } from "../../services/api";
import { ModalInfo } from "../../components/modal";
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast
} from "../../utils/toastifyConfig";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export interface ScheduleItem {
  id: string;
  customer: string;
  schedule_date: string;
  haircut: {
    id: string;
    name: string;
    price: string | number;
    user_id: string;
  };
}

interface DashboardProps {
  schedule: ScheduleItem[];
}

export default function Dashboard({ schedule }: DashboardProps) {
  const [list, setList] = useState<ScheduleItem[]>(schedule);
  const [service, setService] = useState<ScheduleItem>();
  const [isLoading, setIsLoading] = useState(false);
  const [filterValue, setFilterValue] = useState("all");
  const [searchText, setSearchText] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const cardBg = "barber.900";
  const cardBorder = "gray.700";
  const textColor = "gray.100";
  const accentColor = "orange.300";
  const headingColor = "white";
  const subColor = "gray.400";
  const emptyStateCardBg = "barber.700";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  function handleOpenModal(item: ScheduleItem) {
    setService(item);
    onOpen();
  }

  const isPastDue = (scheduleDate: string) => {
    return new Date(scheduleDate) < new Date();
  };

  const getFilteredSchedule = () => {
    let filteredList = list;

    if (searchText) {
      filteredList = filteredList.filter(
        (item) =>
          item.customer.toLowerCase().includes(searchText.toLowerCase()) ||
          item.haircut.name.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    if (filterValue === "today") {
      const today = new Date().toISOString().split("T")[0];
      filteredList = filteredList.filter((item) => item.schedule_date.split("T")[0] === today);
    } else if (filterValue === "week") {
      const today = new Date();
      const weekLater = new Date();
      weekLater.setDate(today.getDate() + 7);
      filteredList = filteredList.filter((item) => {
        const itemDate = new Date(item.schedule_date);
        return itemDate >= today && itemDate <= weekLater;
      });
    }

    return filteredList.sort((a, b) => new Date(a.schedule_date).getTime() - new Date(b.schedule_date).getTime());
  };

  const filteredSchedule = getFilteredSchedule();

  async function handleFinish(id: string, status: "COMPLETED" | "CANCELLED") {
    setIsLoading(true);
    try {
      const api = setupAPIClient();
      await api.patch(`/schedule/finish?schedule_id=${id}&status=${status}`);
      setList((prev) => prev.filter((i) => i.id !== id));
      showSuccessToast(`Serviço ${status === 'COMPLETED' ? 'concluído' : 'cancelado'} com sucesso.`, `Serviço ${status === 'COMPLETED' ? 'Concluído' : 'Cancelado'}!`);
      if (isOpen) onClose();
    } catch (err: any) {
      showErrorToast(err.response?.data?.error || "Não foi possível concluir esta operação.", "Erro");
    } finally {
      setIsLoading(false);
    }
  }

  function formatDate(dateString: string): string {
    if (!dateString) return "Data não definida";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-BR', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(date);
    } catch (error) {
      return "Data inválida";
    }
  }

  return (
    <>
      <Head>
        <title>Meu Barbeiro Pro - Agenda</title>
      </Head>
      <Sidebar>
        <Flex justify="space-between" align={{ base: "flex-start", md: "center" }} mb={8} direction={{ base: "column", md: "row" }} gap={4}>
          <Box>
            <Heading as="h1" size="lg" color={headingColor} mb={1}>Agenda</Heading>
            <Text color={subColor}>Gerencie seus agendamentos</Text>
          </Box>
          <HStack spacing={4}>
            <Link href="/schedule" passHref>
              <Button colorScheme="orange" leftIcon={<FiPlus />} size="md" fontWeight="semibold" textColor="barber.800" px={6} borderRadius="md">Novo agendamento</Button>
            </Link>
          </HStack>
        </Flex>

        <MotionBox as="main" initial="hidden" animate="visible" variants={containerVariants} p={4}>
          <Box mb={6}>
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
              <InputGroup size="md">
                <InputLeftElement pointerEvents="none"><Icon as={FiSearch} color="gray.500" /></InputLeftElement>
                <Input placeholder="Buscar por cliente ou serviço" value={searchText} onChange={(e) => setSearchText(e.target.value)} bg={"barber.800"} borderColor={cardBorder} _placeholder={{ color: "gray.400" }} />
              </InputGroup>
              <Select icon={<FiFilter />} placeholder="Filtrar por período" value={filterValue} onChange={(e) => setFilterValue(e.target.value)} bg={"barber.800"} borderColor={cardBorder} size="md">
                <option value="all">Todos os agendamentos</option>
                <option value="today">Somente hoje</option>
                <option value="week">Próximos 7 dias</option>
              </Select>
            </Grid>
          </Box>

          <AnimatePresence>
            {filteredSchedule.length === 0 ? (
              <MotionCard initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} bg={emptyStateCardBg} p={8} borderRadius="lg" shadow="md" textAlign="center">
                <Icon as={FiCalendar} w={12} h={12} color={accentColor} mb={4} />
                <Heading size="md" mb={2} color={headingColor}>Nenhum agendamento encontrado</Heading>
                <Text color={subColor}>Adicione novos agendamentos para visualizá-los aqui</Text>
                <Link href="/schedule"><Button leftIcon={<FiPlus />} mt={6} textColor="barber.800" fontWeight="semibold" colorScheme="orange" size="sm">Criar agendamento</Button></Link>
              </MotionCard>
            ) : (
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
                {filteredSchedule.map((item) => (
                  <MotionCard 
                  key={item.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -20 }} 
                  transition={{ duration: 0.3 }} 
                  bg={isPastDue(item.schedule_date) ? "red.900" : cardBg} 
                  borderWidth="1px" 
                  borderColor={isPastDue(item.schedule_date) ? "red.500" : cardBorder} 
                  borderRadius="lg" 
                  overflow="hidden" 
                  shadow="md" 
                  _hover={{ transform: "translateY(-4px)", shadow: "lg" }}
                >
                    <Box w="100%" h="4px" bgGradient="linear(to-r, orange.400, orange.600)" />
                    <CardBody p={5}>
                      <Flex justify="space-between" align="center" mb={4}>
                        <Heading size="md" color={headingColor} noOfLines={1}>{item.customer}</Heading>
                        <Menu>
                          <MenuButton as={IconButton} aria-label="Opções" icon={<FiMoreVertical />} variant="ghost" size="sm" />
                          <MenuList>
                            <MenuItem icon={<FiCheck />} onClick={() => handleFinish(item.id, "COMPLETED")}>Marcar como concluído</MenuItem>
                            <MenuItem icon={<FiXCircle />} onClick={() => handleFinish(item.id, "CANCELLED")}>Cancelar agendamento</MenuItem>
                          </MenuList>
                        </Menu>
                      </Flex>
                      <VStack align="start" spacing={3}>
                        <HStack><Icon as={FiScissors} color={accentColor} /><Text fontWeight="medium" color={textColor}>{item.haircut.name}</Text></HStack>
                        <HStack>
                          <Icon as={FiCalendar} color={accentColor} />
                          <Tooltip label={new Date(item.schedule_date).toLocaleString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} placement="top" hasArrow bg="gray.700">
                            <Text fontSize="sm" color={subColor}>{formatDate(item.schedule_date)}</Text>
                          </Tooltip>
                        </HStack>
                        <HStack><Icon as={FiDollarSign} color={accentColor} /><Text fontWeight="semibold" color={textColor}>R$ {typeof item.haircut.price === "number" ? item.haircut.price.toFixed(2).replace(".", ",") : item.haircut.price.replace(".", ",")}</Text></HStack>
                      </VStack>
                      <Button mt={4} w="100%" colorScheme="orange" variant="outline" onClick={() => handleOpenModal(item)}>Detalhes</Button>
                    </CardBody>
                  </MotionCard>
                ))}
              </Grid>
            )}
          </AnimatePresence>
        </MotionBox>
      </Sidebar>

      <ModalInfo isOpen={isOpen} onClose={onClose} data={service} isLoading={isLoading} finishService={handleFinish} />
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const api = setupAPIClient(ctx);
    const response = await api.get("/schedule");
    return { props: { schedule: response.data || [] } };
  } catch (err) {
    console.log(err);
    return { props: { schedule: [] } };
  }
});
