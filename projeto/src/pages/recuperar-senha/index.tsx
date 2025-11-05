import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import {
    Flex,
    Text,
    Center,
    Button,
    Box,
    useBreakpointValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { FiMail } from "react-icons/fi";
import { motion } from "framer-motion";
import { canSSRGuest } from "../../utils/canSSRGuest";
import { EnhancedInput } from "../../components/enhanced-input";
import { api } from "../../services/apiClient";
import {
    showSuccessToast,
    showErrorToast,
    showWarningToast
} from "../../utils/toastifyConfig";

export default function RecuperarSenha() {
    const isMobile = useBreakpointValue({ base: true, md: false });

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [recoveryEmailSent, setRecoveryEmailSent] = useState(false);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !isLoading) {
            handleRecoveryRequest();
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (emailError) {
            setEmailError("");
        }
    };

    async function handleRecoveryRequest() {
        setEmailError("");

        if (email === "") {
            setEmailError("Por favor, informe seu email.");
            showWarningToast("Por favor, informe seu email.", "Atenção!");
            return;
        }

        try {
            setIsLoading(true);

            // Chamada à API para recuperação de senha
            const response = await api.post("/password/recover", { email });

            setRecoveryEmailSent(true);
            showSuccessToast(
                "Verifique sua caixa de entrada para redefinir sua senha.",
                "Email enviado!"
            );
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.error ||
                "Erro ao solicitar recuperação de senha";
            showErrorToast(errorMessage, "Erro");
        } finally {
            setIsLoading(false);
        }
    }
    const successAnimation = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };

    const formAnimation = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3,
                ease: "easeOut",
            },
        },
    };

    return (
        <>
            <Head>
                <title>Meu Barbeiro PRO - Recuperar Senha</title>
            </Head>
            <Flex
                background={"barber.900"}
                minHeight="100vh"
                alignItems="center"
                justifyContent="center"
                py={8}
                position="relative"
            >
                <Box
                    as={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transitionDuration="0.5s"
                    width={{ base: "90%", md: "450px" }}
                    p={{ base: 6, md: 8 }}
                    rounded="xl"
                    bg={"barber.900"}
                    borderWidth="1px"
                    borderColor={"whiteAlpha.100"}
                    boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.8)"
                    position="relative"
                    overflow="hidden"
                    zIndex={1}
                >
                    {" "}
                    <Box
                        position="absolute"
                        top="0"
                        left="0"
                        right="0"
                        h="4px"
                        bgGradient="linear(to-r, #ffb110, #ff9900)"
                        boxShadow="0 0 10px rgba(255, 177, 16, 0.6)"
                    />
                    <Center p={{ base: 4, md: 6 }} mb={6}>
                        <Image
                            src="/images/logo.png"
                            quality={100}
                            width={240}
                            height={60}
                            objectFit="contain"
                            alt="Logo Meu Barbeiro PRO"
                        />
                    </Center>
                    {!recoveryEmailSent ? (
                        <>
                            <Text color={"gray.200"} textAlign="center" mb={6} fontSize="md">
                                Informe seu e-mail para receber as instruções.
                            </Text>
                            <EnhancedInput
                                id="email"
                                label="Email"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="exemplo@email.com"
                                type="email"
                                leftIcon={FiMail}
                                isInvalid={!!emailError}
                                errorMessage={emailError}
                                autoComplete="email"
                                isRequired
                            />
                            <Button
                                variant="solid"
                                colorScheme="orange"
                                size="lg"
                                w="100%"
                                height="56px"
                                fontSize="md"
                                fontWeight="bold"
                                color="gray.800"
                                mt={4}
                                onClick={handleRecoveryRequest}
                                isLoading={isLoading}
                                loadingText="Enviando..."
                                leftIcon={<FiMail />}
                            >
                                Recuperar Senha
                            </Button>
                        </>
                    ) : (
                        <Box
                            textAlign="center"
                            p={4}
                            borderRadius="lg"
                            bg={"green.900"}
                            border="1px solid"
                            borderColor={"green.700"}
                            boxShadow="0 4px 12px rgba(46, 213, 115, 0.2)"
                        >
                            <Text color={"green.400"} fontSize="xl" mb={4} fontWeight="bold">
                                Email enviado com sucesso!
                            </Text>
                            <Text color={"gray.100"} mb={6}>
                                Verifique sua caixa de entrada e siga as instruções para
                                redefinir sua senha.
                            </Text>
                            <Link href="/login" passHref>
                                <Button variant="outline" colorScheme="green">
                                    Voltar para o Login
                                </Button>
                            </Link>
                        </Box>
                    )}
                    <Center mt={2} color={"white"}>
                        <Link href="/login">
                            <Text
                                cursor="pointer"
                                fontSize="sm"
                                _hover={{ color: "#ffb110" }}
                                transition="all 0.2s"
                            >
                                Lembrou sua senha?{" "}
                                <Text
                                    as="span"
                                    color="#ffb110"
                                    fontWeight="bold"
                                    textDecor="underline"
                                >
                                    Faça login
                                </Text>
                            </Text>
                        </Link>
                    </Center>
                </Box>
            </Flex>
        </>
    );
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
    return {
        props: {},
    };
});
