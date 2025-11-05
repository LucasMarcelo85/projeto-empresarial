import { VStack, Heading, SimpleGrid, Button } from "@chakra-ui/react";

interface DateSelectionStepProps {
  formattedDates: { date: string; formatted: string }[];
  selectedDate: string;
  onSelect: (date: string) => void;
  onNext: () => void;
}

const DateSelectionStep = ({ formattedDates, selectedDate, onSelect, onNext }: DateSelectionStepProps) => {
  return (
    <VStack spacing={4} align="stretch">
      <Heading size="md" color="white">Selecione a data</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {formattedDates.map(({ date, formatted }) => (
          <Button
            key={date}
            variant={selectedDate === date ? "solid" : "outline"}
            bg={selectedDate === date ? "orange.900" : "barber.900"}
            onClick={() => { onSelect(date); setTimeout(onNext, 300); }}
            size="lg"
            height="70px"
          >
            {formatted}
          </Button>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default DateSelectionStep;
