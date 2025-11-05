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

export default function Termos() {
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
                                Termos de Uso
                            </Heading>
                            <Text fontSize="md" color="barber.100">
                                Última atualização: 18 de julho de 2025
                            </Text>
                        </VStack>

                        <Box color="barber.100">
                            <VStack spacing={8} align="stretch">
                                <Box>
                                    <Heading as="h2" size="md" color="white" mb={4}>
                                        1. Aceitação dos Termos
                                    </Heading>
                                    <Text>
                                        Ao acessar e utilizar a plataforma Meu Barbeiro Pro, você concorda em cumprir e ficar vinculado aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes termos, não poderá acessar ou utilizar nossos serviços.
                                    </Text>
                                </Box>

                                <Box>
                                    <Heading as="h2" size="md" color="white" mb={4}>
                                        2. Descrição do Serviço
                                    </Heading>
                                    <Text mb={4}>
                                        O AutoVendas Pro oferece uma plataforma online para gestão de lojas de carros, incluindo anúncios, gerenciamento de clientes e agendamentos.
                                    </Text>
                                    <Text>
                                        Nos reservamos o direito de modificar, suspender ou descontinuar qualquer aspecto do serviço a qualquer momento, incluindo a disponibilidade de recursos, bancos de dados ou conteúdo.
                                    </Text>
                                </Box>

                                <Box>
                                    <Heading as="h2" size="md" color="white" mb={4}>
                                        3. Contas de Usuário
                                    </Heading>
                                    <Text mb={4}>
                                        Para utilizar nossos serviços, você deve criar uma conta fornecendo informações precisas e completas. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorram em sua conta.
                                    </Text>
                                    <Text>
                                        Você concorda em notificar imediatamente o AutoVendas Pro sobre qualquer uso não autorizado de sua conta ou qualquer outra violação de segurança.
                                    </Text>
                                </Box>

                                <Box>
                                    <Heading as="h2" size="md" color="white" mb={4}>
                                        4. Planos e Pagamentos
                                    </Heading>
                                    <Text mb={4}>
                                        Oferecemos diferentes planos de assinatura com recursos específicos. Ao assinar um plano pago, você concorda em pagar todas as taxas associadas ao plano escolhido.
                                    </Text>
                                    <Text>
                                        Os pagamentos são recorrentes e serão automaticamente renovados ao final de cada período de assinatura, a menos que você cancele sua assinatura antes da data de renovação.
                                    </Text>
                                </Box>

                                <Box>
                                    <Heading as="h2" size="md" color="white" mb={4}>
                                        5. Uso Aceitável
                                    </Heading>
                                    <Text mb={4}>
                                        Você concorda em utilizar os serviços apenas para fins legítimos e de acordo com estes termos.
                                    </Text>
                                    <Text mb={4}>
                                        Você não deve:
                                    </Text>
                                    <UnorderedList spacing={2} pl={6}>
                                        <ListItem>Usar os serviços para qualquer finalidade ilegal ou proibida;</ListItem>
                                        <ListItem>Tentar obter acesso não autorizado a qualquer parte dos serviços;</ListItem>
                                        <ListItem>Interferir no funcionamento adequado da plataforma;</ListItem>
                                        <ListItem>Coletar informações de outros usuários sem seu consentimento.</ListItem>
                                    </UnorderedList>
                                </Box>

                                <Box>
                                    <Heading as="h2" size="md" color="white" mb={4}>
                                        6. Propriedade Intelectual
                                    </Heading>
                                    <Text mb={4}>
                                        Todo o conteúdo, incluindo textos, gráficos, logotipos, ícones e software, é propriedade do Meu Barbeiro Pro e está protegido por leis de direitos autorais e outras leis de propriedade intelectual.
                                    </Text>
                                    <Text>
                                        Você não tem permissão para usar, copiar, reproduzir, distribuir ou criar trabalhos derivados desse conteúdo sem nossa autorização expressa por escrito.
                                    </Text>
                                </Box>

                                <Box>
                                    <Heading as="h2" size="md" color="white" mb={4}>
                                        7. Privacidade
                                    </Heading>
                                    <Text>
                                        Nossa Política de Privacidade descreve como coletamos, usamos e compartilhamos suas informações. Ao utilizar nossos serviços, você concorda com nossa Política de Privacidade, que pode ser acessada <Link href="/privacidade" style={{ color: "#fba931" }}>aqui</Link>.
                                    </Text>
                                </Box>

                                <Box>
                                    <Heading as="h2" size="md" color="white" mb={4}>
                                        8. Limitação de Responsabilidade
                                    </Heading>
                                    <Text>
                                        O Meu Barbeiro Pro não será responsável por quaisquer danos diretos, indiretos, incidentais, especiais ou consequenciais resultantes do uso ou incapacidade de usar nossos serviços, mesmo se tivermos sido informados da possibilidade de tais danos.
                                    </Text>
                                </Box>

                                <Box>
                                    <Heading as="h2" size="md" color="white" mb={4}>
                                        9. Modificações dos Termos
                                    </Heading>
                                    <Text>
                                        Reservamo-nos o direito de modificar estes termos a qualquer momento. As modificações entrarão em vigor imediatamente após a publicação dos termos atualizados. O uso continuado dos serviços após quaisquer modificações constitui sua aceitação dos novos termos.
                                    </Text>
                                </Box>

                                <Box>
                                    <Heading as="h2" size="md" color="white" mb={4}>
                                        10. Contato
                                    </Heading>
                                    <Text>
                                        Se você tiver alguma dúvida sobre estes termos, entre em contato conosco pelo e-mail: contato@autovendaspro.com ou através do nosso <Link href="/contato" style={{ color: "#fba931" }}>formulário de contato</Link>.
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
                            &copy; {new Date().getFullYear()} AutoVendas Pro. Todos os direitos reservados.
                        </Text>
                    </Flex>
                </Container>
            </Box>
        </Box>
    );
}
