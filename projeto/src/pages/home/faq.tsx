import {
    Box,
    Container,
    Heading,
    VStack,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Text,
    Flex,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { Scissors } from "lucide-react";

export default function FAQ() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const toast = useToast();

    const faqItems = [
        {
            question: "Como funciona o sistema de agendamentos?",
            answer:
                "Nosso sistema permite que seus clientes agendem serviços 24/7. Você recebe notificações dos agendamentos e pode gerenciá-los através do painel administrativo.",
        },
        {
            question: "Posso usar em mais de uma loja?",
            answer:
                "Cada assinatura permite o uso em uma única loja. Para múltiplas unidades, recomendamos assinar um plano para cada uma.",
        },
        {
            question: "Como funciona o plano gratuito?",
            answer:
                "O plano gratuito oferece recursos básicos com limite de até 3 serviços/profissionais cadastrados. Você pode usar por tempo ilimitado, mas com funcionalidades reduzidas.",
        },
        {
            question: "Preciso instalar algum software?",
            answer:
                "Não é necessário instalar nada. Nossa plataforma é baseada em nuvem e pode ser acessada de qualquer dispositivo com internet através do navegador.",
        },
        {
            question: "Como faço para migrar meus dados para o sistema?",
            answer:
                "Oferecemos suporte para migração de dados. Entre em contato conosco através do formulário abaixo e nossa equipe irá ajudá-lo nesse processo.",
        },
        {
            question: "Posso cancelar minha assinatura a qualquer momento?",
            answer:
                "Sim, você pode cancelar sua assinatura quando quiser, sem multas ou taxas adicionais. Seus dados ficarão disponíveis até o final do período pago.",
        },
    ];

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            toast({
                title: "Mensagem enviada",
                description: "Entraremos em contato em breve!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });

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
                <Container maxW="container.md">
                    <VStack spacing={12} align="stretch">
                        <VStack spacing={4} textAlign="center">
                            <Heading as="h1" size="2xl" color="white">
                                Perguntas Frequentes
                            </Heading>
                            <Text fontSize="xl" color="barber.100">
                                Encontre respostas para as dúvidas mais comuns sobre nossa plataforma
                            </Text>
                        </VStack>

                        <Accordion allowMultiple>
                            {faqItems.map((item, index) => (
                                <AccordionItem
                                    key={index}
                                    borderColor="barber.100"
                                    mb={2}
                                    bg="barber.900"
                                    borderRadius="md"
                                >
                                    <h2>
                                        <AccordionButton py={4}>
                                            <Box flex="1" textAlign="left" fontWeight="medium" color="white">
                                                {item.question}
                                            </Box>
                                            <AccordionIcon color="orange.900" />
                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4} color="barber.100">
                                        {item.answer}
                                    </AccordionPanel>
                                </AccordionItem>
                            ))}
                        </Accordion>

                        <Box mt={12}>
                            <VStack spacing={4} textAlign="center" mb={8}>
                                <Heading as="h2" size="xl" color="white">
                                    Ainda tem dúvidas?
                                </Heading>
                                <Text color="barber.100">Envie sua pergunta através do formulário abaixo</Text>
                            </VStack>

                            <Box bg="barber.900" p={8} borderRadius="md" borderColor="barber.100" borderWidth="1px">
                                <VStack spacing={6} as="form" onSubmit={handleSubmit}>
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

                                    <Button type="submit" bg="button.cta" color="black" size="lg" width="full" mt={4} isLoading={isLoading} _hover={{ opacity: 0.8 }}>
                                        Enviar Mensagem
                                    </Button>
                                </VStack>
                            </Box>
                        </Box>
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
