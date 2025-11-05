import Head from "next/head";
import {
  Button,
  Flex,
  Heading,
  Text,
  useMediaQuery,
  Box,
  Icon,
  VStack,
  HStack,
  Divider,
  Badge,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  FiCheck,
  FiDollarSign,
  FiStar,
  FiCreditCard,
  FiSettings,
  FiInfo,
} from "react-icons/fi";
import { motion } from "framer-motion";

import { Sidebar } from "../../components/sidebar";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import { showErrorToast } from "../../utils/toastifyConfig";
interface PlanosProps {
  premium: boolean;
}

export default function Planos({ premium }: PlanosProps) {
  const [isMobile] = useMediaQuery("(max-width: 500px)");
  // Usando React-Toastify diretamente em vez de useToast
  const MotionBox = motion(Box);

  const handleSubscribe = async () => {
    if (premium) return;

    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.post("/subscribe");
      const { sessionId } = response.data;

      const stripe = await getStripeJs();
      if (!stripe) return;

      await stripe.redirectToCheckout({ sessionId });
    } catch (err: any) {
      showErrorToast(
        "Não foi possível processar a assinatura. Tente novamente.",
        "Erro no processamento"
      );
    }
  };

  async function handleCreatePortal() {
    if (!premium) return;

    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.post("/create-portal");

      if (response.data?.sessionId) {
        window.location.href = response.data.sessionId;
      } else {
        throw new Error("URL do portal não encontrada");
      }
    } catch (err) {
      showErrorToast(
        "Redirecionando para a página do seu perfil...",
        "Erro ao acessar portal"
      );

      console.error("Erro ao acessar portal:", err);

      // Redireciona para a página de perfil após mostrar o erro
      setTimeout(() => {
        window.location.href = "/profile";
      }, 2000);
    }
  }

  return (
    <>
      <Head>
        <title>Planos - AutoVendas Pro</title>
      </Head>
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
          <Flex
            w="100%"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Heading
                fontSize={{ base: "2xl", md: "3xl" }}
                mt={0}
                mb={1}
                color={"white"}
                fontWeight="bold"
              >
                Planos
              </Heading>
              <Text color={"gray.400"} fontSize="md">
                Escolha o melhor plano para sua loja de carros
              </Text>
            </Box>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="100%" mt={4}>
            {/* Plano Gratuito */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              bg="barber.400"
              borderRadius={12}
              boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
              overflow="hidden"
              position="relative"
              _hover={{ boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)" }}
              backdropFilter="blur(4px)"
              border="1px solid rgba(255, 255, 255, 0.05)"
            >
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                h="4px"
                bg="gray.500"
                boxShadow="0 0 10px rgba(160, 174, 192, 0.6)"
              />
              <Box p={{ base: 5, md: 8 }}>
                <HStack spacing={2} mb={2}>
                  <Icon as={FiDollarSign} color="gray.300" boxSize={5} />
                  <Heading size="md" color="gray.300">
                    Plano Grátis
                  </Heading>
                </HStack>
                <Text color="gray.400" mb={4}>
                  Ideal para profissionais iniciando no mercado.
                </Text>

                <Heading size="lg" color="white" mb={4}>
                  R$ 0,00
                  <Text as="span" fontSize="sm" color="gray.400" ml={2}>
                    / mês
                  </Text>
                </Heading>

                <Divider my={4} borderColor="gray.700" />

                <VStack align="stretch" spacing={3} mb={8}>
                  <HStack>
                    <Icon as={FiCheck} color="gray.400" />
                    <Text color="gray.400">Cadastro de clientes limitado</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheck} color="gray.400" />
                    <Text color="gray.400">1 anúncio de veículo</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheck} color="gray.400" />
                    <Text color="gray.400">
                      Edição de status (ativo/inativo)
                    </Text>
                  </HStack>
                </VStack>

                {premium ? (
                  <Button
                    w="100%"
                    h="50px"
                    bg="gray.700"
                    color="white"
                    _hover={{ bg: "gray.600" }}
                    isDisabled={true}
                    leftIcon={<FiCheck />}
                  >
                    Atual: Premium
                  </Button>
                ) : (
                  <Button
                    w="100%"
                    h="50px"
                    bg="gray.700"
                    color="white"
                    _hover={{ bg: "gray.600" }}
                    isDisabled={true}
                    leftIcon={<FiCheck />}
                  >
                    Plano Atual
                  </Button>
                )}
              </Box>
            </MotionBox>

            {/* Plano Premium */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              bg="barber.400"
              borderRadius={12}
              boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
              overflow="hidden"
              position="relative"
              _hover={{ boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)" }}
              backdropFilter="blur(4px)"
              border="1px solid rgba(255, 255, 255, 0.05)"
            >
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                h="4px"
                bgGradient="linear(90deg, #ffb110 0%, #ff9900 100%)"
                boxShadow="0 0 10px rgba(255, 177, 16, 0.6)"
              />
              <Badge
                position="absolute"
                top={4}
                right={4}
                colorScheme="yellow"
                variant="solid"
                px={2}
                py={1}
                borderRadius="md"
              >
                Recomendado
              </Badge>
              <Box p={{ base: 5, md: 8 }}>
                <HStack spacing={2} mb={2}>
                  <Icon as={FiStar} color="#ffb110" boxSize={5} />
                  <Heading size="md" color="#ffb110">
                    Plano Premium
                  </Heading>
                </HStack>
                <Text color="gray.300" mb={4}>
                  Para profissionais que buscam crescimento e produtividade.
                </Text>

                <Heading size="lg" color="white" mb={4}>
                  R$ 49,90
                  <Text as="span" fontSize="sm" color="gray.400" ml={2}>
                    / mês
                  </Text>
                </Heading>

                <Divider my={4} borderColor="gray.700" />

                <VStack align="stretch" spacing={3} mb={8}>
                  <HStack>
                    <Icon as={FiCheck} color="#ffb110" />
                    <Text color="white">Cadastro de clientes ilimitado</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheck} color="#ffb110" />
                    <Text color="white">Cadastro de veículos ilimitado</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheck} color="#ffb110" />
                    <Text color="white">
                      Edição completa de anúncios e preços
                    </Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheck} color="#ffb110" />
                    <Text color="white">Agenda de horários personalizável</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheck} color="#ffb110" />
                    <Text color="white">Relatórios financeiros detalhados</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheck} color="#ffb110" />
                    <Text color="white">Suporte prioritário</Text>
                  </HStack>
                </VStack>

                {premium ? (
                  <Button
                    w="100%"
                    h="50px"
                    leftIcon={<FiSettings />}
                    bgGradient="linear(to-r, #ffb110, #ff9900)"
                    color="gray.900"
                    _hover={{
                      bgGradient: "linear(to-r, #ffb110, #ff9900)",
                      boxShadow: "0 0 15px rgba(255, 177, 16, 0.6)",
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.2s"
                    onClick={handleCreatePortal}
                  >
                    Gerenciar Assinatura
                  </Button>
                ) : (
                  <Button
                    w="100%"
                    h="50px"
                    leftIcon={<FiCreditCard />}
                    bgGradient="linear(to-r, #ffb110, #ff9900)"
                    color="gray.900"
                    _hover={{
                      bgGradient: "linear(to-r, #ffb110, #ff9900)",
                      boxShadow: "0 0 15px rgba(255, 177, 16, 0.6)",
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.2s"
                    onClick={handleSubscribe}
                  >
                    Assinar Agora
                  </Button>
                )}
              </Box>
            </MotionBox>
          </SimpleGrid>

          <Box
            mt={10}
            p={6}
            bg="gray.800"
            borderRadius="md"
            boxShadow="inner"
            borderLeft="4px solid #2fc18c"
            w="100%"
          >
            <HStack mb={3}>
              <Icon as={FiInfo} color="#2fc18c" boxSize={5} />
              <Heading size="sm" color="#2fc18c">
                Informações adicionais
              </Heading>
            </HStack>
            <Text color="gray.300" fontSize="sm">
              A assinatura é renovada automaticamente a cada mês. Você pode
              cancelar a qualquer momento através do portal de gerenciamento.
              Após o cancelamento, você ainda terá acesso aos recursos premium
              até o final do período pago.
            </Text>
          </Box>
        </Flex>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/me");

    const subscriptionStatus = response.data?.subscriptions?.status ?? null;

    return {
      props: {
        premium: subscriptionStatus === "active",
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
