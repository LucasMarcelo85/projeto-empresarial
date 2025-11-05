import {
    Box,
    Container,
    Heading,
    VStack,
    Text,
    Flex,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    SimpleGrid,
    Icon,
    HStack,
    useToast
} from "@chakra-ui/react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { Scissors, Mail, MapPin, Phone } from "lucide-react";

export default function Contato() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const toast = useToast();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Aqui você implementaria a lógica de envio do formulário
        // Simulando um envio bem-sucedido após um pequeno delay
        setTimeout(() => {
            toast({
                title: "Mensagem enviada",
                description: "Entraremos em contato em breve!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            });

            // Limpar o formulário
            setName("");
            setEmail("");
            setSubject("");
            setMessage("");
            setIsLoading(false);
        }, 1000);
    };

    return (
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
                        <Link href="/">
                            <Flex align="center">
                                <Scissors size={24} color="#fba931" />
                                <Text fontSize="xl" fontWeight="bold" color="white" ml={2}>
                                    AutoVendas Pro
                                </Text>
                            </Flex>
                        </Link>
                        <Link href="/">
                            <Button variant="outline" borderColor="barber.100" color="barber.100">
                                Voltar ao início
                            </Button>
                        </Link>
                    </Flex>
                </Container>
            </Box>

            <Box as="main" py={16}>
                <Container maxW="container.xl">
                    <VStack spacing={12} align="stretch">
                        <VStack spacing={4} textAlign="center">
                            <Heading as="h1" size="2xl" color="white">
                                Entre em Contato
                            </Heading>
                            <Text fontSize="xl" color="barber.100" maxW="container.md" mx="auto">
                                Estamos aqui para ajudar com qualquer dúvida sobre nossa plataforma
                            </Text>
                        </VStack>

                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                            <Box>
                                <VStack spacing={8} align="flex-start">
                                    <Box>
                                        <Heading as="h3" size="md" color="white" mb={4}>
                                            Informações de Contato
                                        </Heading>
                                        <VStack spacing={4} align="flex-start">
                                            <HStack>
                                                <Icon as={Mail} color="orange.900" />
                                                <Text color="barber.100">suporte@autovendaspro.com</Text>
                                            </HStack>
                                            <HStack>
                                                <Icon as={Phone} color="orange.900" />
                                                <Text color="barber.100">(85) 99190-4540</Text>
                                            </HStack>
                                            <HStack alignItems="flex-start">
                                                <Icon as={MapPin} color="orange.900" mt={1} />
                                                <Text color="barber.100">
                                                    Av. Washington Soares, 1321<br />
                                                    Fortaleza, CE<br />
                                                    Brasil
                                                </Text>
                                            </HStack>
                                        </VStack>
                                    </Box>

                                    <Box>
                                        <Heading as="h3" size="md" color="white" mb={4}>
                                            Horário de Atendimento
                                        </Heading>
                                        <Text color="barber.100">
                                            Segunda a Sexta: 8h às 18h<br />
                                            Sábado: 9h às 13h
                                        </Text>
                                    </Box>
                                </VStack>
                            </Box>

                            <Box bg="barber.900" p={8} borderRadius="md" borderColor="barber.100" borderWidth="1px">
                                <VStack spacing={6} as="form" onSubmit={handleSubmit}>
                                    <Heading as="h3" size="md" color="white" alignSelf="flex-start">
                                        Envie sua mensagem
                                    </Heading>

                                    <FormControl isRequired>
                                        <FormLabel color="white">Nome</FormLabel>
                                        <Input
                                            bg="barber.400"
                                            borderColor="barber.100"
                                            _hover={{ borderColor: "orange.900" }}
                                            _focus={{ borderColor: "orange.900", boxShadow: "none" }}
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel color="white">Email</FormLabel>
                                        <Input
                                            bg="barber.400"
                                            borderColor="barber.100"
                                            _hover={{ borderColor: "orange.900" }}
                                            _focus={{ borderColor: "orange.900", boxShadow: "none" }}
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel color="white">Assunto</FormLabel>
                                        <Input
                                            bg="barber.400"
                                            borderColor="barber.100"
                                            _hover={{ borderColor: "orange.900" }}
                                            _focus={{ borderColor: "orange.900", boxShadow: "none" }}
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel color="white">Mensagem</FormLabel>
                                        <Textarea
                                            bg="barber.400"
                                            borderColor="barber.100"
                                            _hover={{ borderColor: "orange.900" }}
                                            _focus={{ borderColor: "orange.900", boxShadow: "none" }}
                                            rows={5}
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                        />
                                    </FormControl>

                                    <Button
                                        type="submit"
                                        bg="button.cta"
                                        color="black"
                                        size="lg"
                                        width="full"
                                        mt={4}
                                        isLoading={isLoading}
                                        _hover={{ opacity: 0.8 }}
                                    >
                                        Enviar Mensagem
                                    </Button>
                                </VStack>
                            </Box>
                        </SimpleGrid>
                    </VStack>
                </Container>
            </Box>

            {/* Footer */}
            <Box as="footer" bg="barber.900" py={8}>
                <Container maxW="container.xl">
                    <Flex direction="column" align="center">
                        <Text fontSize="sm" color="barber.100">
                            &copy; {new Date().getFullYear()} AutoVendas Pro. Todos os direitos reservados.
                        </Text>
                    </Flex>
                </Container>
            </Box>
        </Box>
    );
}
