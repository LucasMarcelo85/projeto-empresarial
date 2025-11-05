import { useEffect } from "react";
import { Box, Container, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { Scissors } from "lucide-react";

export default function Suporte() {
    useEffect(() => {
        // Número do WhatsApp com código do país (Brasil)
        const whatsappNumber = "5585991904540";
        const message = "Olá! Preciso de ajuda com o Meu Barbeiro Pro.";
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        // Redireciona para o WhatsApp após 2 segundos
        const redirectTimer = setTimeout(() => {
            window.location.href = whatsappUrl;
        }, 2000);

        // Limpa o timer quando o componente é desmontado
        return () => clearTimeout(redirectTimer);
    }, []);

    return (
        <Box minH="100vh" bg="barber.400" color="gray.100">
            <Box
                as="header"
                borderBottom="1px"
                borderColor="barber.100"
                bg="barber.900"
                py={4}
            >
                <Container maxW="container.xl">
                    <Flex align="center">
                        <Scissors size={24} color="#fba931" />
                        <Text fontSize="xl" fontWeight="bold" color="white" ml={2}>
                            Meu Barbeiro Pro
                        </Text>
                    </Flex>
                </Container>
            </Box>

            <Box as="main" py={20}>
                <Container maxW="container.md" textAlign="center">
                    <Flex direction="column" align="center" justify="center" gap={8}>
                        <Heading as="h1" size="xl" color="white">
                            Redirecionando para o Suporte
                        </Heading>

                        <Spinner
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="barber.100"
                            color="orange.900"
                            size="xl"
                        />

                        <Text color="barber.100" fontSize="lg">
                            Você está sendo redirecionado para nosso suporte via WhatsApp...
                        </Text>
                    </Flex>
                </Container>
            </Box>
        </Box>
    );
}
