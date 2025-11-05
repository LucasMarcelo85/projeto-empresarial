import { useState, useEffect } from "react";
import Head from "next/head";
import {
  Box,
  Flex,
  Select,
  HStack,
  Button,
  useDisclosure,
  Icon,
  Badge,
  Skeleton,
  VStack,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Heading,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";
import { FiSearch, FiGrid, FiList, FiPlus } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { Sidebar } from "../../components/sidebar";
import { HaircutCard } from "../../components/haircut-card";
import { setupAPIClient } from "../../services/api";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { showErrorToast, showSuccessToast } from "../../utils/toastifyConfig";

import { EnhancedInput } from "../../components/enhanced-input";

// Componentes com animação
const MotionBox = motion(Box);

interface HaircutProps {
  id: string;
  name: string;
  price: number | string;
  status: boolean;
  user_id: string;
  duration?: number;
}

interface HaircutsProps {
  haircuts: HaircutProps[];
}

export default function Haircuts({ haircuts }: HaircutsProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<HaircutProps[]>(haircuts || []);
  const [filteredServices, setFilteredServices] = useState<HaircutProps[]>(
    haircuts || [],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Cores baseadas no tema
  const bgColor = "gray.900";
  const cardBg = "barber.900";
  const textColor = "gray.100";
  const subTextColor = "gray.400";
  const buttonBg = "orange.400";
  const buttonHoverBg = "orange.500";
  const accentColor = "orange.300";
  const filterBg = "barber.800";
  const borderColor = "gray.700";

  useEffect(() => {
    filterServices();
  }, [searchTerm, filterValue, services]);

  // Função para filtrar serviços
  function filterServices() {
    let filtered = [...services];

    // Aplicar pesquisa por texto
    if (searchTerm) {
      filtered = filtered.filter((service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Aplicar filtro por status
    if (filterValue === "active") {
      filtered = filtered.filter((service) => service.status);
    } else if (filterValue === "inactive") {
      filtered = filtered.filter((service) => !service.status);
    }

    setFilteredServices(filtered);
  }

  // Função para carregar serviços
  async function loadServices(status: string = "all") {
    try {
      setIsLoading(true);

      const apiClient = setupAPIClient();
      let response;

      if (status === "all") {
        // Carregar todos os serviços
        const activeResponse = await apiClient.get("/haircuts", {
          params: { status: true },
        });
        const inactiveResponse = await apiClient.get("/haircuts", {
          params: { status: false },
        });

        const allServices = [...activeResponse.data, ...inactiveResponse.data];
        setServices(allServices);
        setFilteredServices(allServices);
      } else {
        // Carregar apenas serviços ativos ou inativos
        const statusValue = status === "active";
        response = await apiClient.get("/haircuts", {
          params: { status: statusValue },
        });

        setServices(response.data);
        setFilteredServices(response.data);
      }

      showSuccessToast(
        "Lista de serviços carregada com sucesso",
        "Serviços atualizados"
      );
    } catch (error) {
      console.error(error);
      showErrorToast(
        "Não foi possível carregar a lista de serviços",
        "Erro ao carregar serviços"
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Componente para exibir contagem e status do filtro
  function FilterStatusBadge() {
    let statusText = "Todos os serviços";
    let colorScheme = "gray";

    if (filterValue === "active") {
      statusText = "Serviços ativos";
      colorScheme = "green";
    } else if (filterValue === "inactive") {
      statusText = "Serviços inativos";
      colorScheme = "red";
    }

    return (
      <Badge
        colorScheme={colorScheme}
        fontSize="sm"
        px={2}
        py={1}
        borderRadius="full"
      >
        {statusText} ({filteredServices.length})
      </Badge>
    );
  }

  // Variantes para animação
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <>
      {" "}
      <Head>
        <title>Meus Anúncios - AutoVendas Pro</title>
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
          bg={"barber.900"}
        >
          {/* Cabeçalho da página */}
          <Flex
            w="100%"
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "flex-start", md: "center" }}
            mb={6}
          >
            <Box mb={{ base: 4, md: 0 }}>
              <Heading as="h1" size="lg" color={textColor} mb={2}>
                Meus Anúncios
              </Heading>
              <Text color={subTextColor}>
                Gerenciamento de anúncios e preços
              </Text>
            </Box>
            <Link href="/haircuts/new">
              <Button
                leftIcon={<FiPlus />}
                colorScheme="orange"
                size="md"
                height="48px"
                fontSize="md"
                fontWeight="bold"
                color="gray.800"
                _hover={{ bg: "orange.300" }}
              >
                Adicionar anúncio
              </Button>
            </Link>
          </Flex>

          {/* Barra de filtros - versão desktop */}
          <Flex
            display={{ base: "none", md: "flex" }}
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
                {" "}
                  <EnhancedInput
                  id="search-service"
                  label="Buscar anúncio"
                  placeholder="Digite o nome do anúncio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={FiSearch}
                  autoComplete="off"
                />
              </Box>
              <Box w="100%" maxW="380px" mt={4}>
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
                  <option value="all">Todos os anúncios</option>
                  <option value="active">Apenas ativos</option>
                  <option value="inactive">Apenas inativos</option>
                </Select>
              </Box>
            </HStack>
            <HStack>
              <Box mt={3}>
                  <FilterStatusBadge />
              </Box>
              <HStack bg={"gray.700"} borderRadius="md" overflow="hidden" mt={3}>
                <Button
                  size="sm"
                  variant={viewMode === "grid" ? "solid" : "ghost"}
                  colorScheme={viewMode === "grid" ? "orange." : "gray"}
                  leftIcon={<Icon as={FiGrid} />}
                  onClick={() => setViewMode("grid")}
                >
                  Grid
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "list" ? "solid" : "ghost"}
                  colorScheme={viewMode === "list" ? "orange." : "gray"}
                  leftIcon={<Icon as={FiList} />}
                  onClick={() => setViewMode("list")}
                >
                  Lista
                </Button>
              </HStack>
            </HStack>
          </Flex>

          {/* Conteúdo principal - Lista de serviços */}
          <MotionBox
            as="main"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            w="100%"
            bg={bgColor}
            p={4}
          >
            <MotionBox variants={itemVariants}>
              <AnimatePresence>
                {isLoading ? (
                  // Esqueletos de carregamento
                  <SimpleGrid
                    columns={{
                      base: 1,
                      md: viewMode === "grid" ? 2 : 1,
                      lg: viewMode === "grid" ? 3 : 1,
                    }}
                    spacing={6}
                  >
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton
                        key={i}
                        height={viewMode === "grid" ? "200px" : "100px"}
                        borderRadius="lg"
                      />
                    ))}
                  </SimpleGrid>
                ) : filteredServices.length === 0 ? (
                  // Estado vazio
                  <MotionBox
                    bg={cardBg}
                    p={8}
                    borderRadius="lg"
                    shadow="md"
                    textAlign="center"
                    borderWidth="1px"
                    borderColor={borderColor}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Icon
                      as={FiSearch}
                      w={12}
                      h={12}
                      color={accentColor}
                      mb={4}
                    />
                    <Heading size="md" mb={2} color={textColor}>
                      Nenhum serviço encontrado
                    </Heading>
                    <Text color={subTextColor} mb={6}>
                      {searchTerm
                        ? "Tente ajustar seus termos de busca"
                              : filterValue !== "all"
                                ? "Altere os filtros ou adicione novos anúncios"
                                : "Adicione seu primeiro anúncio para começar"}{" "}
                    </Text>
                    <Link href="/haircuts/new">
                        <Button
                        leftIcon={<FiPlus />}
                        colorScheme="orange"
                        size="md"
                        height="56px"
                        fontSize="md"
                        fontWeight="semibold"
                        color="gray.800"
                        _hover={{ bg: "orange.300" }}
                      >
                        Adicionar anúncio
                      </Button>
                    </Link>
                  </MotionBox>
                ) : (
                  // Lista de serviços
                  <SimpleGrid
                    columns={{
                      base: 1,
                      md: viewMode === "grid" ? 2 : 1,
                      lg: viewMode === "grid" ? 3 : 1,
                    }}
                    spacing={6}
                  >
                    {filteredServices.map((haircut) => (
                      <MotionBox
                        key={haircut.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <HaircutCard haircut={haircut} />
                      </MotionBox>
                    ))}
                  </SimpleGrid>
                )}
              </AnimatePresence>
            </MotionBox>
          </MotionBox>
        </Flex>
      </Sidebar>
      {/* Drawer para filtros em dispositivos móveis */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay backdropFilter="blur(2px)" />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Filtrar serviços</DrawerHeader>

          <DrawerBody py={4}>
            <VStack spacing={5} align="stretch">
              <Box>
                <Text fontWeight="medium" mb={2}>
                  Buscar por nome
                </Text>{" "}
                <EnhancedInput
                  id="search-service-mobile"
                  label="Buscar serviço"
                  placeholder="Digite o nome do serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={FiSearch}
                  autoComplete="off"
                />
              </Box>

              <Box>
                <Text fontWeight="medium" mb={2}>
                  Status
                </Text>
                <Select
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                >
                  <option value="all">Todos os serviços</option>
                  <option value="active">Apenas ativos</option>
                  <option value="inactive">Apenas inativos</option>
                </Select>
              </Box>

              <Box>
                <Text fontWeight="medium" mb={2}>
                  Visualização
                </Text>{" "}
                <HStack
                  bg={"gray.700"}
                  borderRadius="md"
                  overflow="hidden"
                  justify="center"
                >
                  <Button
                    size="sm"
                    flex={1}
                    variant={viewMode === "grid" ? "solid" : "ghost"}
                    colorScheme={viewMode === "grid" ? "orange" : "gray"}
                    leftIcon={<Icon as={FiGrid} />}
                    onClick={() => setViewMode("grid")}
                  >
                    Grid
                  </Button>{" "}
                  <Button
                    size="sm"
                    flex={1}
                    variant={viewMode === "list" ? "solid" : "ghost"}
                    colorScheme={viewMode === "list" ? "orange" : "gray"}
                    leftIcon={<Icon as={FiList} />}
                    onClick={() => setViewMode("list")}
                  >
                    Lista
                  </Button>
                </HStack>
              </Box>

              <FilterStatusBadge />
            </VStack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            {" "}
            <Button
              variant="outline"
              mr={3}
              onClick={onClose}
              _hover={{ borderColor: "orange.500", color: "orange.500" }}
            >
              Fechar
            </Button>
            <Button
              colorScheme="orange"
              color="gray.800"
              fontWeight="bold"
              onClick={() => {
                loadServices(filterValue !== "all" ? filterValue : "all");
                onClose();
              }}
              _hover={{ bg: "orange.500" }}
            >
              Aplicar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);

    // Buscar serviços ativos
    const activeResponse = await apiClient.get("/haircuts", {
      params: { status: true },
    });

    // Buscar serviços inativos
    const inactiveResponse = await apiClient.get("/haircuts", {
      params: { status: false },
    });

    // Combinar resultados
    const allHaircuts = [...activeResponse.data, ...inactiveResponse.data];

    return {
      props: {
        haircuts: allHaircuts,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      props: {
        haircuts: [],
      },
    };
  }
});
