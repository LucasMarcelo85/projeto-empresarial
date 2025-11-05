import { useState } from "react";
import Head from "next/head";
import {
    Box,
    Flex,
    Button,
    Heading,
    Text,
    VStack,
    HStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Sidebar } from "../../components/sidebar";
import Link from "next/link";
import { setupAPIClient } from "../../services/api";
import { showSuccessToast, showErrorToast } from "../../utils/toastifyConfig";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { EnhancedInput } from "../../components/enhanced-input";
import { formatPhoneNumber, cleanPhoneNumber, isValidPhoneNumber } from "../../utils/phoneFormatter";

export default function NovoCliente() {
    const router = useRouter();
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
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

    async function handleSubmit(e: React.FormEvent) {
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
        if (telefone && !isValidPhoneNumber(telefone)) {
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
            await apiClient.post("/customer", {
                name: nome.trim(),
                phone: telefone ? cleanPhoneNumber(telefone) : null,
                email: email || null
            });

            showSuccessToast("Cliente cadastrado com sucesso!", "Cliente cadastrado!");

            // Redirecionar para a lista de clientes
            router.push("/clientes");
        } catch (error) {
            console.error("Erro ao cadastrar cliente:", error);
            let errorMsg = "Não foi possível cadastrar o cliente.";

            if (error.response?.data?.error) {
                errorMsg = error.response.data.error;
            }

            showErrorToast(errorMsg);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Head>
                <title>Novo Cliente - AutoVendas Pro</title>
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
                                Novo Cliente
                            </Heading>
                            <Text color={subTextColor}>
                                Cadastre um novo cliente para sua loja
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
                                <Button variant="ghost" colorScheme="gray">
                                    Cancelar
                                </Button>
                            </Link>
                            <Button
                                colorScheme="orange"
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
    return {
        props: {}
    }
});
