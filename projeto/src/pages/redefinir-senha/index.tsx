import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import {
    Flex,
    Text,
    Center,
    Button,
    IconButton,
    Progress,
    Box,
} from "@chakra-ui/react";
import Link from "next/link";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { api } from "../../services/apiClient";
import { canSSRGuest } from "../../utils/canSSRGuest";
import { EnhancedInput } from "../../components/enhanced-input";
import { FiLock } from "react-icons/fi";
import { showErrorToast, showSuccessToast } from "../../utils/toastifyConfig";

// Definição do componente MotionBox
const MotionBox = motion(Box);

export default function RedefinirSenha() {
    const router = useRouter();
    const { token } = router.query;

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [tokenValid, setTokenValid] = useState(true);

    useEffect(() => {
        // Verificar se o token está presente
        if (token) {
            validateToken(token as string);
        }
    }, [token]);

    const validateToken = async (tokenValue: string) => {
        try {
            // Verificar token com o backend (opcional)
            // const response = await api.post('/password/validate-token', { token: tokenValue })
            setTokenValid(true);
        } catch (error) {
            setTokenValid(false);
            showErrorToast(
                "O link de redefinição expirou ou é inválido. Solicite um novo link.",
                "Token inválido"
            );
        }
    };

    const calculatePasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 6) strength += 25;
        if (password.match(/[A-Z]/)) strength += 25;
        if (password.match(/[0-9]/)) strength += 25;
        if (password.match(/[^A-Za-z0-9]/)) strength += 25;
        setPasswordStrength(strength);
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 25) return "red.500";
        if (passwordStrength <= 50) return "orange.500";
        if (passwordStrength <= 75) return "yellow.500";
        return "green.500";
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !isLoading) {
            handleResetPassword();
        }
    };

    const validateForm = () => {
        let isValid = true;

        if (password.length < 6) {
            setPasswordError("A senha deve ter pelo menos 6 caracteres");
            isValid = false;
        } else {
            setPasswordError("");
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError("As senhas não coincidem");
            isValid = false;
        } else {
            setConfirmPasswordError("");
        }

        return isValid;
    };

    const handleResetPassword = async () => {
        if (!token) {
            showErrorToast("Token não encontrado", "Erro");
            return;
        }

        if (!validateForm()) return;

        try {
            setIsLoading(true);

            await api.post("/password/reset", {
                token,
                newPassword: password,
            });

            showSuccessToast(
                "Você será redirecionado para a página de login.",
                "Senha redefinida com sucesso!"
            );

            // Redirecionar para o login após 2 segundos
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.error || "Erro ao redefinir senha";
            showErrorToast(errorMessage, "Erro");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Meu Barbeiro PRO - Redefinir Senha</title>
            </Head>
            <Flex
                background={"barber.900"}
                minHeight="100vh"
                alignItems="center"
                justifyContent="center"
                py={8}
                position="relative"
            >
                <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    width={{ base: "90%", md: "450px" }}
                    p={{ base: 6, md: 8 }}
                    rounded="xl"
                    bg={"barber.900"} // Cor sólida do tema
                    borderWidth="1px"
                    borderColor={"whiteAlpha.100"} // Borda sutil
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
                            style={{ background: "none" }} // Remove qualquer fundo da logo
                        />
                    </Center>
                    {!tokenValid ? (
                        <Box
                            textAlign="center"
                            p={4}
                            borderRadius="lg"
                            bg={"red.900"}
                            border="1px solid"
                            borderColor={"red.700"}
                            boxShadow="0 4px 12px rgba(229, 62, 62, 0.2)"
                            color={"red.200"}
                        >
                            <Text fontSize="xl" mb={4} fontWeight="bold">
                                Link expirado ou inválido
                            </Text>
                            <Text mb={6}>
                                Este link de redefinição de senha não é mais válido. Por favor,
                                solicite um novo link.
                            </Text>
                            <Link href="/recuperar-senha">
                                <Button colorScheme="orange" variant="solid">
                                    Solicitar novo link
                                </Button>
                            </Link>
                        </Box>
                    ) : (
                        <>
                            <Text color={"gray.200"} textAlign="center" mb={6} fontSize="md">
                                Digite sua nova senha
                            </Text>
                            <Flex direction="column" gap={4}>
                                <EnhancedInput
                                    id="password"
                                    label="Nova senha"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        calculatePasswordStrength(e.target.value);
                                        if (confirmPassword) {
                                            setConfirmPasswordError(
                                                e.target.value !== confirmPassword
                                                    ? "As senhas não coincidem"
                                                    : "",
                                            );
                                        }
                                    }}
                                    placeholder="Digite sua nova senha"
                                    type={showPassword ? "text" : "password"}
                                    leftIcon={FiLock}
                                    rightElement={
                                        <IconButton
                                            h="1.75rem"
                                            size="sm"
                                            bg="transparent"
                                            aria-label={
                                                showPassword ? "Ocultar senha" : "Mostrar senha"
                                            }
                                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                            onClick={() => setShowPassword(!showPassword)}
                                            _hover={{ bg: "rgba(255,255,255,0.1)" }}
                                            color="gray.400"
                                            isDisabled={isLoading}
                                            tabIndex={-1}
                                        />
                                    }
                                    isInvalid={!!passwordError}
                                    errorMessage={passwordError}
                                    isRequired
                                />
                                {password && (
                                    <Progress
                                        value={passwordStrength}
                                        colorScheme={getPasswordStrengthColor()}
                                        size="xs"
                                        mt={2}
                                        borderRadius="full"
                                    />
                                )}
                                <EnhancedInput
                                    id="confirmPassword"
                                    label="Confirmar senha"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setConfirmPasswordError(
                                            password !== e.target.value
                                                ? "As senhas não coincidem"
                                                : "",
                                        );
                                    }}
                                    placeholder="Confirme sua nova senha"
                                    type={showConfirmPassword ? "text" : "password"}
                                    leftIcon={FiLock}
                                    rightElement={
                                        <IconButton
                                            h="1.75rem"
                                            size="sm"
                                            bg="transparent"
                                            aria-label={
                                                showConfirmPassword ? "Ocultar senha" : "Mostrar senha"
                                            }
                                            icon={
                                                showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />
                                            }
                                            onClick={() =>
                                                setShowConfirmPassword(!showConfirmPassword)
                                            }
                                            _hover={{ bg: "rgba(255,255,255,0.1)" }}
                                            color="gray.400"
                                            isDisabled={isLoading}
                                            tabIndex={-1}
                                        />
                                    }
                                    isInvalid={!!confirmPasswordError}
                                    errorMessage={confirmPasswordError}
                                    isRequired
                                />{" "}
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
                                    onClick={handleResetPassword}
                                    isLoading={isLoading}
                                    loadingText="Redefinindo..."
                                >
                                    Redefinir Senha
                                </Button>
                            </Flex>
                        </>
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
                </MotionBox>
            </Flex>
        </>
    );
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
    return {
        props: {},
    };
});
