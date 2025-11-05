import {
    Box,
    Container,
    Heading,
    VStack,
    Text,
    Flex,
    Button,
    UnorderedList,
    ListItem,
} from "@chakra-ui/react";
import Link from "next/link";
import { Scissors } from "lucide-react";

export default function Privacidade() {
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
                                    Meu Barbeiro Pro
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
                                Política de Privacidade
                            </Heading>
                            <Text fontSize="md" color="barber.100">
                                Última atualização: 18 de julho de 2025
                            </Text>
                        </VStack>

                        <Box color="barber.100">
                            <VStack spacing={8} align="stretch">
                                <Box>
                                    <Heading as="h2" size="md" color="white" mb={4}>
                                        1. Introdução
                                    </Heading>
                                    <Text>
                                        O Meu Barbeiro Pro está comprometido em proteger sua privacidade. Esta política de privacidade explica como coletamos, usamos e protegemos suas informações pessoais quando você utiliza nossa plataforma e serviços.
                                    </Text>
                                </Box>

                                <Box>
                                    <Heading as="h2" size="md" color="white" mb={4}>
                                        2. Informações que Coletamos
                                    </Heading>
                                    <Text mb={4}>
                                        Podemos coletar os seguintes tipos de informações:
                                    </Text>
                                    <UnorderedList spacing={2} pl={6}>
                                        <ListItem>Informações de cadastro: nome, e-mail, telefone, endereço;</ListItem>
                                        <ListItem>Informações de pagamento: dados de cartão de crédito (processados de forma segura);</ListItem>
                                        <ListItem>Dados de uso da plataforma: registros de acesso, interações e preferências;</ListItem>
                                        <ListItem>Informações sobre agendamentos e serviços realizados;</ListItem>
                                        <ListItem>Informações sobre seus clientes (quando aplicável).</ListItem>
                                    </UnorderedList>
                                </Box>

                                <Box>
                                    <Heading as="h2" size="md" color="white" mb={4}>
                                        3. Como Usamos Suas Informações
                                    </Heading>
                                    <Text mb={4}>
                                        Utilizamos suas informações para:
                                    </Text>
                                    <UnorderedList spacing={2} pl={6}>
                                        <ListItem>Fornecer e melhorar nossos serviços;</ListItem>
                                        <ListItem>Processar pagamentos e transações;</ListItem>
                                        <ListItem>Enviar notificações importantes sobre sua conta ou serviços;</ListItem>
                                        <ListItem>Personalizar sua experiência na plataforma;</ListItem>
                                        <ListItem>Analisar o desempenho e uso da plataforma;</ListItem>
                                        <ListItem>Cumprir obrigações legais e regulatórias.</ListItem>
                                    </UnorderedList>
                                </Box>

                                <Box>
                                    <Heading as="h2" size="md" color="white" mb={4}>
                                        4. Compartilhamento de Informações
                                    </Heading>
                                    <Text mb={4}>
                                        Podemos compartilhar suas informações com:
                                    </Text>
                                    <UnorderedList spacing={2} pl={6}>
                                        <ListItem>Processadores de pagamento para completar transações;</ListItem>
                                        <ListItem>Prestadores de serviços que nos ajudam a operar nossa plataforma;</ListItem>
                                        <ListItem>Autoridades governamentais quando exigido por lei;</ListItem>
                                        <ListItem>Parceiros de negócios com seu consentimento explícito.</ListItem>
                                    </UnorderedList>
                                    <Text mt={4}>
                                        Não vendemos ou alugamos suas informações pessoais a terceiros para fins de marketing.
                                    </Text>
                                </Box>

                                <Box>
                                    <Heading as="h2" size="md" color="white" mb={4}>
                                        5. Segurança de Dados
                                    </Heading>
                                    <Text>
                                        Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado, perda acidental, uso indevido ou alteração. No entanto, nenhum método de transmissão pela internet ou sistema de armazenamento eletrônico é 100% seguro.
                                    </Text>
                                </Box>

                                <Box>
                                    <Heading as="h2" size="md" color="white" mb={4}>
                                        6. Seus Direitos
                                    </Heading>
                                    <Text mb={4}>
                                        Você tem o direito de:
                                    </Text>
                                    <UnorderedList spacing={2} pl={6}>
                                        <ListItem>Acessar as informações que temos sobre você;</ListItem>
                                        <ListItem>Corrigir informações inexatas;</ListItem>
                                        <ListItem>Solicitar a exclusão de suas informações (sujeito a certas exceções);</ListItem>
                                        <ListItem>Opor-se ao processamento de suas informações;</ListItem>
                                        <ListItem>Solicitar a portabilidade de seus dados.</ListItem>
                                    </UnorderedList>
                                    <Text mt={4}>
                                        Para exercer qualquer um desses direitos, entre em contato conosco através dos canais indicados abaixo.
                                    </Text>
                                </Box>

                                <Box>
                                    <Heading as="h2" size="md" color="white" mb={4}>
                                        7. Cookies e Tecnologias Similares
                                    </Heading>
                                    <Text>
                                        Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o tráfego e personalizar conteúdos. Você pode controlar o uso de cookies através das configurações do seu navegador, mas isso pode afetar a funcionalidade de nossos serviços.
                                    </Text>
                                </Box>

                                <Box>
                                    <Heading as="h2" size="md" color="white" mb={4}>
                                        8. Retenção de Dados
                                    </Heading>
                                    <Text>
                                        Mantemos suas informações pelo tempo necessário para fornecer nossos serviços, cumprir obrigações legais ou resolver disputas. Quando não houver mais uma necessidade comercial legítima para reter suas informações, nós as excluiremos ou anonimizaremos.
                                    </Text>
                                </Box>

                                <Box>
                                    <Heading as="h2" size="md" color="white" mb={4}>
                                        9. Menores de Idade
                                    </Heading>
                                    <Text>
                                        Nossos serviços não são destinados a pessoas com menos de 18 anos. Não coletamos intencionalmente informações de menores de 18 anos. Se tomarmos conhecimento de que coletamos informações de uma criança menor de 18 anos, tomaremos medidas para excluir essas informações.
                                    </Text>
                                </Box>

                                <Box>
                                    <Heading as="h2" size="md" color="white" mb={4}>
                                        10. Alterações nesta Política
                                    </Heading>
                                    <Text>
                                        Podemos atualizar esta política periodicamente. A versão mais recente estará sempre disponível em nosso site. Recomendamos que você revise esta política regularmente para se manter informado sobre como protegemos suas informações.
                                    </Text>
                                </Box>

                                <Box>
                                    <Heading as="h2" size="md" color="white" mb={4}>
                                        11. Contato
                                    </Heading>
                                    <Text>
                                        Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade ou sobre como tratamos suas informações pessoais, entre em contato conosco em: contato@meubarbeiropro.com ou através do nosso <Link href="/contato" style={{ color: "#fba931" }}>formulário de contato</Link>.
                                    </Text>
                                </Box>
                            </VStack>
                        </Box>
                    </VStack>
                </Container>
            </Box>

            {/* Footer */}
            <Box as="footer" bg="barber.900" py={8}>
                <Container maxW="container.xl">
                    <Flex direction="column" align="center">
                        <Text fontSize="sm" color="barber.100">
                            &copy; {new Date().getFullYear()} Meu Barbeiro Pro. Todos os direitos reservados.
                        </Text>
                    </Flex>
                </Container>
            </Box>
        </Box>
    );
}
