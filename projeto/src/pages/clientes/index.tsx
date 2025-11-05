import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import {
    Box,
    Flex,
    HStack,
    Button,
    Heading,
    Text,
    SimpleGrid,
    Select,
    Icon,
    Spinner,
    Card,
    CardBody,
    Badge,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    Tooltip,
    Divider,
} from "@chakra-ui/react";
import { FiSearch, FiPlus, FiUsers, FiPhone, FiMail, FiCheck, FiX, FiClipboard } from "react-icons/fi";
import Link from "next/link";
import { setupAPIClient } from "../../services/api";
import { canSSRAuth } from "../../utils/canSSRAuth";

import { Sidebar } from "../../components/sidebar";
import { EnhancedInput } from "../../components/enhanced-input";
import { showErrorToast, showSuccessToast } from "../../utils/toastifyConfig";
import { formatPhoneNumber } from "../../utils/phoneFormatter";

export default function Clientes() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterValue, setFilterValue] = useState("all");
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingCustomer, setDeletingCustomer] = useState({ id: "", name: "" });
    const [isDeleting, setIsDeleting] = useState(false);

    // Estados para o modal de agendamentos
    const [isSchedulesModalOpen, setIsSchedulesModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [pendingSchedules, setPendingSchedules] = useState([]);
    const [loadingSchedules, setLoadingSchedules] = useState(false);
    const [processingScheduleId, setProcessingScheduleId] = useState("");

    const cancelRef = useRef(null);

    // Cores do tema
    const bgColor = "gray.900";
    const cardBg = "barber.900";
    const textColor = "gray.100";
    const subTextColor = "gray.400";
    const filterBg = "barber.800";
    const borderColor = "gray.700";
    const accentColor = "orange.300";

    useEffect(() => {
        async function loadCustomers() {
            try {
                setLoading(true);
                const apiClient = setupAPIClient();
                const response = await apiClient.get("/customers", {
                    params: {
                        search: searchTerm
                    }
                });

                setClientes(response.data);
            } catch (error) {
                console.error("Erro ao carregar clientes:", error);
                showErrorToast("Não foi possível carregar os clientes. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        }

        loadCustomers();
    }, [searchTerm]);

    // Função para abrir o diálogo de confirmação de exclusão
    async function handleDeleteConfirm(id, name) {
        try {
            // Verificar se o cliente tem agendamentos pendentes
            setLoadingSchedules(true);
            const apiClient = setupAPIClient();
            const response = await apiClient.get(`/customer/${id}/schedules`);

            if (response.data.hasPendingSchedules) {
                // Em vez de mostrar apenas um erro, vamos abrir o modal para gerenciar agendamentos
                setSelectedCustomer({
                    id,
                    name,
                    ...response.data.customer
                });
                setPendingSchedules(response.data.pendingSchedules);
                setIsSchedulesModalOpen(true);
                return;
            }

            // Se não tiver agendamentos pendentes, prosseguir com a exclusão
            setDeletingCustomer({ id, name });
            setIsDeleteDialogOpen(true);
        } catch (error) {
            console.error("Erro ao verificar agendamentos:", error);
            showErrorToast("Erro ao verificar agendamentos do cliente. Tente novamente.");
        } finally {
            setLoadingSchedules(false);
        }
    }

    // Função para lidar com a conclusão de um agendamento
    async function handleCompleteSchedule(scheduleId) {
        try {
            setProcessingScheduleId(scheduleId);
            const apiClient = setupAPIClient();

            // Solicitação para concluir agendamento

            // Fazemos requisição para concluir o agendamento
            // Enviamos os dados diretamente no corpo da requisição
            await apiClient.patch(`/schedule/finish`, {
                schedule_id: scheduleId,
                status: "COMPLETED"
            });

            // Atualizar lista de agendamentos pendentes removendo o que acabou de ser concluído
            const updatedSchedules = pendingSchedules.filter(schedule => schedule.id !== scheduleId);
            setPendingSchedules(updatedSchedules);

            showSuccessToast("Agendamento concluído com sucesso!");

            // Se não houver mais agendamentos pendentes, fechar modal e excluir o cliente
            if (updatedSchedules.length === 0 && selectedCustomer) {
                setIsSchedulesModalOpen(false);

                // Excluir cliente automaticamente depois que o modal fechar
                setTimeout(async () => {
                    if (selectedCustomer && selectedCustomer.id) {
                        try {
                            setIsDeleting(true);

                            // Excluir o cliente diretamente
                            await apiClient.delete(`/customer/${selectedCustomer.id}`);

                            // Atualizar a lista removendo o cliente excluído
                            setClientes(prev => prev.filter(cliente => cliente.id !== selectedCustomer.id));

                            showSuccessToast("Cliente excluído com sucesso após processar todos os agendamentos!", "Cliente removido");
                        } catch (error) {
                            console.error("Erro ao excluir cliente:", error);
                            let errorMsg = "Erro ao excluir cliente";
                            if (error?.response?.data?.error) {
                                errorMsg = error.response.data.error;
                            }
                            showErrorToast(errorMsg);
                        } finally {
                            setIsDeleting(false);
                            setSelectedCustomer(null);
                        }
                    }
                }, 800);
            }
        } catch (error) {
            console.error("Erro ao concluir agendamento:", error);
            let errorMsg = "Erro ao concluir agendamento.";

            if (error?.response?.data?.error) {
                errorMsg = error.response.data.error;
            }

            showErrorToast(errorMsg);
        } finally {
            setProcessingScheduleId("");
        }
    }

    // Função para lidar com o cancelamento de um agendamento
    async function handleCancelSchedule(scheduleId) {
        try {
            setProcessingScheduleId(scheduleId);
            const apiClient = setupAPIClient();

            // Usando o endpoint de finalização com status CANCELLED para garantir que 
            // seja registrado no histórico com status de cancelamento
            await apiClient.patch(`/schedule/finish`, {
                schedule_id: scheduleId,
                status: "CANCELLED"
            });

            // Atualizar lista de agendamentos pendentes removendo o que acabou de ser cancelado
            const updatedSchedules = pendingSchedules.filter(schedule => schedule.id !== scheduleId);
            setPendingSchedules(updatedSchedules);

            showSuccessToast("Agendamento cancelado com sucesso!");

            // Se não houver mais agendamentos pendentes, fechar modal e excluir o cliente
            if (updatedSchedules.length === 0 && selectedCustomer) {
                setIsSchedulesModalOpen(false);

                // Excluir cliente automaticamente depois que o modal fechar
                setTimeout(async () => {
                    if (selectedCustomer && selectedCustomer.id) {
                        try {
                            setIsDeleting(true);

                            // Excluir o cliente diretamente
                            await apiClient.delete(`/customer/${selectedCustomer.id}`);

                            // Atualizar a lista removendo o cliente excluído
                            setClientes(prev => prev.filter(cliente => cliente.id !== selectedCustomer.id));

                            showSuccessToast("Cliente excluído com sucesso após processar todos os agendamentos!", "Cliente removido");
                        } catch (error) {
                            console.error("Erro ao excluir cliente:", error);
                            let errorMsg = "Erro ao excluir cliente";
                            if (error?.response?.data?.error) {
                                errorMsg = error.response.data.error;
                            }
                            showErrorToast(errorMsg);
                        } finally {
                            setIsDeleting(false);
                            setSelectedCustomer(null);
                        }
                    }
                }, 800);
            }
        } catch (error) {
            console.error("Erro ao cancelar agendamento:", error);
            let errorMsg = "Erro ao cancelar agendamento.";

            if (error?.response?.data?.error) {
                errorMsg = error.response.data.error;
            }

            showErrorToast(errorMsg);
        } finally {
            setProcessingScheduleId("");
        }
    }

    // Função para verificar novamente os agendamentos ao fechar o modal
    function handleSchedulesModalClose() {
        setIsSchedulesModalOpen(false);
        setSelectedCustomer(null);
        setPendingSchedules([]);
    }

    // Função para excluir o cliente
    async function handleDeleteCustomer() {
        try {
            setIsDeleting(true);

            if (!deletingCustomer.id) {
                showErrorToast("ID do cliente não informado");
                return;
            }

            const apiClient = setupAPIClient();

            // Verificamos novamente se o cliente tem agendamentos pendentes antes de excluir
            const checkResponse = await apiClient.get(`/customer/${deletingCustomer.id}/schedules`);
            if (checkResponse.data.hasPendingSchedules) {
                setSelectedCustomer({
                    id: deletingCustomer.id,
                    name: deletingCustomer.name,
                    ...checkResponse.data.customer
                });
                setPendingSchedules(checkResponse.data.pendingSchedules);
                setIsSchedulesModalOpen(true);
                setIsDeleteDialogOpen(false);
                return;
            }

            // Se não tem agendamentos pendentes, prossegue com a exclusão
            await apiClient.delete(`/customer/${deletingCustomer.id}`);

            // Atualizar a lista removendo o cliente excluído
            setClientes(clientes.filter(cliente => cliente.id !== deletingCustomer.id));

            showSuccessToast("Cliente excluído com sucesso!", "Cliente removido");
        } catch (error) {
            console.error("Erro ao excluir cliente:", error);
            let errorMsg = "Não foi possível excluir o cliente.";

            // Verificar respostas específicas do backend
            if (error?.response?.data?.error) {
                errorMsg = error.response.data.error;
            } else if (error?.message) {
                errorMsg = error.message;
            }

            // Verificar se é erro de agendamento pendente e mostrar mensagem personalizada
            if (errorMsg.includes("agendamentos pendentes")) {
                errorMsg = "Este cliente possui agendamentos pendentes e não pode ser excluído. Finalize ou cancele todos os agendamentos do cliente primeiro.";
            }

            showErrorToast(errorMsg);
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
        }
    }

    return (
        <>
            <Head>
                <title>Clientes - Meu Barbeiro Pro</title>
            </Head>

            {/* Diálogo de confirmação de exclusão */}
            <AlertDialog
                isOpen={isDeleteDialogOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => setIsDeleteDialogOpen(false)}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent bg="barber.900" borderColor="gray.700" borderWidth="1px">
                        <AlertDialogHeader fontSize="lg" fontWeight="bold" color="white">
                            Excluir Cliente
                        </AlertDialogHeader>

                        <AlertDialogBody color="gray.200">
                            Tem certeza que deseja excluir o cliente <strong>{deletingCustomer.name}</strong>?
                            <Text mt={2} fontSize="sm" color="gray.400">
                                Esta ação não poderá ser desfeita.
                            </Text>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => setIsDeleteDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={handleDeleteCustomer}
                                ml={3}
                                isLoading={isDeleting}
                                loadingText="Excluindo..."
                            >
                                Excluir
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            {/* Modal de Agendamentos Pendentes */}
            <Modal
                isOpen={isSchedulesModalOpen}
                onClose={handleSchedulesModalClose}
                isCentered
                size="xl"
            >
                <ModalOverlay />
                <ModalContent bg="barber.900" borderColor="gray.700" borderWidth="1px">
                    <ModalHeader color="white">
                        Agendamentos Pendentes de {selectedCustomer?.name}
                    </ModalHeader>
                    <ModalCloseButton color="gray.400" />
                    <ModalBody>
                        <Text mb={4} color="gray.200">
                            Este cliente possui agendamentos pendentes que precisam ser concluídos ou cancelados antes da exclusão.
                        </Text>

                        {loadingSchedules ? (
                            <Flex justify="center" align="center" py={8}>
                                <Spinner color="orange.500" size="lg" />
                            </Flex>
                        ) : pendingSchedules.length === 0 ? (
                            <Box py={4} textAlign="center">
                                <Text color="gray.300">Todos os agendamentos foram processados.</Text>
                                <Button
                                    mt={4}
                                    colorScheme="orange"
                                    onClick={async () => {
                                        if (selectedCustomer && selectedCustomer.id) {
                                            setIsSchedulesModalOpen(false);

                                            try {
                                                setIsDeleting(true);
                                                const apiClient = setupAPIClient();

                                                // Excluir o cliente diretamente
                                                await apiClient.delete(`/customer/${selectedCustomer.id}`);

                                                // Atualizar a lista removendo o cliente excluído
                                                setClientes(prev => prev.filter(cliente => cliente.id !== selectedCustomer.id));

                                                showSuccessToast("Cliente excluído com sucesso!", "Cliente removido");
                                            } catch (error) {
                                                console.error("Erro ao excluir cliente:", error);
                                                let errorMsg = "Erro ao excluir cliente";
                                                if (error?.response?.data?.error) {
                                                    errorMsg = error.response.data.error;
                                                }
                                                showErrorToast(errorMsg);
                                            } finally {
                                                setIsDeleting(false);
                                                setSelectedCustomer(null);
                                            }
                                        } else {
                                            showErrorToast("Não foi possível identificar o cliente para exclusão.");
                                            setIsSchedulesModalOpen(false);
                                        }
                                    }}
                                >
                                    Excluir cliente
                                </Button>
                            </Box>
                        ) : (
                            <>
                                <Table variant="simple" size="sm" mb={4}>
                                    <Thead>
                                        <Tr>
                                            <Th color="gray.400">Serviço</Th>
                                            <Th color="gray.400">Data</Th>
                                            <Th color="gray.400" textAlign="right">Ações</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {pendingSchedules.map(schedule => {
                                            // Processando dados do agendamento

                                            let dateDisplay = "Horário não especificado";

                                            try {
                                                // Obter a data como string para garantir exibição consistente
                                                const dateField = schedule.schedule_date || schedule.date;

                                                if (dateField) {
                                                    // Tentar converter para Date e formatar
                                                    const dateObj = new Date(dateField);

                                                    if (!isNaN(dateObj.getTime())) {
                                                        // Se é uma data válida, formatar como dia/mês/ano
                                                        dateDisplay = dateObj.toLocaleDateString('pt-BR');

                                                        // Adicionar hora se disponível
                                                        if (schedule.time) {
                                                            dateDisplay += ` às ${schedule.time}`;
                                                        }
                                                    } else {
                                                        // Se falhar a conversão, tentar usar a string diretamente
                                                        dateDisplay = typeof dateField === 'string' ? dateField : "Horário não especificado";

                                                        if (schedule.time) {
                                                            dateDisplay += ` às ${schedule.time}`;
                                                        }
                                                    }
                                                }
                                            } catch (e) {
                                                console.error("Erro ao formatar data:", e);
                                            }

                                            return (
                                                <Tr key={schedule.id}>
                                                    <Td color="white">{schedule.haircut?.name || "Serviço"}</Td>
                                                    <Td color="white">{dateDisplay}</Td>
                                                    <Td textAlign="right">
                                                        <HStack spacing={2} justify="flex-end">
                                                            <Tooltip label="Concluir agendamento">
                                                                <IconButton
                                                                    aria-label="Concluir agendamento"
                                                                    icon={<FiCheck />}
                                                                    size="sm"
                                                                    colorScheme="green"
                                                                    variant="outline"
                                                                    isLoading={processingScheduleId === schedule.id}
                                                                    onClick={() => handleCompleteSchedule(schedule.id)}
                                                                />
                                                            </Tooltip>
                                                            <Tooltip label="Cancelar agendamento">
                                                                <IconButton
                                                                    aria-label="Cancelar agendamento"
                                                                    icon={<FiX />}
                                                                    size="sm"
                                                                    colorScheme="red"
                                                                    variant="outline"
                                                                    isLoading={processingScheduleId === schedule.id}
                                                                    onClick={() => handleCancelSchedule(schedule.id)}
                                                                />
                                                            </Tooltip>
                                                        </HStack>
                                                    </Td>
                                                </Tr>
                                            );
                                        })}
                                    </Tbody>
                                </Table>

                                <Divider my={4} borderColor="gray.700" />

                                <Text fontSize="sm" color="gray.400" mb={4}>
                                    <Icon as={FiClipboard} mr={2} />
                                    Conclua ou cancele todos os agendamentos para poder excluir este cliente.
                                </Text>
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" color="gray.300" onClick={handleSchedulesModalClose}>
                            Fechar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Sidebar>
                <Flex
                    direction="column"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    w="100%"
                    maxW="1200px"
                    mx="auto"
                    px={{ base: 3, md: 4 }}
                    pt={0}
                    minH="100vh"
                    bg={"gray.900"}
                >
                    {/* Cabeçalho */}
                    <Flex
                        w="100%"
                        direction={{ base: "column", md: "row" }}
                        justify="space-between"
                        align={{ base: "flex-start", md: "center" }}
                        mb={6}
                    >
                        <Box mb={{ base: 4, md: 0 }}>
                            <Heading as="h1" size="lg" color={textColor} mb={2}>
                                Clientes
                            </Heading>
                            <Text color={subTextColor}>
                                Gerencie seus clientes cadastrados
                            </Text>
                        </Box>
                    </Flex>

                    {/* Barra de filtros */}
                    <Flex
                        w="100%"
                        bg={filterBg}
                        p={{ base: 3, md: 5 }}
                        borderRadius="lg"
                        shadow="sm"
                        borderWidth="1px"
                        borderColor={borderColor}
                        direction={{ base: "column", md: "row" }}
                        align="center"
                        justify="space-between"
                        mb={8}
                    >
                        <HStack flex={1} mr={4} align="center" spacing={4} w="100%">
                            <Box w="100%" maxW="340px">
                                <EnhancedInput
                                    id="search-client"
                                    label=" "
                                    placeholder="Buscar cliente..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    leftIcon={FiSearch}
                                    autoComplete="off"
                                />
                            </Box>
                            <Box w="100%" maxW="220px">
                                <Select
                                    value={filterValue}
                                    onChange={(e) => setFilterValue(e.target.value)}
                                    variant="filled"
                                    bg={filterBg}
                                    borderColor={borderColor}
                                    fontSize="md"
                                    borderRadius="md"
                                    _focus={{
                                        borderColor: "orange.400",
                                        boxShadow: "0 0 0 1px #ffb110",
                                    }}
                                >
                                    <option value="all">Todos os clientes</option>
                                    <option value="active">Apenas ativos</option>
                                    <option value="inactive">Apenas inativos</option>
                                </Select>
                            </Box>
                        </HStack>
                        <Link href="/clientes/novo">
                            <Button
                                leftIcon={<FiPlus />}
                                colorScheme="orange"
                                fontWeight="semibold"
                                textColor="barber.800"
                                size="md"
                                ml={{ base: 0, md: 4 }}
                                mt={{ base: 4, md: 0 }}
                            >
                                Novo cliente
                            </Button>
                        </Link>
                    </Flex>

                    {/* Grid de clientes */}
                    <Box w="100%" as="main" bg={bgColor} p={4}>
                        {loading ? (
                            <Flex
                                align="center"
                                justify="center"
                                minH="220px"
                            >
                                <Spinner
                                    color="orange.500"
                                    size="xl"
                                    thickness="4px"
                                />
                            </Flex>
                        ) : clientes.length === 0 ? (
                            <Flex
                                direction="column"
                                align="center"
                                justify="center"
                                bg={cardBg}
                                p={8}
                                borderRadius="lg"
                                shadow="md"
                                borderWidth="1px"
                                borderColor={borderColor}
                                minH="220px"
                            >
                                <Icon as={FiUsers} w={12} h={12} color={accentColor} mb={4} />
                                <Heading size="md" mb={2} color={textColor}>
                                    Nenhum cliente encontrado
                                </Heading>
                                <Text color={subTextColor} mb={6}>
                                    {searchTerm
                                        ? "Tente ajustar seus termos de busca"
                                        : "Cadastre seu primeiro cliente para começar"}
                                </Text>
                                <Link href="/clientes/novo">
                                    <Button
                                        leftIcon={<FiPlus />}
                                        colorScheme="orange"
                                        fontWeight="semibold"
                                        textColor="barber.800"
                                    >
                                        Adicionar cliente
                                    </Button>
                                </Link>
                            </Flex>
                        ) : (
                            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                                {clientes.map(cliente => (
                                    <Card
                                        key={cliente.id}
                                        bg={cardBg}
                                        borderColor={borderColor}
                                        borderWidth="1px"
                                        overflow="hidden"
                                        transition="all 0.2s"
                                        _hover={{ transform: "translateY(-5px)", shadow: "md" }}
                                    >
                                        <CardBody p={5}>
                                            <Heading size="md" mb={3} color={textColor}>
                                                {cliente.name}
                                            </Heading>

                                            {cliente.phone && (
                                                <HStack mb={2} color={subTextColor}>
                                                    <Icon as={FiPhone} boxSize={4} />
                                                    <Text>{formatPhoneNumber(cliente.phone)}</Text>
                                                </HStack>
                                            )}

                                            {cliente.email && (
                                                <HStack mb={3} color={subTextColor}>
                                                    <Icon as={FiMail} boxSize={4} />
                                                    <Text fontSize="sm" noOfLines={1}>{cliente.email}</Text>
                                                </HStack>
                                            )}

                                            <HStack mt={4} justify="space-between">
                                                <Badge
                                                    colorScheme="green"
                                                    px={2}
                                                    py={1}
                                                    borderRadius="md"
                                                >
                                                    Cliente
                                                </Badge>
                                                <HStack spacing={2}>
                                                    <Link href={`/clientes/${cliente.id}`}>
                                                        <Button
                                                            size="sm"
                                                            colorScheme="blue"
                                                            variant="outline"
                                                            _hover={{
                                                                bg: "blue.700",
                                                                transform: "translateY(-2px)",
                                                            }}
                                                        >
                                                            Editar
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        size="sm"
                                                        colorScheme="red"
                                                        variant="outline"
                                                        _hover={{
                                                            bg: "red.700",
                                                            transform: "translateY(-2px)",
                                                        }}
                                                        onClick={() => handleDeleteConfirm(cliente.id, cliente.name)}
                                                    >
                                                        Excluir
                                                    </Button>
                                                </HStack>
                                            </HStack>
                                        </CardBody>
                                    </Card>
                                ))}
                            </SimpleGrid>
                        )}
                    </Box>
                </Flex>
            </Sidebar>
        </>
    );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {}
    }
});
