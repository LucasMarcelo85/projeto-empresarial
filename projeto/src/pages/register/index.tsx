import { useState, useContext } from "react";
import Head from "next/head";
import Image from "next/image";
import {
  Flex,
  Text,
  Center,
  Button,
  IconButton,
  Progress,
  Box,
  useBreakpointValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FiUser, FiMail, FiLock } from "react-icons/fi";

import { EnhancedInput } from "../../components/enhanced-input";
import { AuthContext } from "../../context/AuthContext";

import { canSSRGuest } from "../../utils/canSSRGuest";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast
} from "../../utils/toastifyConfig";
import { motion } from "framer-motion";
import { validateEmail, validateName } from "@/utils/validators";

export default function Register() {
  const { signUp } = useContext(AuthContext);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

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
    if (e.key === "Enter") {
      handleRegister();
    }
  };

  async function handleRegister() {
    setNameError("");
    setEmailError("");

    if (name === "" || email === "" || password === "") {
      showWarningToast("Preencha todos os campos.", "Atenção!");
      return;
    }

    if (!validateName(name)) {
      setNameError("O nome deve ter pelo menos 3 caracteres");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Por favor, insira um email válido");
      return;
    }

    if (password.length < 6) {
      showErrorToast(
        "A senha deve ter pelo menos 6 caracteres",
        "Senha muito curta"
      );
      return;
    }

    try {
      setIsLoading(true);
      await signUp({
        name,
        email,
        password,
      });

      showSuccessToast(
        "Redirecionando para o login...",
        "Cadastro realizado!"
      );
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error || "Erro ao realizar cadastro";
      showErrorToast(errorMessage, "Erro no cadastro");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Crie sua conta na MK veiculos</title>
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
          <Box // Linha gradiente no topo
            position="absolute"
            top="0"
            left="0"
            right="0"
            h="4px"
            bgGradient="linear(90deg, #ffb110 0%, #ff9900 100%)"
            boxShadow="0 0 10px rgba(255,177,16,0.6)"
          />
          <Center p={{ base: 4, md: 6 }} mb={6}>
            <Image
              src="/images/logo.png"
              quality={100}
              width={240}
              height={60}
              objectFit="contain"
              alt="Logo AutoVendas Pro"
              style={{ background: "none" }}
            />
          </Center>
          {/* Nome da loja */}
          <EnhancedInput
            id="name"
            label="Nome da loja"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError("");
            }}
            placeholder="Nome da sua loja"
            type="text"
            isInvalid={!!nameError}
            errorMessage={nameError}
            leftIcon={FiUser}
            isRequired
          />
          {/* Email */}
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
          {/* Senha */}
          <EnhancedInput
            id="password"
            label="Senha"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              calculatePasswordStrength(e.target.value);
            }}
            placeholder="Sua senha"
            type={showPassword ? "text" : "password"}
            leftIcon={FiLock}
            rightElement={
              <IconButton
                h="1.75rem"
                size="sm"
                bg="transparent"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={() => setShowPassword(!showPassword)}
                _hover={{ bg: "rgba(255,255,255,0.1)" }}
                color="gray.400"
                isDisabled={isLoading}
                tabIndex={-1}
              />
            }
            isRequired
          />
          {/* Barra de força da senha */}
          {password && (
            <Progress
              value={passwordStrength}
              colorScheme={getPasswordStrengthColor()}
              size="xs"
              mt={2}
              borderRadius="full"
            />
          )}
          {/* Botão Criar minha conta */}
          <Button
            variant="solid"
            colorScheme="orange"
            size="lg"
            w="100%"
            height="56px"
            fontSize="md"
            fontWeight="bold"
            color="gray.800"
            mt={6}
            onClick={handleRegister}
            isLoading={isLoading}
            loadingText="Cadastrando..."
            leftIcon={<FiLock />}
          >
            Criar minha conta
          </Button>
          <Center mt={4} color={"white"}>
            <Link href="/login">
              <Text
                cursor="pointer"
                fontSize="sm"
                _hover={{ color: "#ffb110" }}
                transition="all 0.2s"
              >
                Já possui uma conta?{" "}
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
