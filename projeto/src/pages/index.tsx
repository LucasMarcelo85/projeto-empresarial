import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Flex,
  Grid,
  GridItem,
  Stack,
  VStack,
  HStack,
  Badge,
  List,
  ListItem,
  ListIcon,
  Avatar,
} from "@chakra-ui/react";
import {
  Car,
  Bot,
  BarChart,
  MessageSquare,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <>
      <Head>
        <title>MK veiculos - Sistema para Lojas de Carros</title>
      </Head>
      <Box minH="100vh" bg="barber.400" color="gray.100">
      {/* Header/Navigation */}
      <Box
        as="header"
        borderBottom="1px"
        borderColor="barber.100"
        position="sticky"
        top="0"
        zIndex="50"
        bg="barber.900"
      >
        <Container maxW="container.xl" py={4}>
          <Flex justify="space-between" align="center">
            <HStack spacing={2}>
              <Car size={24} color="#FFD700" />
              <Text fontSize="xl" fontWeight="bold" color="white">
                MK veiculos
              </Text>
            </HStack>

            <HStack spacing={6} display={{ base: "none", md: "flex" }}>
              <Link href="#recursos">
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color="barber.100"
                  _hover={{ color: "orange.900" }}
                >
                  Recursos
                </Text>
              </Link>
              <Link href="#como-funciona">
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color="barber.100"
                  _hover={{ color: "orange.900" }}
                >
                  Como Funciona
                </Text>
              </Link>
              <Link href="#planos">
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color="barber.100"
                  _hover={{ color: "orange.900" }}
                >
                  Planos
                </Text>
              </Link>
              <Link href="#depoimentos">
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color="barber.100"
                  _hover={{ color: "orange.900" }}
                >
                  Depoimentos
                </Text>
              </Link>
            </HStack>

            <HStack spacing={4}>
              <Link href="/login">
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color="white"
                  _hover={{ textDecoration: "underline" }}
                >
                  Login
                </Text>
              </Link>
              <Button
                as={Link}
                href="/register"
                bg="button.cta"
                color="black"
                size="sm"
                _hover={{ opacity: 0.8 }}
              >
                Comece Grátis
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Box as="main">
        {/* Hero Section */}
        <Box
          as="section"
          position="relative"
          py={{ base: 20, md: 32 }}
          overflow="hidden"
        >
          <Box position="absolute" inset="0" zIndex="0">
            <Image
              src="/placeholder.svg?height=1080&width=1920"
              alt="Showroom moderno"
              fill
              style={{ objectFit: "cover", opacity: 0.1 }}
              priority
            />
            <Box
              position="absolute"
              inset="0"
              bgGradient="linear(to-r, barber.400, transparent)"
            />
          </Box>

          <Container maxW="container.xl" position="relative" zIndex="10">
            <Box maxW="3xl">
              <Heading
                as="h1"
                size={{ base: "2xl", md: "3xl", lg: "4xl" }}
                fontWeight="bold"
                lineHeight="tight"
                mb={6}
                color="white"
              >
                  Venda e gerencie seus veículos: anúncios, agendamentos e gestão
                  da sua loja de carros em um só lugar.
              </Heading>
              <Text fontSize="xl" color="barber.100" mb={8}>
                Gerencie estoque, anúncios e atendimento automatizado com facilidade.
                Foque nas vendas enquanto nosso robô cuida dos seus clientes.
              </Text>
              <Stack
                spacing={4}
                align="start"
                direction={{ base: "column", sm: "row" }}
              >
                <Button
                  as={Link}
                  href="/register"
                  size="lg"
                  bg="button.cta"
                  color="black"
                  rightIcon={<ArrowRight size={16} />}
                  _hover={{ opacity: 0.8 }}
                >
                  Comece Grátis!
                </Button>
                <Button
                  as={Link}
                  href="/login"
                  size="lg"
                  variant="outline"
                  borderColor="white"
                  color="white"
                  _hover={{ bg: "whiteAlpha.200" }}
                >
                  Já sou Cliente / Fazer Login
                </Button>
              </Stack>
            </Box>
          </Container>
        </Box>

        {/* Benefits Section */}
        <Box as="section" id="recursos" py={20} bg="barber.900">
          <Container maxW="container.xl">
            <VStack spacing={16} textAlign="center">
              <Box>
                <Heading
                  as="h2"
                  size={{ base: "xl", md: "2xl" }}
                  mb={4}
                  color="white"
                >
                  Chega de complicação na sua loja de carros. Nós temos a solução!
                </Heading>
                <Text fontSize="xl" color="barber.100" maxW="3xl" mx="auto">
                  Sabemos que gerenciar uma loja de carros pode ser
                  desafiador. Controle de estoque, vendas e atendimento ao cliente são
                  problemas comuns. Nossa plataforma resolve isso com inteligência artificial.
                </Text>
              </Box>

              <Grid
                templateColumns={{
                  base: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(4, 1fr)",
                }}
                gap={8}
                w="full"
                alignItems="stretch"
              >
                <GridItem display="flex">
                  <Box
                    bg="barber.400"
                    p={6}
                    borderRadius="lg"
                    border="1px"
                    minHeight={{ base: "280px", md: "320px" }}
                    maxHeight={{ base: "auto", md: "320px" }}
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    borderColor="barber.100"
                    textAlign={"center"}
                  >
                    <VStack spacing={4} height="100%" align="center" justify="center">
                      <Box>
                        <Bot size={48} color="#FFD700" />
                      </Box>
                      <Heading as="h3" size="lg" color="white">
                        Atendente Virtual
                      </Heading>
                      <Text color="barber.100">
                        Atendimento automatizado 24h por dia, tirando dúvidas
                        e auxiliando seus clientes.
                      </Text>
                    </VStack>
                  </Box>
                </GridItem>

                <GridItem>
                  <Box
                    bg="barber.400"
                    p={6}
                    borderRadius="lg"
                    border="1px"
                    minHeight="280px"
                    display="flex"
                    flexDirection="column"
                    flex="1"
                    borderColor="barber.100"
                    textAlign={"center"}
                  >
                    <VStack spacing={4} height="100%" align="center" justify="center">
                      <Box>
                        <Car size={48} color="#FFD700" />
                      </Box>
                      <Heading as="h3" size="lg" color="white">
                        Gestão de Veículos
                      </Heading>
                      <Text color="barber.100">
                        Cadastre seus veículos, defina preços, fotos e acompanhe o
                        desempenho das vendas.
                      </Text>
                    </VStack>
                  </Box>
                </GridItem>

                  <GridItem>
                  <Box
                    bg="barber.400"
                    p={6}
                    borderRadius="lg"
                    border="1px"
                    minHeight="280px"
                    display="flex"
                    flexDirection="column"
                    flex="1"
                    borderColor="barber.100"
                    textAlign={"center"}
                  >
                    <VStack spacing={4} height="100%" align="center" justify="center">
                      <Box>
                        <BarChart size={48} color="#FFD700" />
                      </Box>
                      <Heading as="h3" size="lg" color="white">
                        Dashboard de Acompanhamento
                      </Heading>
                      <Text color="barber.100">
                        Tenha uma visão clara do seu negócio com dados e
                        relatórios intuitivos.
                      </Text>
                    </VStack>
                  </Box>
                </GridItem>                                  <GridItem>
                  <Box
                    bg="barber.400"
                    p={6}
                    borderRadius="lg"
                    border="1px"
                    minHeight="280px"
                    display="flex"
                    flexDirection="column"
                    flex="1"
                    borderColor="barber.100"
                    textAlign={"center"}
                  >
                    <MessageSquare size={48} color="#FFD700" />
                    <Heading as="h3" size="lg" mt={4} mb={2} color="white">
                      Marketing e Trafego
                    </Heading>
                    <Text color="barber.100">
                    Aumente suas vendas e alcance novos clientes com campanhas estratégicas que geram resultados reais.
                    </Text>
                  </Box>
                </GridItem>
              </Grid>
            </VStack>
          </Container>
        </Box>

        {/* How it Works Section */}
        <Box as="section" id="como-funciona" py={20} bg="barber.400">
          <Container maxW="container.xl">
            <VStack spacing={16} textAlign="center">
              <Box>
                <Heading
                  as="h2"
                  size={{ base: "xl", md: "2xl" }}
                  mb={4}
                  color="white"
                >
                  Descomplique o dia a dia da sua loja de carros em poucos cliques.
                </Heading>
                <Text fontSize="xl" color="barber.100" maxW="3xl" mx="auto">
                  Nossa plataforma foi desenvolvida pensando na simplicidade.
                  Veja como é fácil usar:
                </Text>
              </Box>

              <VStack spacing={16} w="full">
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={12}
                  alignItems="center"
                  w="full"
                  textAlign={{ base: "center", md: "left" }}
                >
                  <GridItem>
                    <VStack align="start" spacing={4}>
                      <Heading as="h3" size="xl" color="white">
                        Atendente Virtual 24h
                      </Heading>
                      <Text color="barber.100">
                        Seus clientes recebem atendimento automatizado 24 horas por dia, 
                        7 dias por semana. Resposta rápida e eficiente para todas as dúvidas.
                      </Text>
                      <List spacing={2}>
                        <ListItem color="barber.100">
                          <ListIcon as={CheckCircle} color="#FFD700" />
                          Respostas automáticas inteligentes
                        </ListItem>
                        <ListItem color="barber.100">
                          <ListIcon as={CheckCircle} color="#FFD700" />
                          Atendimento multicanal
                        </ListItem>
                        <ListItem color="barber.100">
                          <ListIcon as={CheckCircle} color="#FFD700" />
                          Integração com WhatsApp e Instagram
                        </ListItem>
                      </List>
                    </VStack>
                  </GridItem>
                  <GridItem>
                    <Box
                      bg="barber.900"
                      borderRadius="lg"
                      overflow="hidden"
                      border="1px"
                      borderColor="barber.100"
                    >
                      <Image
                        src="/images/agendamento-online.jpeg"
                        alt="Tela de agendamento"
                        width={800}
                        height={600}
                        style={{ width: "100%", height: "auto" }}
                      />
                    </Box>
                  </GridItem>
                </Grid>

                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={12}
                  alignItems="center"
                  w="full"
                  textAlign={{ base: "center", md: "left" }}
                >
                  <GridItem order={{ base: 2, md: 1 }}>
                    <Box
                      bg="barber.900"
                      borderRadius="lg"
                      overflow="hidden"
                      border="1px"
                      borderColor="barber.100"
                    >
                      <Image
                        src="/images/cadastro-servicos.jpeg"
                        alt="Cadastro de serviços"
                        width={800}
                        height={600}
                        style={{ width: "100%", height: "auto" }}
                      />
                    </Box>
                  </GridItem>
                  <GridItem order={{ base: 1, md: 2 }}>
                    <VStack align="start" spacing={4}>
                      <Heading as="h3" size="xl" color="white">
                        Cadastro de Veículos
                      </Heading>
                      <Text color="barber.100">
                        Cadastre todos os veículos da sua loja, adicione fotos,
                        especificações e preços para destacar seus anúncios.
                      </Text>
                      <List spacing={2}>
                        <ListItem color="barber.100">
                          <ListIcon as={CheckCircle} color="orange.900" />
                          Personalização completa de serviços
                        </ListItem>
                        <ListItem color="barber.100">
                          <ListIcon as={CheckCircle} color="orange.900" />
                          Controle de disponibilidade
                        </ListItem>
                        <ListItem color="barber.100">
                          <ListIcon as={CheckCircle} color="orange.900" />
                          Gestão de profissionais
                        </ListItem>
                      </List>
                    </VStack>
                  </GridItem>
                </Grid>
              </VStack>
            </VStack>
          </Container>
        </Box>

        {/* Pricing Section */}
        <Box as="section" id="planos" py={20} bg="barber.900">
          <Container maxW="container.xl">
            <VStack spacing={16} textAlign="center">
              <Box>
                <Heading
                  as="h2"
                  size={{ base: "xl", md: "2xl" }}
                  mb={2}
                  color="white"
                >
                  Escolha o plano ideal para o crescimento da sua loja de carros.
                </Heading>
                <Text
                  fontSize="xl"
                  color="barber.100"
                  maxW="3xl"
                  mx="auto"
                  mb={-10}
                >
                  Flexibilidade e recursos que se adaptam ao seu negócio.
                </Text>
              </Box>

              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={8}
                maxW="4xl"
                w="full"
              >
                <GridItem>
                  <Box
                    bg="barber.400"
                    borderRadius="lg"
                    p={8}
                    border="1px"
                    borderColor="barber.100"
                    textAlign={"left"}
                    minHeight="538px"
                  >
                    <VStack spacing={6} align="start">
                      <Heading as="h3" size="xl" color="white">
                        Experimente Grátis 
                      </Heading>
                      <Box>
                        <Text
                          fontSize="4xl"
                          fontWeight="bold"
                          display="inline"
                          color="white"
                        >
                          por 3 dias!{" "}
                        </Text>
                        <Text color="barber.100" fontSize="lg" display="inline">
                          
                        </Text>
                      </Box>
                      <List spacing={3} w="full">
                        <ListItem color="barber.100">
                          <ListIcon as={CheckCircle} color="orange.900" />
                          Atedimento virtual (limitado por 
                          10 horas diarias)
                        </ListItem>
                        <ListItem color="barber.100">
                          <ListIcon as={CheckCircle} color="orange.900" />
                          Cadastro de veiculos e serviços básicos
                        </ListItem>
                        <ListItem color="barber.100">
                          <ListIcon as={CheckCircle} color="orange.900" />
                          Dashboard de acompanhamento (visão básica)
                        </ListItem>
                      </List>
                      <Button
                        as={Link}
                        href="/register"
                        size="lg"
                        mt={32}
                        bg="button.cta"
                        color="black"
                        w="full"
                        _hover={{ opacity: 0.8 }}
                      >
                        Comece Grátis Agora!
                      </Button>
                    </VStack>
                  </Box>
                </GridItem>

                <GridItem>
                  <Box
                    bg="barber.400"
                    borderRadius="lg"
                    p={8}
                    border="2px"
                    borderColor="orange.900"
                    position="relative"
                    textAlign={"left"}
                  >
                    <Badge
                      position="absolute"
                      top="0"
                      right="0"
                      bg="orange.900"
                      color="black"
                      py={1}
                      px={3}
                      borderRadius="0 5px 0 8px"
                      fontSize="sm"
                      fontWeight="bold"
                    >
                      Mais Popular
                    </Badge>

                    <VStack spacing={6} align="start">
                      <Heading as="h3" size="xl" color="white">
                        Plano Premium
                      </Heading>
                      <Box>
                        <Text
                          fontSize="4xl"
                          fontWeight="bold"
                          display="inline"
                          color="white"
                        >
                          R$ 902,99{" "}
                        </Text>
                        <Text color="barber.100" fontSize="lg" display="inline">
                          /mês
                        </Text>
                      </Box>
                      <List spacing={3} w="full">
                        <ListItem color="barber.100">
                          <ListIcon as={CheckCircle} color="orange.900" />
                          Atendimento online ilimitado
                        </ListItem>
                        <ListItem color="barber.100">
                          <ListIcon as={CheckCircle} color="orange.900" />
                          Cadastro ilimitado de veiculos e profissionais
                        </ListItem>
                        <ListItem color="barber.100">
                          <ListIcon as={CheckCircle} color="orange.900" />
                          Dashboard completo com relatórios avançados
                        </ListItem>
                        <ListItem color="barber.100">
                          <ListIcon as={CheckCircle} color="orange.900" />
                          Automação de marketing e trafego pago
                        </ListItem>
                        <ListItem color="barber.100">
                          <ListIcon as={CheckCircle} color="orange.900" />
                          Suporte prioritário
                        </ListItem>
                        <ListItem color="barber.100">
                          <ListIcon as={CheckCircle} color="orange.900" />E
                          muito mais!
                        </ListItem>
                      </List>
                      <Button
                        as={Link}
                        href="/planos"
                        size="lg"
                        variant="outline"
                        borderColor="orange.900"
                        color="orange.900"
                        w="full"
                        _hover={{ bg: "orange.900", color: "black" }}
                      >
                        Assinar Plano Premium
                      </Button>
                    </VStack>
                  </Box>
                </GridItem>
              </Grid>
            </VStack>
          </Container>
        </Box>

        {/* Testimonials Section */}
        <Box as="section" id="depoimentos" py={20} bg="barber.400">
          <Container maxW="container.xl">
            <VStack spacing={16} textAlign="center">
              <Heading as="h2" size={{ base: "xl", md: "2xl" }} color="white">
                O que nossos clientes dizem:
              </Heading>

              <Grid
                templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                gap={8}
                w="full"
              >
                <GridItem>
                  <Box
                    bg="barber.900"
                    p={6}
                    borderRadius="lg"
                    border="1px"
                    borderColor="barber.100"
                  >
                    <HStack spacing={4} mb={4}>
                      <Avatar
                        size="md"
                        src="/placeholder.svg?height=100&width=100"
                      />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold" color="white">
                          Carlos Silva
                        </Text>
                        <Text fontSize="sm" color="barber.100">
                          Concessionária Vintage
                        </Text>
                      </VStack>
                    </HStack>
                    <Text fontStyle="italic" color="barber.100">
                      "Desde que começamos a usar o MK veiculos, nossas
                      vendas aumentaram em 30%. A gestão ficou muito mais simples!"
                    </Text>
                  </Box>
                </GridItem>

                <GridItem>
                  <Box
                    bg="barber.900"
                    p={6}
                    borderRadius="lg"
                    border="1px"
                    borderColor="barber.100"
                  >
                    <HStack spacing={4} mb={4}>
                      <Avatar
                        size="md"
                        src="/placeholder.svg?height=100&width=100"
                      />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold" color="white">
                          Rafael Oliveira
                        </Text>
                        <Text fontSize="sm" color="barber.100">
                          Auto Shop Premium
                        </Text>
                      </VStack>
                    </HStack>
                    <Text fontStyle="italic" color="barber.100">
                     “O sistema é super intuitivo e nos ajudou a organizar melhor nossa loja. Agora recebemos mais clientes pelo celular, a qualquer hora do dia.”
                    </Text>
                  </Box>
                </GridItem>

                <GridItem>
                  <Box
                    bg="barber.900"
                    p={6}
                    borderRadius="lg"
                    border="1px"
                    borderColor="barber.100"
                  >
                    <HStack spacing={4} mb={4}>
                      <Avatar
                        size="md"
                        src="/placeholder.svg?height=100&width=100"
                      />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold" color="white">
                          Marcos Santos
                        </Text>
                        <Text fontSize="sm" color="barber.100">
                          Concessionária Moderna
                        </Text>
                      </VStack>
                    </HStack>
                    <Text fontStyle="italic" color="barber.100">
                      "As automações automáticas nos ajudaram a fidelizar
                      clientes que estavam sumidos. O retorno sobre o
                      investimento foi quase imediato!"
                    </Text>
                  </Box>
                </GridItem>
              </Grid>
            </VStack>
          </Container>
        </Box>

        {/* Final CTA Section */}
        <Box as="section" py={20} bg="orange.900" color="black">
          <Container maxW="container.xl" textAlign="center">
            <VStack spacing={8}>
              <Heading as="h2" size={{ base: "xl", md: "2xl" }} color="black">
                Transforme sua loja de carros hoje mesmo!
              </Heading>
              <Text fontSize="xl" maxW="2xl" color="black">
                Junte-se a centenas de lojas de carros que já estão otimizando
                vendas, estoque e atendimento com nossa plataforma.
              </Text>
              <HStack spacing={4} justify="center" flexWrap="wrap">
                <Button
                  as={Link}
                  href="/register"
                  size="lg"
                  bg="black"
                  color="white"
                  rightIcon={<ArrowRight size={16} />}
                  _hover={{ opacity: 0.8 }}
                >
                  Experimente Grátis!
                </Button>
                <Button
                  as={Link}
                  href="/planos"
                  size="lg"
                  variant="outline"
                  borderColor="black"
                  color="black"
                  _hover={{ bg: "blackAlpha.200" }}
                >
                  Conheça todos os recursos do Plano Premium
                </Button>
              </HStack>
            </VStack>
          </Container>
        </Box>
      </Box>

      {/* Footer */}
      <Box as="footer" bg="barber.900" py={12}>
        <Container maxW="container.xl">
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
            gap={8}
            mb={8}
          >
            <GridItem>
              <VStack align="start" spacing={4}>
                <HStack spacing={2}>
                  <Car size={24} color="#FFD700" />
                  <Text fontSize="xl" fontWeight="bold" color="white">
                    MK veiculos
                  </Text>
                </HStack>
                <Text fontSize="sm" color="barber.100">
                  A solução completa para gestão da sua loja de carros.
                </Text>
              </VStack>
            </GridItem>

            <GridItem>
              <VStack align="start" spacing={4}>
                <Text fontWeight="bold" color="white">
                  Links Rápidos
                </Text>
                <VStack align="start" spacing={2}>
                  <Link href="#recursos">
                    <Text
                      fontSize="sm"
                      color="barber.100"
                      _hover={{ color: "orange.900" }}
                    >
                      Recursos
                    </Text>
                  </Link>
                  <Link href="#como-funciona">
                    <Text
                      fontSize="sm"
                      color="barber.100"
                      _hover={{ color: "orange.900" }}
                    >
                      Como Funciona
                    </Text>
                  </Link>
                  <Link href="#planos">
                    <Text
                      fontSize="sm"
                      color="barber.100"
                      _hover={{ color: "orange.900" }}
                    >
                      Planos
                    </Text>
                  </Link>
                  <Link href="#depoimentos">
                    <Text
                      fontSize="sm"
                      color="barber.100"
                      _hover={{ color: "orange.900" }}
                    >
                      Depoimentos
                    </Text>
                  </Link>
                </VStack>
              </VStack>
            </GridItem>

            <GridItem>
              <VStack align="start" spacing={4}>
                <Text fontWeight="bold" color="white">
                  Suporte
                </Text>
                <VStack align="start" spacing={2}>
                  <Link href="/faq">
                    <Text
                      fontSize="sm"
                      color="barber.100"
                      _hover={{ color: "orange.900" }}
                    >
                      FAQ
                    </Text>
                  </Link>
                  <Link href="/home/contato">
                    <Text
                      fontSize="sm"
                      color="barber.100"
                      _hover={{ color: "orange.900" }}
                    >
                      Contato
                    </Text>
                  </Link>
                  <Link href="/home/suporte">
                    <Text
                      fontSize="sm"
                      color="barber.100"
                      _hover={{ color: "orange.900" }}
                    >
                      Central de Ajuda
                    </Text>
                  </Link>
                </VStack>
              </VStack>
            </GridItem>

            <GridItem>
              <VStack align="start" spacing={4}>
                <Text fontWeight="bold" color="white">
                  Legal
                </Text>
                <VStack align="start" spacing={2}>
                  <Link href="/home/termos">
                    <Text
                      fontSize="sm"
                      color="barber.100"
                      _hover={{ color: "orange.900" }}
                    >
                      Termos de Uso
                    </Text>
                  </Link>
                  <Link href="/home/privacidade">
                    <Text
                      fontSize="sm"
                      color="barber.100"
                      _hover={{ color: "orange.900" }}
                    >
                      Política de Privacidade
                    </Text>
                  </Link>
                </VStack>
              </VStack>
            </GridItem>
          </Grid>

          <Box borderTop="1px" borderColor="barber.100" pt={8}>
            <Flex
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align="center"
            >
              <Text fontSize="sm" color="barber.100">
                &copy; {new Date().getFullYear()} MK veiculos. Todos os direitos
                reservados.
              </Text>
              <HStack spacing={4} mt={{ base: 4, md: 0 }}>
                <Link href="#">
                  <Box color="barber.100" _hover={{ color: "orange.900" }}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </Box>
                </Link>
                <Link href="#">
                  <Box color="barber.100" _hover={{ color: "orange.900" }}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </Box>
                </Link>
                <Link href="#">
                  <Box color="barber.100" _hover={{ color: "orange.900" }}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    </svg>
                  </Box>
                </Link>
              </HStack>
            </Flex>
          </Box>
        </Container>
      </Box>
    </Box>
    </>
  );
}
