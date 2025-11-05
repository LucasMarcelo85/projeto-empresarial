import { useState, useEffect } from 'react';
import { VStack, FormControl, Button, Alert, AlertIcon, Box, Heading, Text } from '@chakra-ui/react';
import { EnhancedInput } from '../enhanced-input';
import { showWarningToast } from '../../utils/toastifyConfig';
import { formatPhoneNumber, cleanPhoneNumber, isValidPhoneNumber } from '../../utils/phoneFormatter';

interface CustomerInfoFormProps {
  onSubmit: (customer: { name: string; phone: string; email?: string }) => void;
  isLoading: boolean;
  bookingError: string;
}

export const CustomerInfoForm = ({ onSubmit, isLoading, bookingError }: CustomerInfoFormProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true); // Começa como true já que é opcional

  useEffect(() => {
    setIsPhoneValid(isValidPhoneNumber(phone));
  }, [phone]);

  useEffect(() => {
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsEmailValid(emailRegex.test(email));
    } else {
      setIsEmailValid(true); // E-mail vazio é considerado válido (opcional)
    }
  }, [email]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPhone(formatPhoneNumber(value));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulário de informações do cliente submetido");
    if (!name || !isPhoneValid || !isEmailValid) {
      showWarningToast('Por favor, preencha o nome, telefone válido e, se fornecido, e-mail válido.');
      return;
    }

    // Incluir email apenas se tiver sido preenchido
    const customerData = {
      name,
      phone: cleanPhoneNumber(phone),
      ...(email && { email })
    };

    onSubmit(customerData);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <VStack spacing={6} align="stretch">
        <Heading size="md" color="white">Suas informações</Heading>
        <FormControl isRequired>
          <EnhancedInput
            id="customer-name"
            label="Nome completo"
            placeholder="Digite seu nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </FormControl>

        <FormControl isRequired>
          <EnhancedInput
            id="customer-phone"
            label="Telefone"
            placeholder="(00) 00000-0000"
            value={phone}
            onChange={handlePhoneChange}
            isInvalid={!!phone && !isPhoneValid}
            errorMessage={phone && !isPhoneValid ? 'Telefone inválido' : ''}
            autoComplete="tel"
            maxLength={15}
          />
        </FormControl>

        <FormControl>
          <EnhancedInput
            id="customer-email"
            label="E-mail (opcional)"
            placeholder="seu.email@exemplo.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isInvalid={!!email && !isEmailValid}
            errorMessage={email && !isEmailValid ? 'E-mail inválido' : ''}
            autoComplete="email"
          />
        </FormControl>

        {bookingError && (
          <Alert status="error" bg="red.100" borderRadius="md">
            <AlertIcon />
            {bookingError}
          </Alert>
        )}

        <Box
          mt={4}
          p={4}
          bg="barber.900"
          borderRadius="md"
          borderWidth="1px"
          borderColor="gray.600"
        >
          <Text color="gray.300" fontSize="sm">
            <strong>Importante:</strong> Ao confirmar, você concorda em comparecer no horário. Em caso de imprevistos, por favor, entre em contato com a loja.
          </Text>
        </Box>

        <Button
          type="submit"
          colorScheme="orange"
          isLoading={isLoading}
          size="lg"
          isDisabled={!name || !isPhoneValid || !isEmailValid}
        >
          Confirmar Agendamento
        </Button>
      </VStack>
    </form>
  );
};