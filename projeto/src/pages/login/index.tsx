import { useState, useContext, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import {
  Flex,
  Text,
  Center,
  Button,
  Checkbox,
  Progress,
  Box,
  useBreakpointValue,
  Divider,
  IconButton,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import { motion } from "framer-motion";

import { AuthContext } from "../../context/AuthContext";
import { canSSRGuest } from "../../utils/canSSRGuest";
import { EnhancedInput } from "../../components/enhanced-input";
import { showWarningToast, showErrorToast } from "../../utils/toastifyConfig";
// Usar a nova sintaxe recomendada para motion
const MotionBox = motion(Box, { forwardMotionProps: true });

export default function Login() {
  const { signIn, getSavedEmail, clearSavedEmail } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const isMobile = useBreakpointValue({ base: true, md: false });

  // Carregar email salvo (executar apenas uma vez) e verificar se é um logout
  useEffect(() => {
    // Verificar se o usuário acabou de fazer logout (via parâmetro na URL)
    const isLogout = typeof window !== 'undefined' &&
      (window.location.search.includes('logout=true') ||
        localStorage.getItem('just_logged_out') === 'true');

    if (isLogout) {
      console.log('Detectado logout recente, limpando dados');
      // Limpar qualquer token que possa ter persistido
      clearSavedEmail();

      // Marcar que já tratamos o logout
      if (typeof window !== 'undefined') {
        localStorage.removeItem('just_logged_out');

        // Limpar a URL para remover o parâmetro logout
        const url = new URL(window.location.href);
        url.searchParams.delete('logout');
        window.history.replaceState({}, document.title, url.toString());
      }

      // Não carregar email salvo após logout
      return;
    }

    // Carregar email salvo apenas se não for após logout
    const savedEmail = getSavedEmail();
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  async function handleLogin() {
    setEmailError("");

    if (email === "" || password === "") {
      showWarningToast("Por favor, preencha todos os campos.", "Atenção!");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Por favor, insira um email válido");
      return;
    }

    if (password.length < 6) {
      showErrorToast("A senha deve ter pelo menos 6 caracteres", "Senha muito curta");
      return;
    }

    try {
      setIsLoading(true);
      await signIn({
        email,
        password,
        remember: rememberMe,
      });
    } catch (error: any) {
      console.error("Erro de login:", error?.response?.status, error?.response?.data);

      // Tratar especificamente o erro de limite de requisições (429)
      if (error?.response?.status === 429) {
        showErrorToast(
          "Muitas tentativas de login. Por favor, aguarde um minuto e tente novamente.",
          "Limite de tentativas excedido"
        );
      } else {
        // Tratamento para outros erros
        const errorMessage =
          error?.response?.data?.error ||
          "Verifique suas credenciais e tente novamente";
        showErrorToast(errorMessage, "Erro ao fazer login");
      }
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <Head>
        <title>MK veiculos - Faça login para acessar</title>
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
          <Box // Linha gradiente no topo
            position="absolute"
            top="0"
            left="0"
            right="0"
            h="4px"
            bgGradient="linear(90deg, #ffb110 0%, #ff9900 100%)"
            boxShadow="0 0 10px rgba(255, 177, 16, 0.6)"
          />

          <Center p={{ base: 4, md: 6 }} mb={6}>
            <Image
              src="/images/logo.png"
              quality={100}
              width={240}
              height={60}
              alt="Logo Meu Barbeiro PRO"
              style={{
                background: "none",
                objectFit: "contain" // Usar style em vez da prop obsoleta
              }}
            />
          </Center>

          <Flex direction="column" gap={4}>
            {/* Campo de Email */}
            <EnhancedInput
              id="email"
              label="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              placeholder="exemplo@email.com"
              type="email"
              isInvalid={!!emailError}
              errorMessage={emailError}
              leftIcon={FiMail}
              autoComplete="email"
              isRequired
            />
            {/* Campo de Senha */}
            <EnhancedInput
              id="password"
              label="Senha"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                calculatePasswordStrength(e.target.value);
              }}
              placeholder="******"
              type={showPassword ? "text" : "password"}
              leftIcon={FiLock}
              rightElement={
                <IconButton
                  h="1.75rem"
                  size="sm"
                  bg="transparent"
                  aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => setShowPassword(!showPassword)}
                  _hover={{ bg: "rgba(255,255,255,0.1)" }}
                  color="gray.400"
                  tabIndex={-1}
                />
              }
              isRequired
            />
            {/* Barra de força da senha */}
            {password.length > 0 && (
              <Progress
                value={passwordStrength}
                size="xs"
                colorScheme={
                  passwordStrength <= 25
                    ? "red"
                    : passwordStrength <= 50
                      ? "orange"
                      : passwordStrength <= 75
                        ? "yellow"
                        : "green"
                }
                mt={2}
                borderRadius="full"
              />
            )}
            <Flex
              direction={{ base: "column", sm: "row" }}
              justify="space-between"
              align={{ base: "flex-start", sm: "center" }}
              gap={2}
              mt={1}
            >
              <Checkbox
                colorScheme="orange"
                isChecked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              >
                Lembrar email
              </Checkbox>
              <Link href="/recuperar-senha" passHref>
                <Text
                  color="gray.300"
                  fontSize="sm"
                  textDecor="underline"
                  _hover={{ color: "#ffb110" }}
                  transition="all 0.2s"
                  fontWeight="medium"
                >
                  Esqueci minha senha
                </Text>
              </Link>
            </Flex>
            {/* Botão Acessar Sistema */}
            <Button
              variant="solid"
              colorScheme="orange"
              size="lg"
              fontWeight="bold"
              color="gray.800"
              mt={4}
              onClick={handleLogin}
              isLoading={isLoading}
              leftIcon={<FiLogIn />}
              height="56px"
              fontSize="md"
              w="100%"
            >
              Acessar Sistema
            </Button>
            {/* Divisor "ou" */}
            <Flex align="center" mt={6} mb={2}>
              <Divider flex="1" borderColor="rgba(255,255,255,0.1)" />
              <Text color="gray.400" mx={3} fontSize="sm">
                ou
              </Text>
              <Divider flex="1" borderColor="rgba(255,255,255,0.1)" />
            </Flex>
            {/* Botão Criar conta gratuita */}
            <Flex justifyContent="center" mt={2}>
              <Link href="/register" passHref>
                <Button
                  variant="outline"
                  colorScheme="orange"
                  width="100%"
                  transition="all 0.2s"
                >
                  Criar conta gratuita
                </Button>
              </Link>
            </Flex>
          </Flex>
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
