import { useState, useEffect } from "react";
import Head from "next/head";
import {
    Box,
    Flex,
    Button,
    Heading,
    Text,
    VStack,
    HStack,
    Spinner,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Sidebar } from "../../components/sidebar";
import Link from "next/link";
import { setupAPIClient } from "../../services/api";
import { showSuccessToast, showErrorToast } from "../../utils/toastifyConfig";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { EnhancedInput } from "../../components/enhanced-input";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { formatPhoneNumber, cleanPhoneNumber } from "../../utils/phoneFormatter";

interface CustomerProps {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    updated_at: string;
}

export default function EditarCliente({ id, customerInfo }) {
    const router = useRouter();
    const [nome, setNome] = useState(customerInfo?.name || "");
    const [telefone, setTelefone] = useState(customerInfo?.phone ? formatPhoneNumber(customerInfo.phone) : "");
    const [email, setEmail] = useState(customerInfo?.email || "");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [errors, setErrors] = useState({
        nome: "",
        telefone: "",
        email: "",
    });

    // Cores do tema
    const bgColor = "gray.900";
    const cardBg = "barber.900";
    const textColor = "gray.100";
    const subTextColor = "gray.400";
    const borderColor = "gray.700";

    // Carregar dados do cliente caso não venham do SSR
    useEffect(() => {
        async function loadCustomer() {
            if (!id) return;
            if (customerInfo) return;

            setIsFetching(true);
            try {
                const apiClient = setupAPIClient();
                const response = await apiClient.get(`/customer/${id}`);

                const { name, phone, email } = response.data;

                setNome(name);
                setTelefone(phone || "");
                setEmail(email || "");
            } catch (error) {
                console.error("Erro ao carregar cliente:", error);
                showErrorToast("Não foi possível carregar os dados do cliente");
                router.push("/clientes");
            } finally {
                setIsFetching(false);
            }
        }

        loadCustomer();
    }, [id, customerInfo]);

    async function handleSubmit(e) {
        e.preventDefault();

        // Validação
        const newErrors = {
            nome: "",
            telefone: "",
            email: "",
        };

        if (!nome.trim()) {
            newErrors.nome = "Nome é obrigatório";
        }

        // Validar telefone apenas se tiver sido preenchido
        if (telefone && !telefone.match(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)) {
            newErrors.telefone = "Formato inválido. Use (99) 99999-9999";
        }

        // Validar email apenas se tiver sido preenchido
        if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            newErrors.email = "Email inválido";
        }

        setErrors(newErrors);

        // Se houver erros, não prossegue
        if (newErrors.nome || newErrors.telefone || newErrors.email) {
            return;
        }

        setIsLoading(true);

        try {
            const apiClient = setupAPIClient();
            await apiClient.put(`/customer/${id}`, {
                name: nome.trim(),
                phone: telefone ? cleanPhoneNumber(telefone) : null,
                email: email || null
            });

            showSuccessToast("Cliente atualizado com sucesso!", "Cliente atualizado!");

            // Redirecionar para a lista de clientes
            router.push("/clientes");
        } catch (error) {
            console.error("Erro ao atualizar cliente:", error);
            let errorMsg = "Não foi possível atualizar o cliente.";

            if (error.response?.data?.error) {
                errorMsg = error.response.data.error;
            }

            showErrorToast(errorMsg);
        } finally {
            setIsLoading(false);
        }
    }

    if (isFetching) {
        return (
            <>
                <Head>
                    <title>Carregando Cliente - Meu Barbeiro Pro</title>
                </Head>
                <Sidebar>
                    <Flex
                        justify="center"
                        align="center"
                        minH="100vh"
                        bg={bgColor}
                        p={4}
                    >
                        <Spinner
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="gray.700"
                            color="orange.500"
                            size="xl"
                        />
                    </Flex>
                </Sidebar>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>Editar Cliente - Meu Barbeiro Pro</title>
            </Head>
            <Sidebar>
                <Flex
                    direction="column"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    w="100%"
                    maxW="520px"
                    mx="auto"
                    px={{ base: 3, md: 4 }}
                    pt={0}
                    minH="100vh"
                    bg={"gray.900"}
                >
                    {/* Cabeçalho */}
                    <Flex w="100%" justify="space-between" align="center" mb={8} mt={2}>
                        <Box>
                            <Heading as="h1" size="lg" color={textColor} mb={2}>
                                Editar Cliente
                            </Heading>
                            <Text color={subTextColor}>
                                Atualize os dados do cliente
                            </Text>
                        </Box>
                    </Flex>

                    {/* Card do formulário */}
                    <Box
                        as="form"
                        onSubmit={handleSubmit}
                        w="100%"
                        bg={cardBg}
                        p={{ base: 4, md: 8 }}
                        borderRadius="lg"
                        shadow="md"
                        borderWidth="1px"
                        borderColor={borderColor}
                    >
                        <VStack spacing={5} align="stretch">
                            <EnhancedInput
                                id="nome"
                                label="Nome completo"
                                placeholder="Digite o nome do cliente"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                isRequired
                                autoFocus
                                isInvalid={!!errors.nome}
                                errorMessage={errors.nome}
                            />
                            <EnhancedInput
                                id="telefone"
                                label="Telefone"
                                placeholder="(99) 99999-9999"
                                value={telefone}
                                onChange={(e) => {
                                    // Formatar telefone usando a função de formatação
                                    setTelefone(formatPhoneNumber(e.target.value));
                                }}
                                type="tel"
                                maxLength={15}
                                isInvalid={!!errors.telefone}
                                errorMessage={errors.telefone}
                            />
                            <EnhancedInput
                                id="email"
                                label="E-mail"
                                placeholder="cliente@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                isInvalid={!!errors.email}
                                errorMessage={errors.email}
                            />
                        </VStack>
                        <HStack mt={8} spacing={4} justify="flex-end">
                            <Link href="/clientes">
                                <Button leftIcon={<FiArrowLeft />} variant="ghost" colorScheme="gray">
                                    Voltar
                                </Button>
                            </Link>
                            <Button
                                colorScheme="orange"
                                leftIcon={<FiSave />}
                                type="submit"
                                isLoading={isLoading}
                                loadingText="Salvando..."
                                px={8}
                            >
                                Salvar
                            </Button>
                        </HStack>
                    </Box>
                </Flex>
            </Sidebar>
        </>
    );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const { id } = ctx.params;

    if (!id) {
        return {
            redirect: {
                destination: '/clientes',
                permanent: false,
            }
        };
    }

    try {
        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get(`/customer/${id}`);

        return {
            props: {
                id,
                customerInfo: response.data
            }
        };
    } catch (err) {
        console.error("Erro ao buscar dados do cliente:", err);

        // Caso cliente não seja encontrado ou outro erro
        return {
            redirect: {
                destination: '/clientes',
                permanent: false
            }
        };
    }
});
