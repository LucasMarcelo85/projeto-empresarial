import { VStack, Heading, SimpleGrid, Card, CardBody, Text, Badge } from "@chakra-ui/react";

interface Haircut {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface ServiceSelectionStepProps {
  haircuts: Haircut[];
  selectedHaircut: Haircut | null;
  onSelect: (haircut: Haircut) => void;
  onNext: () => void;
}

const ServiceSelectionStep = ({ haircuts, selectedHaircut, onSelect, onNext }: ServiceSelectionStepProps) => {
  return (
    <VStack spacing={4} align="stretch">
      <Heading size="md" color="white">Selecione o serviço</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {haircuts.map((haircut) => (
          <Card
            key={haircut.id}
            variant="outline"
            bg={"barber.900"}
            borderColor={selectedHaircut?.id === haircut.id ? "orange.900" : "gray.600"}
            cursor="pointer"
            onClick={() => { onSelect(haircut); setTimeout(onNext, 300); }}
            _hover={{ borderColor: "orange.900", transform: "translateY(-2px)" }}
          >
            <CardBody>
              <Heading size="sm" color="gray.100">{haircut.name}</Heading>
              <Text fontSize="xs" color="gray.400">Duração: {haircut.duration} min</Text>
              <Badge bg="orange.900" color="white" mt={2}>R$ {haircut.price.toFixed(2)}</Badge>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default ServiceSelectionStep;
