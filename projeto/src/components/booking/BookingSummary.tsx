import { VStack, Box, Heading, Text, Button, HStack } from "@chakra-ui/react";
import { PhoneIcon, TimeIcon, CheckCircleIcon, EmailIcon } from "@chakra-ui/icons";
import { FaCut, FaMoneyBillWave, FaUser } from "react-icons/fa";
import { formatPhoneNumber } from "../../utils/phoneFormatter";

interface Haircut {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface BookingSummaryProps {
  customerDetails: { name: string; phone: string; email?: string };
  selectedHaircut: Haircut | null;
  selectedTime: string;
  onReset: () => void;
}

const BookingSummary = ({ customerDetails, selectedHaircut, selectedTime, onReset }: BookingSummaryProps) => {
  // Formatação simplificada, apenas exibe o horário como texto sem tentar converter
  const formattedTime = selectedTime || "-";

  return (
    <VStack spacing={6} align="center" py={6}>
      <Box p={5} borderRadius="full" bg="orange.900" color="white"><CheckCircleIcon boxSize={10} /></Box>
      <Heading size="lg" color="white">Agendamento confirmado!</Heading>
      <Box bg="barber.900" borderRadius="lg" p={6} width="100% ">
        <VStack spacing={4} align="start" color={"white"}>



          <HStack align="center" spacing={2}>
            <FaUser color="#3182ce" size={20} />
            <Text as="strong" color="orange.900">Cliente:</Text>
            <Text>{customerDetails.name}</Text>
          </HStack>

          <HStack align="center" spacing={2}>
            <PhoneIcon color="green.500" />
            <Text as="strong" color="orange.900">Telefone:</Text>
            <Text>{formatPhoneNumber(customerDetails.phone)}</Text>
          </HStack>

          {customerDetails.email && (
            <HStack align="center" spacing={2}>
              <EmailIcon color="blue.500" />
              <Text as="strong" color="orange.900">E-mail:</Text>
              <Text>{customerDetails.email}</Text>
            </HStack>
          )}

          <HStack align="center" spacing={2}>
            <FaCut color="#805ad5" size={20} />
            <Text as="strong" color="orange.900">Serviço:</Text>
            <Text>{selectedHaircut?.name}</Text>
          </HStack>

          <HStack align="center" spacing={2}>
            <TimeIcon color="orange.400" />
            <Text as="strong" color="orange.900">Horário:</Text>
            <Text>{formattedTime}</Text>
          </HStack>

          <HStack align="center" spacing={2}>
            <FaMoneyBillWave color="#38b2ac" size={20} />
            <Text as="strong" color="orange.900">Valor:</Text>
            <Text>R$ {selectedHaircut?.price?.toFixed(2) || '0.00'}</Text>
          </HStack>



        </VStack>
      </Box>
      <Button colorScheme="orange" onClick={onReset} size="lg">Fazer Novo Agendamento</Button>
    </VStack>
  );
};

export default BookingSummary;
