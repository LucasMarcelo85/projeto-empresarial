import { VStack, Heading, SimpleGrid, Button, Alert, AlertIcon, Center, Text } from "@chakra-ui/react";

interface TimeSelectionStepProps {
  availableTimes: string[];
  selectedTime: string;
  onSelect: (time: string) => void;
  onNext: () => void;
  isLoading: boolean;
  isRetrying?: boolean;
  retryCount?: number;
  maxRetries?: number;
  onManualRetry?: () => void;
}

const TimeSelectionStep = ({
  availableTimes,
  selectedTime,
  onSelect,
  onNext,
  isLoading,
  isRetrying = false,
  retryCount = 0,
  maxRetries = 3,
  onManualRetry
}: TimeSelectionStepProps) => {
  const renderTimeButtons = (times: string[]) => (
    <SimpleGrid columns={{ base: 3, md: 4 }} spacing={3}>
      {times.map((displayTime) => {
        return (
          <Button
            key={displayTime}
            variant={selectedTime === displayTime ? "solid" : "outline"}
            bg={selectedTime === displayTime ? "orange.900" : "barber.900"}
            onClick={() => {
              console.log(`Selecionado: ${displayTime}`);
              onSelect(displayTime);
              setTimeout(onNext, 300);
            }}
          >
            {displayTime}
          </Button>
        );
      })}
    </SimpleGrid>
  );

  // Filtra os horários por período do dia
  const morningTimes = availableTimes.filter(t => {
    const [hours] = t.split(":").map(Number);
    return hours < 12;
  });

  const afternoonTimes = availableTimes.filter(t => {
    const [hours] = t.split(":").map(Number);
    return hours >= 12 && hours < 18;
  });

  const eveningTimes = availableTimes.filter(t => {
    const [hours] = t.split(":").map(Number);
    return hours >= 18;
  });

  const renderLoadingState = () => {
    if (isRetrying) {
      return (
        <Alert status="info" bg="blue.700" color="white" borderRadius="md" flexDirection="column" alignItems="center" p={4}>
          <AlertIcon />
          <Text mb={2} fontWeight="bold" textAlign="center">
            Tentando reconectar ao servidor ({retryCount}/{maxRetries})
          </Text>
          <Text fontSize="sm" textAlign="center">
            Aguarde um momento enquanto tentamos restabelecer a conexão...
          </Text>
          <Center mt={3}>
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </Center>
          <style jsx global>{`
            .loading-dots {
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .loading-dots span {
              display: inline-block;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background: white;
              margin: 0 6px;
              animation: loading 1.5s infinite ease-in-out;
            }
            .loading-dots span:nth-child(2) {
              animation-delay: 0.2s;
            }
            .loading-dots span:nth-child(3) {
              animation-delay: 0.4s;
            }
            @keyframes loading {
              0%, 100% { transform: scale(0.3); opacity: 0.3; }
              50% { transform: scale(1); opacity: 1; }
            }
          `}</style>
        </Alert>
      );
    }
    return <Center><Text color="white" p={4}>Carregando horários disponíveis...</Text></Center>;
  };

  return (
    <VStack spacing={5} align="stretch">
      <Heading size="md" color="white">Selecione o horário</Heading>

      {isLoading ? (
        renderLoadingState()
      ) : availableTimes.length === 0 ? (
        <VStack spacing={3}>
          <Alert status="warning" bg="barber.900" color="white">
            <AlertIcon /> Não há horários disponíveis para esta data. Os horários podem estar todos ocupados ou a agenda do profissional está fechada para este dia.
          </Alert>
          <Text fontSize="sm" color="gray.300" textAlign="center">
            Por favor, tente outra data ou entre em contato direto com o estabelecimento.
          </Text>
          {onManualRetry && (
            <Button
              size="md"
              colorScheme="blue"
              leftIcon={<span>🔄</span>}
              onClick={onManualRetry}
              w="100%"
            >
              Tentar carregar novamente
            </Button>
          )}
        </VStack>
      ) : (
        <VStack spacing={4} align="stretch">
          {morningTimes.length > 0 && <><Heading size="sm" color="gray.200">Manhã</Heading>{renderTimeButtons(morningTimes)}</>}
          {afternoonTimes.length > 0 && <><Heading size="sm" color="gray.200" mt={4}>Tarde</Heading>{renderTimeButtons(afternoonTimes)}</>}
          {eveningTimes.length > 0 && <><Heading size="sm" color="gray.200" mt={4}>Noite</Heading>{renderTimeButtons(eveningTimes)}</>}
        </VStack>
      )}
    </VStack>
  );
};

export default TimeSelectionStep;
